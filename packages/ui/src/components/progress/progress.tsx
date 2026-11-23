"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "@matt-ui/utils";
import type { ProgressProps, ProgressSize, ProgressTone } from "./progress.types.js";

const TONE_CLASS: Record<ProgressTone, string> = {
  default: "bg-primary",
  primary: "bg-primary",
  signal: "bg-signal",
  success: "bg-emerald-600 dark:bg-emerald-400",
  warning: "bg-amber-500 dark:bg-amber-400",
  destructive: "bg-destructive",
};

const SIZE_CLASS: Record<ProgressSize, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

const INDETERMINATE_CLASS =
  "relative w-2/5 overflow-hidden animate-pulse motion-reduce:animate-none after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent";

const resolveProgress = (props: ProgressProps) => {
  const max = props.max ?? 100;
  const isIndeterminate =
    Boolean(props.indeterminate) || props.value === null || props.value === undefined;
  if (isIndeterminate) return { max, isIndeterminate: true, clamped: null, pct: null };
  const clamped = Math.min(Math.max(props.value as number, 0), max);
  const pct = props.showValue ? Math.round((clamped / max) * 100) : null;
  return { max, isIndeterminate: false, clamped, pct };
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

export const Progress = (props: ProgressProps) => {
  const tone = props.tone ?? "signal";
  const size = props.size ?? "sm";
  const { max, isIndeterminate, clamped, pct } = resolveProgress(props);

  return (
    <BaseProgress.Root
      value={clamped}
      max={max}
      aria-label={props.label ? undefined : "进度"}
      data-slot="progress"
      data-tone={tone}
      data-size={size}
      data-indeterminate={isIndeterminate ? "true" : undefined}
      className={cn("flex w-full flex-col gap-1.5", props.className)}
    >
      <ProgressHeader label={props.label} pct={pct} />
      <BaseProgress.Track
        data-slot="progress-track"
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-foreground/[0.08] shadow-[inset_0_1px_1px_rgba(0,0,0,0.06)] dark:bg-foreground/[0.12] dark:shadow-[inset_0_1px_1px_rgba(0,0,0,0.28)]",
          SIZE_CLASS[size],
        )}
      >
        <BaseProgress.Indicator
          data-slot="progress-indicator"
          className={cn(
            "h-full rounded-full transition-[width] duration-(--ui-duration-normal) ease-(--ui-ease-out) motion-reduce:transition-none",
            TONE_CLASS[tone],
            isIndeterminate && INDETERMINATE_CLASS,
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
};
