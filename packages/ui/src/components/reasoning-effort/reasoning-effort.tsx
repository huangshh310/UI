"use client";

/**
 * ReasoningEffort：对标 AICSS Reasoning Effort 的单色推理深度档位选择器，
 * 以精密信号柱微图标直观表达低/中/高/极致四档思考预算。
 */
import { cn } from "@matt-ui/utils";
import { useState } from "react";
import type {
  ReasoningEffortLevel,
  ReasoningEffortOption,
  ReasoningEffortProps,
  ReasoningEffortVariant,
} from "./reasoning-effort.types.js";
import {
  DEFAULT_REASONING_OPTIONS,
  REASONING_EFFORT_FOCUS_RING,
  reasoningEffortItemVariants,
  reasoningEffortSegmentedVariants,
} from "./reasoning-effort.variants.js";

const BAR_HEIGHTS = ["h-1.5", "h-2", "h-2.5", "h-3"] as const;

const SignalBars = ({ bars, active }: { bars: number; active: boolean }) => (
  <span aria-hidden="true" className="inline-flex h-3 items-end gap-[2px]">
    {BAR_HEIGHTS.map((height, idx) => {
      const lit = idx < bars;
      return (
        <span
          key={height}
          className={cn(
            "w-[2.5px] rounded-full transition-colors",
            height,
            lit
              ? active
                ? "bg-foreground"
                : "bg-muted-foreground/75"
              : "bg-foreground/15 dark:bg-white/14",
          )}
        />
      );
    })}
  </span>
);

const ReasoningOptionButton = ({
  opt,
  variant,
  active,
  disabled,
  onSelect,
}: {
  opt: ReasoningEffortOption;
  variant: ReasoningEffortVariant;
  active: boolean;
  disabled: boolean;
  onSelect: (value: ReasoningEffortLevel) => void;
}) => (
  <button
    type="button"
    aria-pressed={active}
    disabled={disabled}
    onClick={() => onSelect(opt.value)}
    className={cn(reasoningEffortItemVariants({ variant, active }), REASONING_EFFORT_FOCUS_RING)}
  >
    {variant === "segmented" ? (
      <>
        <SignalBars bars={opt.bars} active={active} />
        <span>{opt.label}</span>
      </>
    ) : (
      <>
        <div className="flex w-full items-center justify-between gap-2">
          <SignalBars bars={opt.bars} active={active} />
          <span className="font-mono text-[10.5px] text-muted-foreground tabular-nums">
            {opt.latency}
          </span>
        </div>
        <span className="text-xs font-medium text-foreground">{opt.label}</span>
        <span className="text-[11px] leading-snug text-muted-foreground">{opt.description}</span>
      </>
    )}
  </button>
);

export const ReasoningEffortPicker = ({
  value,
  defaultValue = "medium",
  variant = "segmented",
  disabled = false,
  options = DEFAULT_REASONING_OPTIONS,
  onValueChange,
  className,
  ...props
}: ReasoningEffortProps) => {
  const [internal, setInternal] = useState<ReasoningEffortLevel>(defaultValue);
  const current = value ?? internal;

  const select = (next: ReasoningEffortLevel) => {
    if (disabled) return;
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <fieldset
      aria-label="推理深度"
      data-slot="reasoning-effort"
      data-variant={variant}
      data-value={current}
      className={cn(
        "m-0 min-w-0 border-0 p-0",
        variant === "segmented"
          ? reasoningEffortSegmentedVariants()
          : "grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4",
        className,
      )}
      {...props}
    >
      {options.map((opt) => (
        <ReasoningOptionButton
          key={opt.value}
          opt={opt}
          variant={variant}
          active={opt.value === current}
          disabled={disabled}
          onSelect={select}
        />
      ))}
    </fieldset>
  );
};
