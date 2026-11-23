/**
 * DatePicker 单元测试：从包公开入口验证弹层展开、选择回填、快捷预设、校验态与清空行为。
 */
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DatePicker } from "../../index.js";

afterEach(cleanup);

describe("DatePicker", () => {
  it("点击触发器展开日历，选中日期后自动收起并回填触发器", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(date: Date | null) => void>();

    render(
      <DatePicker
        label="发布日期"
        placeholder="选择上线日期"
        defaultValue={new Date(2026, 10, 1)}
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole("button", { name: /发布日期|2026/ });
    await user.click(trigger);

    const day18 = await screen.findByRole("button", { name: /2026.*11.*18/ });
    await user.click(day18);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0]?.[0]?.getDate()).toBe(18);
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("支持快捷预设选择与一键清空", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(date: Date | null) => void>();
    const target = new Date(2026, 10, 28);

    render(
      <DatePicker
        aria-label="截止日期"
        presets={[{ label: "月底节点", value: target }]}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /截止日期/ }));
    await user.click(await screen.findByRole("button", { name: "月底节点" }));

    expect(onValueChange).toHaveBeenCalledWith(target);

    const clearBtn = screen.getByRole("button", { name: "清除日期" });
    await user.click(clearBtn);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("传入 error 与 hint 时展示对应提示并标记 aria-invalid", () => {
    const { rerender } = render(
      <DatePicker label="交付日期" variant="filled" size="sm" radius="pill" hint="请选择工作日" />,
    );

    expect(screen.getByText("请选择工作日")).toBeTruthy();

    rerender(<DatePicker label="交付日期" variant="elevated" error="交付日期不能早于今天" />);

    const trigger = screen.getByRole("button", { name: /交付日期/ });
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("交付日期不能早于今天")).toBeTruthy();
  });
});
