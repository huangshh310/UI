"use client";

import { Calendar, type DateRange } from "@matt-ui/ui";
import { useState } from "react";

export default function CalendarRangeDemo() {
  const [range, setRange] = useState<DateRange>({
    start: new Date(2026, 10, 10),
    end: new Date(2026, 10, 18),
  });

  return (
    <div className="flex flex-col items-center gap-2.5">
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 10, 1)}
        range={range}
        onRangeChange={setRange}
        isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
      />
      <span className="font-mono text-xs text-muted-foreground">
        已选工作日区间：{range.start?.toLocaleDateString("zh-CN") ?? "—"} 至{" "}
        {range.end?.toLocaleDateString("zh-CN") ?? "—"}
      </span>
    </div>
  );
}
