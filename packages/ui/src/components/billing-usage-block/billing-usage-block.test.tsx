import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BillingUsageBlock } from "../../index.js";

afterEach(cleanup);

describe("BillingUsageBlock", () => {
  it("展示当前套餐、配额进度与账单表格，点击升级按钮触发回调", async () => {
    const user = userEvent.setup();
    const onUpgrade = vi.fn<() => void>();

    render(<BillingUsageBlock onUpgrade={onUpgrade} />);
    expect(screen.getByText("专业版 · 团队计划")).toBeTruthy();
    expect(screen.getByText("API 调用配额")).toBeTruthy();
    expect(screen.getByText("INV-2026-11")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "升级企业版" }));
    expect(onUpgrade).toHaveBeenCalledTimes(1);
  });
});
