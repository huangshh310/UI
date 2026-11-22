"use client";

import { Slider } from "@matt-ui/ui";
import { useState } from "react";

export default function SliderBasicDemo() {
  const [ratio, setRatio] = useState(65);
  const [range, setRange] = useState<[number, number]>([20, 80]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Slider
        label="日志采样率"
        value={ratio}
        onValueChange={(next) => typeof next === "number" && setRatio(next)}
        showValue
        formatValue={(v) => `${v}%`}
        marks={[
          { value: 0, label: "0%" },
          { value: 50, label: "50%" },
          { value: 100, label: "100%" },
        ]}
      />
      <Slider
        label="延迟告警区间"
        value={range}
        onValueChange={(next) => Array.isArray(next) && setRange(next)}
        showValue
        formatValue={(v) => `${v}ms`}
      />
    </div>
  );
}
