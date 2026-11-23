/**
 * DragToConfirm 的行为规约。
 */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DragToConfirm } from "../../index.js";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("DragToConfirm", () => {
  it("键盘聚焦滑块按 Enter 确认并触发 onConfirm，超时后自动复位并触发 onReset", () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn<() => void>();
    const onReset = vi.fn<() => void>();
    render(
      <DragToConfirm
        label="滑动确认转账"
        confirmedLabel="已发起转账"
        tone="emerald"
        variant="glass"
        size="sm"
        autoResetDelay={1000}
        haptics={false}
        onConfirm={onConfirm}
        onReset={onReset}
      />,
    );

    const handle = screen.getByRole("button", { name: /滑动确认转账/ });
    const track = handle.closest('[data-slot="drag-to-confirm"]');
    expect(track?.getAttribute("data-tone")).toBe("emerald");
    expect(track?.getAttribute("data-variant")).toBe("glass");
    expect(track?.getAttribute("data-size")).toBe("sm");

    fireEvent.keyDown(handle, { key: "Enter" });
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(track?.hasAttribute("data-confirmed")).toBe(true);

    act(() => vi.advanceTimersByTime(1000));
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(track?.hasAttribute("data-confirmed")).toBe(false);
  });

  it("disabled 为真时按 Enter 不触发确认", () => {
    const onConfirm = vi.fn<() => void>();
    render(<DragToConfirm label="滑动删除" disabled onConfirm={onConfirm} />);

    const handle = screen.getByRole("button", { name: /滑动删除/ });
    fireEvent.keyDown(handle, { key: "Enter" });

    expect(onConfirm).not.toHaveBeenCalled();
  });
});
