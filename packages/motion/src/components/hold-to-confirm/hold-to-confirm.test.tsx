import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HoldToConfirm } from "../../index.js";

afterEach(cleanup);

describe("HoldToConfirm", () => {
  it("按住超过设定时长后完成确认并触发 onConfirm", async () => {
    const onConfirm = vi.fn<() => void>();
    render(
      <HoldToConfirm
        label="长按部署生产环境"
        confirmedLabel="已确认部署"
        holdDurationMs={40}
        onConfirm={onConfirm}
      />,
    );

    const btn = screen.getByRole("button", { name: "长按部署生产环境" });
    fireEvent.pointerDown(btn);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByText("已确认部署")).toBeTruthy();
  });

  it("长按中途触发 pointerCancel 或失焦时取消蓄力且不触发 onConfirm", async () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn<() => void>();
    render(<HoldToConfirm label="长按销毁环境" holdDurationMs={120} onConfirm={onConfirm} />);

    const btn = screen.getByRole("button", { name: "长按销毁环境" });
    fireEvent.pointerDown(btn);
    vi.advanceTimersByTime(60);
    fireEvent.pointerCancel(btn);
    vi.advanceTimersByTime(120);
    expect(onConfirm).not.toHaveBeenCalled();

    fireEvent.keyDown(btn, { key: "Enter" });
    vi.advanceTimersByTime(60);
    fireEvent.blur(btn);
    vi.advanceTimersByTime(120);
    expect(onConfirm).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
