import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AvatarStack } from "../../index.js";

afterEach(cleanup);

const MEMBERS = [
  { id: "1", name: "林知远", role: "设计系统", initials: "林", status: "online" as const },
  { id: "2", name: "周宁", role: "前端架构", initials: "周", status: "busy" as const },
  { id: "3", name: "陈屿", role: "动效工程", initials: "陈", status: "away" as const },
  { id: "4", name: "许澄", role: "无障碍审计", initials: "许" },
];

describe("AvatarStack", () => {
  it("按 max 折叠多余成员并显示 +N 溢出计数", () => {
    render(<AvatarStack items={MEMBERS} max={2} />);
    expect(screen.getByText("林")).toBeTruthy();
    expect(screen.getByText("周")).toBeTruthy();
    expect(screen.queryByText("陈")).toBeNull();
    expect(screen.getByText("+2")).toBeTruthy();
  });

  it("悬停头像时通过 DirectionalTooltip 展示姓名与角色", async () => {
    const user = userEvent.setup();
    render(<AvatarStack items={MEMBERS.slice(0, 2)} tooltipDelay={0} />);

    await user.hover(screen.getByRole("button", { name: "林知远" }));
    expect(await screen.findByText("林知远 · 设计系统")).toBeTruthy();
  });

  it("支持 xs 尺寸、点击成员回调与溢出徽章点击回调", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn<(item: unknown) => void>();
    const onOverflowClick = vi.fn<() => void>();

    render(
      <AvatarStack
        items={MEMBERS}
        max={2}
        size="xs"
        ring="background"
        onItemClick={onItemClick}
        onOverflowClick={onOverflowClick}
      />,
    );

    await user.click(screen.getByRole("button", { name: "林知远" }));
    expect(onItemClick).toHaveBeenCalledWith(MEMBERS[0]);

    await user.click(screen.getByRole("button", { name: "还有 2 位成员" }));
    expect(onOverflowClick).toHaveBeenCalledTimes(1);
  });
});
