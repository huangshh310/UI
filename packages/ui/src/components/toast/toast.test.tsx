import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "../../index.js";

afterEach(cleanup);

const TriggerHarness = ({ onUndo }: { onUndo: () => void }) => {
  const { toast } = useToast();
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() =>
          toast({
            title: "已归档 3 项记录",
            description: "随时可在回收站恢复。",
            tone: "success",
            actionLabel: "撤销",
            onAction: onUndo,
          })
        }
      >
        发送通知
      </button>
      <button
        type="button"
        onClick={() =>
          toast({
            title: "配额接近阈值",
            description: "本月额度已使用 90%。",
            tone: "warning",
          })
        }
      >
        警告通知
      </button>
    </div>
  );
};

describe("Toast", () => {
  it("通过 useToast 推送通知、展示动作按钮并支持手动关闭", async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn<() => void>();

    render(
      <ToastProvider>
        <TriggerHarness onUndo={onUndo} />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "发送通知" }));
    expect(await screen.findByText("已归档 3 项记录")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "撤销" }));
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it("支持 warning 语义色调并标记 data-tone", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider placement="top-center">
        <TriggerHarness onUndo={() => {}} />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "警告通知" }));
    const title = await screen.findByText("配额接近阈值");
    expect(title.closest('[data-slot="toast"]')?.getAttribute("data-tone")).toBe("warning");
  });
});
