import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ActivityFeedBlock } from "../../index.js";

afterEach(cleanup);

describe("ActivityFeedBlock", () => {
  it("支持按分类页签切换动态，并可一键标为已读后显示空态", async () => {
    const user = userEvent.setup();
    const onMarkAllRead = vi.fn<() => void>();
    render(<ActivityFeedBlock onMarkAllRead={onMarkAllRead} />);

    expect(screen.getByText(/edge-gateway v2\.4/)).toBeTruthy();

    await user.click(screen.getByRole("tab", { name: /未读/ }));
    expect(screen.getByText(/edge-gateway v2\.4/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "全部已读" }));
    expect(screen.getByText("暂无未读通知")).toBeTruthy();
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });

  it("支持 list 变体、紧凑模式与单条标为已读回调", async () => {
    const user = userEvent.setup();
    const onMarkRead = vi.fn<(id: string) => void>();
    const { container } = render(
      <ActivityFeedBlock variant="list" compact onMarkRead={onMarkRead} />,
    );

    const root = container.querySelector('[data-slot="activity-feed-block"]');
    expect(root?.getAttribute("data-variant")).toBe("list");

    const markButtons = screen.getAllByRole("button", { name: "标为已读" });
    await user.click(markButtons[0]!);
    expect(onMarkRead).toHaveBeenCalledWith("a1");
  });
});
