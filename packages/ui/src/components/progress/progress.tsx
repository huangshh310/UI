"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "@matt-ui/utils";
import type { ProgressProps, ProgressSize, ProgressTone } from "./progress.types.js";

const TONE_CLASS: Record<ProgressTone, string> = {
  signal: "bg-signal",
  primary: "bg-primary",
  success: "bg-emerald-600 dark:bg-emerald-400",
};

const SIZE_CLASS: Record<ProgressSize, string> = {
  sm: "h-1.5",
  md: "h-2",
};

const ProgressHeader = ({ label, pct }: { label?: string; pct: number | null }) => {
  if (!label && pct === null) return null;
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      {label ? (
        <BaseProgress.Label className="font-medium text-foreground">{label}</BaseProgress.Label>
      ) : (
        <span />
      )}
      {pct !== null && <span className="font-mono text-muted-foreground tabular-nums">{pct}%</span>}
    </div>
  );
};

export const Progress = ({
  value,
  max = 100,
  label,
  showValue = false,
  tone = "signal",
  size = "sm",
  className,
}: ProgressProps) => {
  const pct =
    showValue && value !== null
      ? Math.round((Math.min(Math.max(value, 0), max) / max) * 100)
      : null;

  return (
    <BaseProgress.Root
      value={value}
      max={max}
      data-slot="progress"
      className={cn("flex w-full flex-col gap-1.5", className)}
    >
      <ProgressHeader label={label} pct={pct} />
      <BaseProgress.Track
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-foreground/[0.09] dark:bg-foreground/[0.12]",
          SIZE_CLASS[size],
        )}
      >
        <BaseProgress.Indicator
          className={cn(
            "h-full rounded-full transition-[width] duration-(--ui-duration-normal) ease-(--ui-ease-out) motion-reduce:transition-none",
            TONE_CLASS[tone],
            value === null && "w-1/3 animate-pulse motion-reduce:animate-none",
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
};
