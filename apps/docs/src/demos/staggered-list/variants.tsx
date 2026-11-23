"use client";

import { StaggeredList } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

const VARIANTS = [
  { id: "fade-up" as const, label: "Fade Up" },
  { id: "scale" as const, label: "Scale" },
  { id: "slide-left" as const, label: "Slide Left" },
];

const ROWS = [
  { id: "r1", name: "设计 Token 同步", detail: "12ms" },
  { id: "r2", name: "组件类型校验", detail: "180ms" },
  { id: "r3", name: "无障碍自动审计", detail: "0 违规" },
];

export default function StaggeredListVariantsDemo() {
  const [variant, setVariant] = useState<"fade-up" | "scale" | "slide-left">("scale");
  const [runId, setRunId] = useState(0);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {VARIANTS.map((item) => (
          <Button
            key={item.id}
            size="sm"
            variant={variant === item.id ? "primary" : "outline"}
            onClick={() => {
              setVariant(item.id);
              setRunId((n) => n + 1);
            }}
          >
            {item.label}
          </Button>
        ))}
        <Button
          size="sm"
          variant="ghost"
          aria-label="重播列表错峰入场"
          onClick={() => setRunId((n) => n + 1)}
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
        </Button>
      </div>
      <StaggeredList
        key={`${variant}-${runId}`}
        variant={variant}
        staggerMs={55}
        distance={16}
        animateOnMount={runId > 0}
      >
        {ROWS.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between rounded-2xl border border-solid border-border/90 bg-card px-4 py-3 text-xs shadow-xs"
          >
            <span className="font-medium text-foreground">{row.name}</span>
            <span className="font-mono text-muted-foreground tabular-nums">{row.detail}</span>
          </div>
        ))}
      </StaggeredList>
    </div>
  );
}
