/**
 * TriggerMenu 行为规约：验证 @ 文件与 / 指令光标触发检索、选择插入以及包裹 PromptInput 零侵入挂载。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  PromptInput,
  TriggerMenu,
  type TriggerMenuSelectPayload,
  type TriggerMenuSource,
} from "../../index.js";

beforeAll(() => {
  if (typeof Element !== "undefined") {
    Element.prototype.getAnimations ??= () => [];
    Element.prototype.scrollIntoView ??= () => {};
  }
  if (typeof document !== "undefined" && !document.querySelector("style[data-popover-test]")) {
    const style = document.createElement("style");
    style.setAttribute("data-popover-test", "");
    style.textContent = "[popover][data-open] { display: block !important; }";
    document.head.append(style);
  }
});

afterEach(cleanup);

const TRIGGERS: TriggerMenuSource[] = [
  {
    char: "@",
    type: "file",
    groupLabel: "工程文件",
    items: [
      { value: "src/routes.ts", label: "routes.ts", badge: "TS" },
      { value: "src/tokens.css", label: "tokens.css", badge: "CSS" },
    ],
  },
  {
    char: "/",
    type: "command",
    boundary: "start",
    groupLabel: "快捷指令",
    items: [
      { value: "review", label: "review", description: "执行静态变更审阅" },
      { value: "explain", label: "explain", description: "解析模块调用关系" },
    ],
  },
];

describe("TriggerMenu", () => {
  it("内置输入模式下键入 @ 呼出检索列表，过滤并选中后自动插入引用文本并触发 onSelect", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(payload: TriggerMenuSelectPayload) => void>();

    render(<TriggerMenu ariaLabel="消息草稿" triggers={TRIGGERS} onSelect={onSelect} />);

    const field = screen.getByRole("textbox", { name: "消息草稿" }) as HTMLTextAreaElement;
    await user.type(field, "请检查 @rou");

    const option = await screen.findByRole("option", { name: /routes\.ts/ });
    await user.click(option);

    expect(field.value).toContain("@routes.ts");
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        value: "src/routes.ts",
        trigger: "@",
      }),
    );
  });

  it("直接包裹 PromptInput 时自动绑定内部文本框，回车先选中指令而不误触发消息发送", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(text: string) => void>();
    const onSelect = vi.fn<(payload: TriggerMenuSelectPayload) => void>();

    render(
      <TriggerMenu triggers={TRIGGERS} onSelect={onSelect}>
        <PromptInput aria-label="智能体提示词" onSubmit={onSubmit} />
      </TriggerMenu>,
    );

    const textarea = screen.getByLabelText("智能体提示词") as HTMLTextAreaElement;
    await user.type(textarea, "/rev");
    expect(await screen.findByRole("option", { name: /review/ })).toBeTruthy();

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "review", trigger: "/" }),
    );
    expect(onSubmit).not.toHaveBeenCalled();

    await user.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("支持单行输入框模式、空结果提示文案以及按 Escape 键收起浮层", async () => {
    const user = userEvent.setup();

    render(
      <TriggerMenu
        ariaLabel="单行检索"
        multiline={false}
        emptyText="未检索到匹配目标"
        triggers={TRIGGERS}
      />,
    );

    const input = screen.getByRole("textbox", { name: "单行检索" });
    expect(input.tagName).toBe("INPUT");
    await user.type(input, "@none");
    expect(await screen.findByText("未检索到匹配目标")).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(screen.queryByText("未检索到匹配目标")).toBeNull();
  });
});
