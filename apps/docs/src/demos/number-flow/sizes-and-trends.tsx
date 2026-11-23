"use client";

import { NumberFlow } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { useState } from "react";

const CARDS = [
  {
    label: "净留存率（sm）",
    size: "sm" as const,
    trend: "up" as const,
    base: 118.4,
    prefix: "+",
    suffix: "%",
  },
  {
    label: "人均耗时（md）",
    size: "md" as const,
    trend: "neutral" as const,
    base: 42,
    suffix: "ms",
  },
  {
    label: "错误率下降（lg）",
    size: "lg" as const,
    trend: "down" as const,
    base: 0.34,
    prefix: "-",
    suffix: "%",
  },
  { label: "季度营收（xl）", size: "xl" as const, trend: "up" as const, base: 94200, prefix: "¥" },
];

export default function NumberFlowSizesAndTrendsDemo() {
  const [bump, setBump] = useState(0);

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {CARDS.map((card) => {
          const factor = card.base < 10 ? 0.08 : card.base < 500 ? 3 : 2400;
          const val = Number((card.base + bump * factor).toFixed(2));
          return (
            <div
              key={card.label}
              className="flex flex-col justify-between gap-2.5 rounded-2xl border border-solid border-border/90 bg-card p-4 shadow-xs"
            >
              <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
              <NumberFlow
                value={val}
                size={card.size}
                trend={card.trend}
                prefix={card.prefix}
                suffix={card.suffix}
                format={{ maximumFractionDigits: card.base < 500 && card.base % 1 !== 0 ? 2 : 0 }}
              />
            </div>
          );
        })}
      </div>
      <Button size="sm" variant="outline" onClick={() => setBump((n) => (n + 1) % 4)}>
        模拟指标刷新
      </Button>
    </div>
  );
}
