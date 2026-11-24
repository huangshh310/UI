/**
 * ReasoningEffort 的样式映射与默认 4 档推理深度配置。
 */
import { cva } from "class-variance-authority";
import type { ReasoningEffortOption } from "./reasoning-effort.types.js";

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
