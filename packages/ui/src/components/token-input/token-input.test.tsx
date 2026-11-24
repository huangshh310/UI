/**
 * TokenInput 行为规约：验证内联上下文胶囊渲染、删除按钮、键入 @ 触发插入胶囊与序列化回传。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  TokenInput,
  serializeTokenValue,
  type TokenInputSegment,
  type TokenTriggerSource,
} from "../../index.js";

const ZERO_RECT: DOMRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 16,
  top: 0,
  right: 0,
  bottom: 16,
  left: 0,
  toJSON: () => ({}),
};

beforeAll(() => {
  if (typeof Element !== "undefined") {
    Element.prototype.getAnimations ??= () => [];
    Element.prototype.scrollIntoView ??= () => {};
  }
  if (typeof Range !== "undefined") {
    Range.prototype.getBoundingClientRect ??= () => ZERO_RECT;
    Range.prototype.getClientRects ??= () => [ZERO_RECT] as unknown as DOMRectList;
  }
  if (typeof document !== "undefined" && !document.querySelector("style[data-popover-test]")) {
    const style = document.createElement("style");
    style.setAttribute("data-popover-test", "");
    style.textContent = "[popover][data-open] { display: block !important; }";
    document.head.append(style);
  }
});

afterEach(cleanup);

const INITIAL_DRAFT: TokenInputSegment[] = [
  "对比分析 ",
  { type: "file", value: "src/routes.ts", label: "routes.ts", tone: "signal" },
  " 的边界条件",
];

const FILE_TRIGGERS: TokenTriggerSource[] = [
  {
    char: "@",
    type: "file",
    items: [
      { value: "src/schema.ts", label: "schema.ts", badge: "TS" },
      { value: "README.md", label: "README.md", badge: "MD" },
    ],
  },
];

describe("TokenInput", () => {
  it("渲染混合文本与上下文胶囊，支持序列化纯文本及点击移除按钮删除胶囊", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(val: TokenInputSegment[], text: string) => void>();

    expect(serializeTokenValue(INITIAL_DRAFT)).toContain("src/routes.ts");

    const { container } = render(
      <TokenInput
        ariaLabel="结构化提示词"
        defaultValue={INITIAL_DRAFT}
        onValueChange={onValueChange}
      />,
    );

    expect(screen.getByText("routes.ts")).toBeTruthy();
    const removeBtn = container.querySelector('[data-slot="token-input-token-remove"]');
    expect(removeBtn).toBeTruthy();

    await user.click(removeBtn as HTMLElement);
    expect(onValueChange).toHaveBeenCalled();
    expect(screen.queryByText("routes.ts")).toBeNull();
  });

  it("支持键入 @ 触发检索浮层并将选中项作为原子化胶囊插入编辑器", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(val: TokenInputSegment[], text: string) => void>();

    render(
      <TokenInput
        ariaLabel="任务指令"
        triggers={FILE_TRIGGERS}
        submitShortcut="enter"
        onSubmit={onSubmit}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "任务指令" });
    await user.click(editor);
    await user.keyboard("重构 @sch");

    const option = await screen.findByRole("option", { name: /schema\.ts/ });
    await user.click(option);

    expect(screen.getByText("schema.ts")).toBeTruthy();
  });

  it("配置 submitShortcut 为 enter 时按下回车回调结构化片段与纯文本串", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(val: TokenInputSegment[], text: string) => void>();

    render(
      <TokenInput
        ariaLabel="快捷提交框"
        defaultValue={INITIAL_DRAFT}
        submitShortcut="enter"
        onSubmit={onSubmit}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "快捷提交框" });
    await user.click(editor);
    await user.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [segments, text] = onSubmit.mock.calls[0]!;
    expect(segments).toHaveLength(3);
    expect(text).toContain("src/routes.ts");
  });
});
