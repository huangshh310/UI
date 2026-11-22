import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { StatsOverviewBlock } from "../../index.js";

afterEach(cleanup);

describe("StatsOverviewBlock", () => {
  it("展示多周期 KPI 指标，切换统计周期后更新目标读数与趋势徽章", async () => {
    const user = userEvent.setup();
    render(<StatsOverviewBlock />);

    expect(screen.getByText("月度经常性收入")).toBeTruthy();
    expect(screen.getByText("+14.2%")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "本季度" }));
    expect(screen.getByText("+38.6%")).toBeTruthy();
  });
});
