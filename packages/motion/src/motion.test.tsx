/**
 * @matt-ui/motion 各组件的行为规约。
 *
 * 测试接缝：包的公开入口。只覆盖组件自己做出的状态与可访问性决定；
 * 弹簧、拖拽、磁吸这些手感由展示站的端到端测试在真实浏览器中检查。
 */
import { act, cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DragToConfirm, LiquidToggle, MagneticButton, MorphingButton } from "./index.js";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("LiquidToggle", () => {
  it("是一个开关，点击在开与关之间切换并通知新值", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(<LiquidToggle aria-label="通知" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole("switch", { name: "通知" });
    expect(toggle.getAttribute("aria-checked")).toBe("false");

    await userEvent.click(toggle);

    expect(toggle.getAttribute("aria-checked")).toBe("true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("受控时只由外部的 checked 决定状态", async () => {
    render(<LiquidToggle aria-label="通知" checked={false} onCheckedChange={() => {}} />);

    await userEvent.click(screen.getByRole("switch"));

    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("false");
  });
});

describe("MorphingButton", () => {
  it("可访问名称跟随状态变化", () => {
    const { rerender } = render(<MorphingButton status="idle" />);
    expect(screen.getByRole("button", { name: "Save changes" })).toBeTruthy();

    rerender(<MorphingButton status="success" />);

    expect(screen.getByRole("button", { name: "Saved" })).toBeTruthy();
  });

  it("加载中声明忙碌，并且不会再次触发 onClick", async () => {
    const onClick = vi.fn<() => void>();
    render(<MorphingButton status="loading" onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Saving…" });

    await userEvent.click(button);

    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("DragToConfirm", () => {
  it("键盘用户按 Enter 即可确认，确认结果会被播报", async () => {
    const onConfirm = vi.fn<() => void>();
    render(<DragToConfirm label="滑动删除" confirmedLabel="已删除" onConfirm={onConfirm} />);

    screen.getByRole("button", { name: /滑动删除/ }).focus();
    await userEvent.keyboard("{Enter}");

    expect(onConfirm).toHaveBeenCalledTimes(1);
    // 确认文字既显示在轨道上，也通过播报区告知屏幕阅读器
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe("已删除");
  });

  it("确认后经过 autoResetDelay 自动复位并调用 onReset", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onReset = vi.fn<() => void>();
    render(<DragToConfirm label="滑动删除" autoResetDelay={1000} onReset={onReset} />);

    screen.getByRole("button", { name: /滑动删除/ }).focus();
    await userEvent.keyboard("{Enter}");
    act(() => vi.advanceTimersByTime(1100));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /滑动删除/ })).toBeTruthy();
  });

  it("禁用时按 Enter 不会确认", async () => {
    const onConfirm = vi.fn<() => void>();
    render(<DragToConfirm label="滑动删除" disabled onConfirm={onConfirm} />);

    screen.getByRole("button", { name: /滑动删除/ }).focus();
    await userEvent.keyboard("{Enter}");

    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe("MagneticButton", () => {
  it("是一个普通按钮，点击照常触发", async () => {
    const onClick = vi.fn<() => void>();
    render(<MagneticButton onClick={onClick}>Launch</MagneticButton>);

    await userEvent.click(screen.getByRole("button", { name: "Launch" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
