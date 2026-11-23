"use client";

/**
 * 示例：Calendar 双月并排区间预订面板（带悬停实时预览）。
 */
import { Calendar, type DateRange } from "@matt-ui/ui";
import { useState } from "react";

export default function CalendarDualMonthDemo() {
  const [range, setRange] = useState<DateRange>({
    start: new Date(2026, 10, 24),
    end: new Date(2026, 11, 3),
  });

  return (
    <div className="flex flex-col items-center gap-2.5">
      <Calendar
        mode="range"
        numberOfMonths={2}
        size="sm"
        defaultMonth={new Date(2026, 10, 1)}
        range={range}
        onRangeChange={setRange}
        aria-label="双月跨月区间日历"
      />
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        跨月区间：{range.start?.toLocaleDateString("zh-CN") ?? "—"} –{" "}
        {range.end?.toLocaleDateString("zh-CN") ?? "选择结束日"}
      </span>
    </div>
  );
}
