"use client";

import { DatePicker, type DateRange } from "@matt-ui/ui";
import { useState } from "react";

export default function DatePickerRangeDemo() {
  const [range, setRange] = useState<DateRange>({
    start: new Date(2026, 10, 1),
    end: new Date(2026, 10, 14),
  });

  return (
    <div className="w-full max-w-xs">
      <DatePicker
        mode="range"
        label="迭代周期（含快捷预设）"
        range={range}
        onRangeChange={setRange}
        clearable
        presets={[
          {
            label: "近 7 天",
            range: { start: new Date(2026, 10, 15), end: new Date(2026, 10, 22) },
          },
          {
            label: "本双周迭代",
            range: { start: new Date(2026, 10, 9), end: new Date(2026, 10, 22) },
          },
        ]}
      />
    </div>
  );
}
