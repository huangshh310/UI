import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SettleModal } from "../../index.js";

afterEach(cleanup);

describe("SettleModal", () => {
  it("点击触发器后打开具名对话框并支持 Escape 关闭", async () => {
    const user = userEvent.setup();
    render(
      <SettleModal
        trigger={<button type="button">打开弹窗</button>}
        title="归档工作区"
        description="归档后仍可随时恢复。"
      >
        <p>正文内容</p>
      </SettleModal>,
    );

    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "打开弹窗" }));

    const dialog = screen.getByRole("dialog", { name: "归档工作区" });
    expect(dialog).toBeTruthy();
    expect(screen.getByText("归档后仍可随时恢复。")).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("受控模式通过 onOpenChange 响应开关与关闭按钮", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    render(
      <SettleModal open onOpenChange={onOpenChange} title="确认发布" footer={<span>底部</span>}>
        <p>准备发布到生产环境</p>
      </SettleModal>,
    );

    expect(screen.getByRole("dialog", { name: "确认发布" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "关闭弹窗" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
