"use client";

import { Slider } from "@matt-ui/ui";

export default function SliderTonesDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Slider
        label="信号蓝精度（sm + Tooltip）"
        size="sm"
        tone="signal"
        defaultValue={68}
        showValue
        showTooltip
        formatValue={(v) => `${v}%`}
      />
      <Slider
        label="健康度阈值（md + Emerald）"
        size="md"
        tone="emerald"
        defaultValue={85}
        showValue
        showTooltip
        formatValue={(v) => `${v}ms`}
      />
      <Slider
        label="触控大轨道（lg + 刻度）"
        size="lg"
        tone="default"
        defaultValue={50}
        step={25}
        showTooltip
        marks={[
          { value: 0, label: "低" },
          { value: 50, label: "标准" },
          { value: 100, label: "极速" },
        ]}
      />
    </div>
  );
}
