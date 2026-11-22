"use client";

import { Slider } from "@matt-ui/ui";
import { useState } from "react";

export default function SliderRangeDemo() {
  const [range, setRange] = useState<[number, number]>([120, 480]);

  return (
    <div className="w-full max-w-sm">
      <Slider
        label="月度预算区间"
        value={range}
        onValueChange={(next) => Array.isArray(next) && setRange(next)}
        min={0}
        max={600}
        step={20}
        showValue
        formatValue={(v) => `¥${v}`}
        marks={[
          { value: 0, label: "¥0" },
          { value: 300, label: "¥300" },
          { value: 600, label: "¥600" },
        ]}
      />
    </div>
  );
}
