"use client";

/**
 * 示例：AiLoadingState 3×3 像素矩阵编排切换（Drive / Dots / Orbit / Surfer）与实时计时器。
 */
import { AiLoadingState, type AiLoadingPattern } from "@matt-ui/ui";
import { useState } from "react";

const PATTERNS: { id: AiLoadingPattern; label: string; verb: string }[] = [
  { id: "drive", label: "Drive", verb: "推演中" },
  { id: "dots", label: "Dots", verb: "检索中" },
  { id: "orbit", label: "Orbit", verb: "规划中" },
  { id: "surfer", label: "Surfer", verb: "生成中" },
];

export default function AiLoadingStateBasicDemo() {
  const [pattern, setPattern] = useState<AiLoadingPattern>("drive");
  const current = PATTERNS.find((item) => item.id === pattern) ?? PATTERNS[0]!;

  return (
    <div className="flex w-full flex-col items-center gap-8 py-4">
      <div className="flex flex-col items-center gap-4">
        <AiLoadingState key={pattern} pattern={pattern} label={current.verb} size="lg" />
        <AiLoadingState
          key={`pill-${pattern}`}
          pattern={pattern}
          variant="pill"
          size="sm"
          label={current.verb}
          showElapsed={false}
        />
      </div>

      <div className="inline-flex items-center gap-0.5 rounded-full border border-solid border-border bg-muted/65 p-1 dark:border-white/10 dark:bg-white/[0.04]">
        {PATTERNS.map((item) => {
          const active = item.id === pattern;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setPattern(item.id)}
              className={`cursor-pointer rounded-full border border-solid px-3 py-1 font-sans text-xs font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset ${
                active
                  ? "border-border bg-card text-foreground shadow-xs dark:border-white/12 dark:bg-card"
                  : "border-transparent bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
