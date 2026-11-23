/**
 * Context 的样式定义：紧凑环形微表盘触发器、利落预算浮层与克制中性+品牌蓝色谱。
 */
import { cva } from "class-variance-authority";
import type { ContextSegmentTone } from "./context.types.js";

export const CONTEXT_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

/** 克制的中性灰阶层次 + 品牌蓝分段色谱（高占用由环形与状态文本渐进提示） */
export const CONTEXT_TONE_BAR: Record<ContextSegmentTone, string> = {
  primary: "bg-foreground",
  signal: "bg-signal",
  success: "bg-muted-foreground/65 dark:bg-white/45",
  warning: "bg-foreground/25 dark:bg-white/25",
};

export const CONTEXT_POPOVER_SURFACE =
  "w-80 origin-(--transform-origin) overflow-hidden rounded-xl border border-solid border-border bg-popover/98 text-popover-foreground shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-[transform,opacity] duration-(--ui-duration-normal) ease-(--ui-ease-out) outline-none data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0 dark:border-white/10 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]";

export const contextTriggerVariants = cva(
  `inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-solid font-mono font-medium text-foreground tabular-nums select-none transition-colors duration-(--ui-duration-fast) data-popup-open:border-foreground/20 data-popup-open:bg-accent/60 ${CONTEXT_FOCUS_RING}`,
  {
    variants: {
      size: {
        sm: "h-7 px-2 text-[11px]",
        md: "h-8 px-2.5 text-xs",
      },
      surface: {
        default:
          "border-border bg-card shadow-xs hover:border-foreground/20 hover:bg-accent/50 dark:border-white/10 dark:hover:border-white/20",
        subtle:
          "border-transparent bg-secondary/75 hover:bg-secondary dark:bg-white/8 dark:hover:bg-white/12",
        glass:
          "border-border bg-popover/90 shadow-xs backdrop-blur-xl hover:border-foreground/20 dark:border-white/10 dark:bg-popover/80",
      },
    },
    defaultVariants: {
      size: "md",
      surface: "default",
    },
  },
);

export const contextInlineVariants = cva(
  "w-full rounded-xl border border-solid text-card-foreground",
  {
    variants: {
      surface: {
        default: "border-border bg-card shadow-xs dark:border-white/10",
        subtle: "border-border/75 bg-secondary/45 dark:border-white/10 dark:bg-white/4",
        glass:
          "border-border bg-popover/90 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-popover/85",
      },
    },
    defaultVariants: {
      surface: "default",
    },
  },
);

export const formatContextTokens = (n: number) => `${(n / 1000).toFixed(1)}K`;
