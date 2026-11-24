import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiTestResults } from "../../index.js";

afterEach(cleanup);

describe("AiTestResults", () => {
  it("渲染汇总条、筛选芯片与默认展开的失败用例 Diff", () => {
    render(<AiTestResults />);
    expect(screen.getByText(/39 通过/)).toBeTruthy();
    expect(screen.getByText(/2 失败/)).toBeTruthy();
    expect(screen.getByText("src/cart/pricing.test.ts")).toBeTruthy();
    expect(screen.getAllByText("AssertionError").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/- Expected/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\+ Received/).length).toBeGreaterThan(0);
  });

  it("支持按全部、失败、跳过与慢速筛选用例", () => {
    render(<AiTestResults />);

    fireEvent.click(screen.getByRole("button", { name: /^失败/ }));
    expect(screen.getByText("同一张优惠券仅生效一次")).toBeTruthy();
    expect(screen.queryByText("按小计减免 10% 折扣")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /^跳过/ }));
    expect(screen.getByText("兼容旧版多币种四舍五入")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /^慢速/ }));
    expect(screen.getByText("批量结算 500 笔订单")).toBeTruthy();
  });

  it("支持折叠失败详情与触发复制测试报告回调", () => {
    const onCopy = vi.fn<(summary: string) => void>();
    render(<AiTestResults onCopy={onCopy} />);

    fireEvent.click(screen.getByRole("button", { name: "复制测试报告" }));
    expect(onCopy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /收起用例 同一张优惠券仅生效一次/ }));
    expect(screen.queryByText(/subtotal: 4200/)).toBeNull();
  });
});
