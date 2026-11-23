import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StatsOverviewBlock } from "../../index.js";

afterEach(cleanup);

describe("StatsOverviewBlock", () => {
  it("展示多周期 KPI 指标，切换统计周期后更新目标读数与趋势徽章", async () => {
    const user = userEvent.setup();
    const onPeriodChange = vi.fn<(period: string) => void>();
    render(<StatsOverviewBlock onPeriodChange={onPeriodChange} />);

    expect(screen.getByText("月度经常性收入")).toBeTruthy();
    expect(screen.getByText("+14.2%")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "本季度" }));
    expect(screen.getByText("+38.6%")).toBeTruthy();
    expect(onPeriodChange).toHaveBeenCalledWith("quarter");
  });

  it("支持 bento 变体与紧凑模式配置", () => {
    const { container } = render(
      <StatsOverviewBlock variant="bento" columns={2} compact title="核心经营指标" />,
    );

    const root = container.querySelector('[data-slot="stats-overview-block"]');
    expect(root?.getAttribute("data-variant")).toBe("bento");
    expect(screen.getByText("核心经营指标")).toBeTruthy();
    expect(screen.queryByText("月目标 86%")).toBeNull();
  });
});
