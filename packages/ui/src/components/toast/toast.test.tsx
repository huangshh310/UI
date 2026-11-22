import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "../../index.js";

afterEach(cleanup);

const TriggerHarness = ({ onUndo }: { onUndo: () => void }) => {
  const { toast } = useToast();
  return (
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
});
