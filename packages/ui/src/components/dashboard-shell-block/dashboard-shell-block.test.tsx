import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { DashboardShellBlock } from "../../index.js";

beforeAll(() => {
  if (typeof Element !== "undefined" && !Element.prototype.getAnimations) {
    Element.prototype.getAnimations = () => [];
  }
});

afterEach(cleanup);

describe("DashboardShellBlock", () => {
  it("渲染侧边导航、KPI 指标卡与数据表格并支持切换导航分组", async () => {
    const user = userEvent.setup();
    render(<DashboardShellBlock />);

    expect(screen.getByText("活跃部署")).toBeTruthy();
    expect(screen.getByText("edge-gateway")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "折叠侧边栏" }));
    expect(screen.getByRole("button", { name: "展开侧边栏" })).toBeTruthy();
  });
});
