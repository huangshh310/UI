"use client";

/**
 * 示例：DatePicker 的视觉变体、圆角、辅助提示与错误校验态。
 */
import { DatePicker } from "@matt-ui/ui";
import { useState } from "react";

export default function DatePickerVariantsDemo() {
  const [billingDate, setBillingDate] = useState<Date | null>(new Date(2026, 10, 25));
  const [deadline, setDeadline] = useState<Date | null>(null);

  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <DatePicker
        label="账单结算日（Filled）"
        variant="filled"
        radius="lg"
        showTodayButton
        calendarRadius="full"
        value={billingDate}
        onValueChange={setBillingDate}
        hint="每月按选定日期自动生成发票"
      />
      <DatePicker
        label="版本冻结日（Elevated + 校验）"
        variant="elevated"
        radius="pill"
        value={deadline}
        onValueChange={setDeadline}
        placeholder="请选择冻结日期"
        error={deadline ? undefined : "上线前必须指定代码冻结日期"}
      />
    </div>
  );
}
