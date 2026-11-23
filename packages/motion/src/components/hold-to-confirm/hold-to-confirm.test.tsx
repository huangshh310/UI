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

  it("支持 variant、tone、size、radius 以及重置按钮回调", async () => {
    const onConfirm = vi.fn<() => void>();
    const onReset = vi.fn<() => void>();
    render(
      <HoldToConfirm
        variant="solid"
        tone="emerald"
        size="sm"
        radius="default"
        holdDurationMs={30}
        label="长按发布"
        confirmedLabel="已发布"
        onConfirm={onConfirm}
        onReset={onReset}
      />,
    );

    const btn = screen.getByRole("button", { name: "长按发布" });
    const root = btn.closest('[data-slot="hold-to-confirm"]');
    expect(root?.getAttribute("data-variant")).toBe("solid");
    expect(root?.getAttribute("data-tone")).toBe("emerald");
    expect(root?.getAttribute("data-size")).toBe("sm");
    expect(root?.getAttribute("data-radius")).toBe("default");

    fireEvent.pointerDown(btn);
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
    expect(root?.hasAttribute("data-confirmed")).toBe(true);

    const resetBtn = screen.getByRole("button", { name: "重置确认状态" });
    fireEvent.click(resetBtn);
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(root?.hasAttribute("data-confirmed")).toBe(false);
  });
});
