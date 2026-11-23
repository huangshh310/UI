import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TeamMembersBlock } from "../../index.js";

afterEach(cleanup);

describe("TeamMembersBlock", () => {
  it("支持按关键字筛选成员、邀请新成员并触发回调", async () => {
    const user = userEvent.setup();
    const onInvite = vi.fn<(payload: { name: string; email: string; role: string }) => void>();

    render(<TeamMembersBlock onInvite={onInvite} />);
    expect(screen.getByText("林知远")).toBeTruthy();

    await user.type(screen.getByLabelText("搜索团队成员"), "不存在");
    expect(screen.getByText("没有匹配的团队成员")).toBeTruthy();

    await user.clear(screen.getByLabelText("搜索团队成员"));
    await user.click(screen.getByRole("button", { name: "邀请成员" }));
    await user.type(screen.getByLabelText("成员姓名"), "沈清");
    await user.type(screen.getByLabelText("成员邮箱"), "shen@matt.dev");
    await user.click(screen.getByRole("button", { name: "发送邀请" }));

    expect(onInvite).toHaveBeenCalledWith({
      name: "沈清",
      email: "shen@matt.dev",
      role: "开发",
    });
    expect(screen.getByText("沈清")).toBeTruthy();
  });

  it("支持席位配额展示、紧凑模式与移除回调", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn<(id: string) => void>();

    render(<TeamMembersBlock compact maxSeats={10} onRemove={onRemove} />);
    expect(screen.getByText("4 / 10 席")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "移除 许澄" }));
    expect(onRemove).toHaveBeenCalledWith("m4");
    expect(screen.getByText("3 / 10 席")).toBeTruthy();
  });
});
