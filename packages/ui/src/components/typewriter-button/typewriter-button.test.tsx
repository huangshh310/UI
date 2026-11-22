/**
 * TypewriterButton 的行为规约。
 *
 * 测试接缝：@matt-ui/ui 的公开入口。
 * 只覆盖逐字显示这件事本身的规则；视觉效果由展示站的端到端测试在真实浏览器中检查。
 */
import { act, cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TypewriterButton } from "../../index.js";

/** 按钮里当前可见的文字 */
const visibleText = () => screen.getByTestId("typewriter-text").textContent;

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("TypewriterButton", () => {
  it("点击后从头开始逐字显示，每个字符间隔 charDuration", async () => {
    render(<TypewriterButton label="Deploy" charDuration={100} />);
    expect(visibleText()).toBe("Deploy");

    await userEvent.click(screen.getByRole("button"));
    expect(visibleText()).toBe("");

    act(() => vi.advanceTimersByTime(300));
    expect(visibleText()).toBe("Dep");
  });

  it("全部显示完后调用一次 onComplete", async () => {
    const onComplete = vi.fn<() => void>();
    render(<TypewriterButton label="Go" charDuration={50} onComplete={onComplete} />);

    await userEvent.click(screen.getByRole("button"));
    act(() => vi.advanceTimersByTime(500));

    expect(visibleText()).toBe("Go");
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("打字过程中可访问名称始终是完整的文字", async () => {
    render(<TypewriterButton label="Deploy" charDuration={100} />);

    await userEvent.click(screen.getByRole("button"));
    act(() => vi.advanceTimersByTime(200));

    expect(screen.getByRole("button", { name: "Deploy" })).toBeTruthy();
  });

  it("autoStart 为真时挂载后立即开始打字", () => {
    render(<TypewriterButton label="Deploy" charDuration={100} autoStart />);

    act(() => vi.advanceTimersByTime(200));

    expect(visibleText()).toBe("De");
  });
});
