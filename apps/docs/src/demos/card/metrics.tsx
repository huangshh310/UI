"use client";

import { Badge, Card, CardContent } from "@matt-ui/ui";

const METRICS = [
  { label: "月活跃开发者", value: "12,840", delta: "+19.5%" },
  { label: "边缘 P95 延迟", value: "14 ms", delta: "-4 ms" },
  { label: "无障碍通过率", value: "100%", delta: "WCAG AA" },
];

export default function CardMetricsDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
      {METRICS.map((item) => (
        <Card key={item.label} variant="interactive">
          <CardContent className="flex flex-col gap-3 py-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <Badge variant="secondary">{item.delta}</Badge>
            </div>
            <p className="m-0 font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums">
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
