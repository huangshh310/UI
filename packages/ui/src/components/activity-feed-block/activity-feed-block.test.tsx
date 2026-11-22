import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ActivityFeedBlock } from "../../index.js";

afterEach(cleanup);

describe("ActivityFeedBlock", () => {
  it("支持按分类页签切换动态，并可一键标为已读后显示空态", async () => {
    const user = userEvent.setup();
    render(<ActivityFeedBlock />);

    expect(screen.getByText(/edge-gateway v2\.4/)).toBeTruthy();

    await user.click(screen.getByRole("tab", { name: /未读/ }));
    expect(screen.getByText(/edge-gateway v2\.4/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "全部已读" }));
    expect(screen.getByText("暂无未读通知")).toBeTruthy();
  });
});
