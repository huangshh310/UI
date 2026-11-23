import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
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

  it("支持状态筛选、inset 布局变体与导航/主操作回调", async () => {
    const user = userEvent.setup();
    const onNavChange = vi.fn<(id: string) => void>();
    const onPrimaryAction = vi.fn<() => void>();

    const { container } = render(
      <DashboardShellBlock
        variant="inset"
        primaryActionLabel="发布新版本"
        onNavChange={onNavChange}
        onPrimaryAction={onPrimaryAction}
      />,
    );

    expect(
      container.querySelector('[data-slot="dashboard-shell-block"]')?.getAttribute("data-variant"),
    ).toBe("inset");

    await user.click(screen.getByRole("button", { name: /边缘节点/ }));
    expect(onNavChange).toHaveBeenCalledWith("clusters");

    await user.click(screen.getByRole("button", { name: "同步中" }));
    expect(screen.getByText("docs-worker")).toBeTruthy();
    expect(screen.queryByText("edge-gateway")).toBeNull();

    await user.click(screen.getByRole("button", { name: "发布新版本" }));
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
  });
});
