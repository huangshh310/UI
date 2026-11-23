/**
 * Calendar 单元测试：从包公开入口验证单选、区间选、月份切换、回到今天、禁用约束与键盘导航。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Calendar } from "../../index.js";

afterEach(cleanup);

describe("Calendar", () => {
  it("支持点击选择单日并触发 onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(date: Date | null) => void>();

    render(
      <Calendar
        defaultMonth={new Date(2026, 10, 1)}
        onValueChange={onValueChange}
        aria-label="排期日历"
      />,
    );

    const day15 = screen.getByRole("button", { name: /2026.*11.*15/ });
    await user.click(day15);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const picked = onValueChange.mock.calls[0]?.[0];
    expect(picked?.getFullYear()).toBe(2026);
    expect(picked?.getMonth()).toBe(10);
    expect(picked?.getDate()).toBe(15);
    expect(day15.getAttribute("aria-pressed")).toBe("true");
  });

  it("支持区间选择并自动纠正起止顺序", async () => {
    const user = userEvent.setup();
    const onRangeChange = vi.fn<(range: { start: Date | null; end: Date | null }) => void>();

    render(
      <Calendar mode="range" defaultMonth={new Date(2026, 10, 1)} onRangeChange={onRangeChange} />,
    );

    await user.click(screen.getByRole("button", { name: /2026.*11.*20/ }));
    await user.click(screen.getByRole("button", { name: /2026.*11.*12/ }));

    expect(onRangeChange).toHaveBeenLastCalledWith({
      start: new Date(2026, 10, 12),
      end: new Date(2026, 10, 20),
    });
  });

  it("支持翻月按钮与双月展示", async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn<(month: Date) => void>();

    render(
      <Calendar
        defaultMonth={new Date(2026, 10, 1)}
        numberOfMonths={2}
        onMonthChange={onMonthChange}
      />,
    );

    expect(screen.getAllByRole("table")).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "下个月" }));

    expect(onMonthChange).toHaveBeenCalledTimes(1);
    expect(onMonthChange.mock.calls[0]?.[0].getMonth()).toBe(11);
  });

  it("支持方向键与 Enter 键盘选择，并阻止禁用日期被选中", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(date: Date | null) => void>();

    render(
      <Calendar
        defaultMonth={new Date(2026, 10, 1)}
        defaultValue={new Date(2026, 10, 10)}
        minDate={new Date(2026, 10, 5)}
        maxDate={new Date(2026, 10, 25)}
        onValueChange={onValueChange}
      />,
    );

    const disabledDay = screen.getByRole("button", { name: "2026年11月3日" });
    expect((disabledDay as HTMLButtonElement).disabled).toBe(true);
    await user.click(disabledDay);
    expect(onValueChange).not.toHaveBeenCalled();

    const day10 = screen.getByRole("button", { name: "2026年11月10日" });
    day10.focus();
    await user.keyboard("{ArrowRight}{Enter}");

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0]?.[0]?.getDate()).toBe(11);
  });

  it("支持回到今天按钮、自定义页脚与视觉变体属性", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(date: Date | null) => void>();

    render(
      <Calendar
        variant="elevated"
        size="sm"
        radius="full"
        showTodayButton
        highlightDates={[new Date(2026, 10, 14)]}
        footer={<span>共 1 个里程碑</span>}
        defaultMonth={new Date(2026, 0, 1)}
        onValueChange={onValueChange}
      />,
    );

    expect(screen.getByText("共 1 个里程碑")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "回到今天" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });
});
