"use client";

/**
 * 示例：DatePicker 的弹层选日、快捷预设与一键清空。
 */
import { DatePicker } from "@matt-ui/ui";
import { useState } from "react";

const PRESETS = [
  { label: "今天", value: new Date(2026, 10, 22) },
  { label: "下周一", value: new Date(2026, 10, 23) },
  { label: "本月末", value: new Date(2026, 10, 30) },
];

export const DatePickerBasic = () => {
  const [date, setDate] = useState<Date | null>(new Date(2026, 10, 22));

  return (
    <div className="flex w-full max-w-xs flex-col gap-2.5">
      <DatePicker
        label="发布日期"
        placeholder="选择一个发布日"
        value={date}
        onValueChange={setDate}
        presets={PRESETS}
      />
      <p
        data-testid="date-picker-value"
        className="m-0 font-mono text-xs text-muted-foreground tabular-nums"
      >
        已选日期：
        {date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : "未选择"}
      </p>
    </div>
  );
};
