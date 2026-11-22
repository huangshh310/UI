import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PricingBlock } from "../../index.js";

afterEach(cleanup);

describe("PricingBlock", () => {
  it("切换按年计费时滚动更新价格并触发套餐选择回调", async () => {
    const user = userEvent.setup();
    const onSelectPlan = vi.fn<(id: string, cycle: "monthly" | "yearly") => void>();

    render(<PricingBlock onSelectPlan={onSelectPlan} />);
    expect(screen.getByText(/199/)).toBeTruthy();

    await user.click(screen.getByRole("switch", { name: "按年计费" }));
    expect(screen.getByText(/159/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "升级专业版" }));
    expect(onSelectPlan).toHaveBeenCalledWith("pro", "yearly");
  });
});
