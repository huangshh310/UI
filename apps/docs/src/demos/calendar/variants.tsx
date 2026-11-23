"use client";

/**
 * 示例：Calendar 的紧凑圆形风格、日程打点标注与“回到今天”快捷栏。
 */
import { Calendar } from "@matt-ui/ui";
import { useState } from "react";

const MILESTONES = [
  new Date(2026, 10, 6),
  new Date(2026, 10, 14),
  new Date(2026, 10, 21),
  new Date(2026, 10, 28),
];

export default function CalendarVariantsDemo() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 10, 14));

  return (
    <div className="flex flex-wrap items-start justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Calendar
          size="sm"
          radius="full"
          variant="elevated"
          weekStartsOn={1}
          defaultMonth={new Date(2026, 10, 1)}
          value={date}
          onValueChange={setDate}
          highlightDates={MILESTONES}
          showTodayButton
          footer={
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {date ? `${date.getMonth() + 1}月${date.getDate()}日` : "未选择"}
            </span>
          }
          aria-label="圆形紧凑日程月历"
        />
        <span className="text-xs text-muted-foreground">圆形紧凑 + 周一起始 + 日程打点</span>
      </div>
    </div>
  );
}
