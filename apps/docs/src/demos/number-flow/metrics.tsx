"use client";

import { NumberFlow } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { useState } from "react";

export default function NumberFlowMetricsDemo() {
  const [requests, setRequests] = useState(12480);
  const [trend, setTrend] = useState<"neutral" | "up" | "down">("neutral");

  const adjust = (delta: number) => {
    setTrend(delta >= 0 ? "up" : "down");
    setRequests((n) => Math.max(100, n + delta));
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-[22px] border border-solid border-border/90 bg-card p-5 shadow-xs">
      <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
        <span>边缘网关实时吞吐量</span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
          />
          P99 11ms
        </span>
      </div>
      <NumberFlow
        value={requests}
        suffix="req/s"
        size="lg"
        trend={trend}
        format={{ maximumFractionDigits: 0 }}
      />
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => adjust(-1450)}>
          降频 -1,450
        </Button>
        <Button size="sm" variant="signal" onClick={() => adjust(2840)}>
          峰值 +2,840
        </Button>
      </div>
    </div>
  );
}
