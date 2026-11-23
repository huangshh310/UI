"use client";

import { NumberFlow } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { ArrowDownRight, ArrowUpRight, RotateCcw } from "lucide-react";
import { useState } from "react";

const SAMPLES = [1280, 4890, 12450, 860];

export default function NumberFlowBasicDemo() {
  const [idx, setIdx] = useState(0);
  const [trend, setTrend] = useState<"neutral" | "up" | "down">("neutral");
  const current = SAMPLES[idx] ?? 1280;

  const stepTo = (nextIdx: number) => {
    const nextVal = SAMPLES[nextIdx] ?? 1280;
    setTrend(nextVal > current ? "up" : nextVal < current ? "down" : "neutral");
    setIdx(nextIdx);
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-[22px] border border-solid border-border/90 bg-card p-6 shadow-xs">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-medium text-muted-foreground">月度经常性订阅（MRR）</span>
        <NumberFlow
          value={current}
          prefix="¥"
          suffix="/月"
          size="xl"
          trend={trend}
          format={{ maximumFractionDigits: 0 }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => stepTo((idx + SAMPLES.length - 1) % SAMPLES.length)}
        >
          <ArrowDownRight aria-hidden="true" className="size-3.5" />
          <span>上一档</span>
        </Button>
        <Button size="sm" variant="signal" onClick={() => stepTo((idx + 1) % SAMPLES.length)}>
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
          <span>切换数值</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          aria-label="重置为初始数值"
          onClick={() => {
            setTrend("neutral");
            setIdx(0);
          }}
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
