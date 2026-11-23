/**
 * SpringSelect 的行为规约。
 * 测试接缝：@matt-ui/ui 的公开入口。
 * 真实浏览器下的键盘空窗（Base UI 偏差 #3）、typeahead 与焦点恢复由展示站 E2E 覆盖。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SpringSelect } from "../../index.js";

const OPTIONS = [
  { value: "tokyo", label: "东京", description: "ap-northeast-1" },
  { value: "singapore", label: "新加坡", description: "ap-southeast-1" },
  { value: "frankfurt", label: "法兰克福", disabled: true },
];

const RICH_OPTIONS = [
  {
    value: "gemini",
    label: "Gemini 2.5 Pro",
    description: "复杂推理与长上下文",
    badge: "推荐",
    dot: "signal" as const,
    icon: <span data-testid="icon-gemini">✦</span>,
    group: "旗舰模型",
  },
  {
    value: "flash",
    label: "Gemini 2.5 Flash",
    description: "低延迟日常响应",
    badge: "高速",
    dot: "success" as const,
    icon: <span data-testid="icon-flash">⚡</span>,
    group: "轻量模型",
  },
];

afterEach(cleanup);

describe("SpringSelect", () => {
  it("点击触发器展开全部选项，选择后更新显示并回调 onValueChange", async () => {
    const onValueChange = vi.fn<(value: string | null) => void>();
    render(
      <SpringSelect
        label="部署区域"
        placeholder="选择区域"
        options={OPTIONS}
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "部署区域" });
    expect(trigger.textContent).toContain("选择区域");

    await userEvent.click(trigger);
    expect(await screen.findByRole("listbox")).toBeTruthy();

    await userEvent.click(await screen.findByRole("option", { name: /新加坡/ }));
    expect(onValueChange).toHaveBeenCalledWith("singapore");
    expect(trigger.textContent).toContain("新加坡");
  });

  it("受控模式下将 value 重置为 null 后回到占位文本", () => {
    const { rerender } = render(
      <SpringSelect label="部署区域" placeholder="选择区域" options={OPTIONS} value="tokyo" />,
    );
    const trigger = screen.getByRole("combobox", { name: "部署区域" });
    expect(trigger.textContent).toContain("东京");

    rerender(
      <SpringSelect label="部署区域" placeholder="选择区域" options={OPTIONS} value={null} />,
    );
    expect(trigger.textContent).toContain("选择区域");
  });

  it("禁用选项不可选中，disabled 触发器不会打开列表", async () => {
    const onValueChange = vi.fn<(value: string | null) => void>();
    render(<SpringSelect label="部署区域" options={OPTIONS} onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("combobox", { name: "部署区域" }));
    await userEvent.click(await screen.findByRole("option", { name: /法兰克福/ }));
    expect(onValueChange).not.toHaveBeenCalled();

    cleanup();
    render(<SpringSelect label="锁定区域" options={OPTIONS} disabled />);
    await userEvent.click(screen.getByRole("combobox", { name: "锁定区域" }));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("支持分组标题、图标、徽章与自定义弹窗页眉页脚，并在触发器回显选中图标", async () => {
    render(
      <SpringSelect
        label="默认模型"
        options={RICH_OPTIONS}
        defaultValue="gemini"
        popupHeader="选择推理引擎"
        popupFooter="随时可在工作台切换"
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "默认模型" });
    expect(trigger.textContent).toContain("Gemini 2.5 Pro");
    expect(screen.getByTestId("icon-gemini")).toBeTruthy();

    await userEvent.click(trigger);
    expect(await screen.findByText("旗舰模型")).toBeTruthy();
    expect(screen.getByText("轻量模型")).toBeTruthy();
    expect(screen.getByText("选择推理引擎")).toBeTruthy();
    expect(screen.getByText("随时可在工作台切换")).toBeTruthy();
    expect(screen.getByText("高速")).toBeTruthy();
  });

  it("开启 clearable 时点击清空按钮可重置非受控值并触发 onValueChange(null)", async () => {
    const onValueChange = vi.fn<(value: string | null) => void>();
    render(
      <SpringSelect
        label="部署区域"
        placeholder="选择区域"
        options={OPTIONS}
        defaultValue="tokyo"
        clearable
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "部署区域" });
    expect(trigger.textContent).toContain("东京");

    await userEvent.click(screen.getByRole("button", { name: "清空选择" }));
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(trigger.textContent).toContain("选择区域");
    expect(screen.queryByRole("button", { name: "清空选择" })).toBeNull();
  });

  it("支持变体、尺寸、圆角、辅助提示与错误校验态（aria-invalid）", () => {
    const { container, rerender } = render(
      <SpringSelect
        label="节点"
        options={OPTIONS}
        variant="filled"
        size="lg"
        radius="pill"
        tone="signal"
        hint="就近接入可降低首包延迟"
      />,
    );

    expect(screen.getByText("就近接入可降低首包延迟")).toBeTruthy();
    expect(container.querySelector('[data-slot="spring-select"]')).toBeTruthy();

    rerender(
      <SpringSelect
        label="节点"
        options={OPTIONS}
        variant="elevated"
        error="请先选择一个可用区域"
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "节点" });
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("请先选择一个可用区域")).toBeTruthy();
  });

  it("支持 multiple 多选模式：可连续勾选/取消、折叠超出芯片并一键清空", async () => {
    const onValueChange = vi.fn<(value: string[]) => void>();
    render(
      <SpringSelect
        multiple
        label="部署节点"
        placeholder="选择多个节点"
        options={[
          { value: "tokyo", label: "Tokyo" },
          { value: "singapore", label: "Singapore" },
          { value: "oregon", label: "Oregon" },
        ]}
        maxTagCount={2}
        clearable
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "部署节点" });
    expect(trigger.textContent).toContain("选择多个节点");

    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", { name: /Tokyo/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["tokyo"]);

    await userEvent.click(screen.getByRole("option", { name: /Singapore/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["tokyo", "singapore"]);

    await userEvent.click(screen.getByRole("option", { name: /Oregon/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["tokyo", "singapore", "oregon"]);
    expect(trigger.textContent).toContain("Tokyo");
    expect(trigger.textContent).toContain("Singapore");
    expect(trigger.textContent).toContain("+1");

    // 再次点击已选项可取消勾选
    await userEvent.click(screen.getByRole("option", { name: /Singapore/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["tokyo", "oregon"]);

    // 点击外部清空按钮重置为空数组
    await userEvent.keyboard("{Escape}");
    await userEvent.click(screen.getByRole("button", { name: "清空选择" }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
    expect(trigger.textContent).toContain("选择多个节点");
  });
});
