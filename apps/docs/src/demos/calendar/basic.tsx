"use client";

/**
 * 示例：Calendar 的单日与区间选择切换。
 */
import { Calendar, type DateRange } from "@matt-ui/ui";
import { useState } from "react";

const INITIAL_MONTH = new Date(2026, 10, 1);

export const CalendarBasic = () => {
  const [range, setRange] = useState<DateRange>({
    start: new Date(2026, 10, 10),
    end: new Date(2026, 10, 16),
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar
        mode="range"
        defaultMonth={INITIAL_MONTH}
        range={range}
        onRangeChange={setRange}
        aria-label="迭代排期日历"
      />
      <p
        data-testid="calendar-range"
        className="m-0 font-mono text-xs text-muted-foreground tabular-nums"
      >
        {range.start && range.end
          ? `${range.start.getMonth() + 1}/${range.start.getDate()} – ${range.end.getMonth() + 1}/${range.end.getDate()}`
          : range.start
            ? `已选起点：${range.start.getMonth() + 1}/${range.start.getDate()}`
            : "点击日期选择区间"}
      </p>
    </div>
  );
};
