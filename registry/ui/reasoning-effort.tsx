// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * ReasoningEffort：对标 AICSS Reasoning Effort 的单色推理深度档位选择器，
 * 以精密信号柱微图标直观表达低/中/高/极致四档思考预算。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type ComponentProps, useState } from "react";

export const REASONING_EFFORT_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const DEFAULT_REASONING_OPTIONS: ReasoningEffortOption[] = [
  { value: "low", label: "快速", description: "直接响应，极低延迟", latency: "~1s", bars: 1 },
  { value: "medium", label: "均衡", description: "兼顾思考质量与速度", latency: "~4s", bars: 2 },
  { value: "high", label: "深度", description: "多步校验复杂逻辑", latency: "~12s", bars: 3 },
  { value: "max", label: "极致", description: "长程推演与全面反思", latency: "~30s", bars: 4 },
];

export const reasoningEffortSegmentedVariants = cva(
  "inline-flex items-center gap-0.5 rounded-full border border-solid border-border bg-muted/65 p-1 dark:border-white/10 dark:bg-white/[0.04]",
);

export const reasoningEffortItemVariants = cva(
  "cursor-pointer border border-solid font-sans transition-all disabled:cursor-not-allowed disabled:opacity-45",
  {
    variants: {
      variant: {
        segmented: "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium",
        cards: "flex flex-col items-start gap-1.5 rounded-xl p-3.5 text-left",
      },
      active: {
        true: "border-border bg-card text-foreground shadow-xs dark:border-white/14 dark:bg-card",
        false:
          "border-transparent bg-transparent text-muted-foreground hover:text-foreground dark:hover:bg-white/[0.04]",
      },
    },
    compoundVariants: [
      {
        variant: "cards",
        active: false,
        className:
          "border-border/70 bg-card/50 hover:border-foreground/20 dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:border-white/18",
      },
      {
        variant: "cards",
        active: true,
        className:
          "border-foreground/30 ring-1 ring-foreground/10 dark:border-white/28 dark:ring-white/10",
      },
    ],
    defaultVariants: {
      variant: "segmented",
      active: false,
    },
  },
);
/** 推理思考深度档位（对标 AICSS Reasoning Effort） */
export type ReasoningEffortLevel = "low" | "medium" | "high" | "max";

/** 展示变体：segmented 紧凑分段器、cards 详细档位卡 */
export type ReasoningEffortVariant = "segmented" | "cards";

export interface ReasoningEffortOption {
  value: ReasoningEffortLevel;
  label: string;
  description: string;
  latency: string;
  bars: 1 | 2 | 3 | 4;
}

export interface ReasoningEffortProps extends Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> {
  /** 受控当前推理深度 */
  value?: ReasoningEffortLevel;
  /** 非受控初始推理深度，默认 "medium" */
  defaultValue?: ReasoningEffortLevel;
  /** 展示变体，默认 "segmented" */
  variant?: ReasoningEffortVariant;
  /** 禁用切换 */
  disabled?: boolean;
  /** 自定义档位文案覆盖 */
  options?: ReasoningEffortOption[];
  /** 档位变更回调 */
  onValueChange?: (value: ReasoningEffortLevel) => void;
}
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
