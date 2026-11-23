/**
 * Context 的样式定义：环形微表盘触发器、毛玻璃预算浮层与分段色谱。
 */
import { cva } from "class-variance-authority";
import type { ContextSegmentTone } from "./context.types.js";

export const CONTEXT_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const CONTEXT_TONE_BAR: Record<ContextSegmentTone, string> = {
  primary: "bg-primary",
  signal: "bg-signal",
  success: "bg-emerald-500 dark:bg-emerald-400",
  warning: "bg-amber-500 dark:bg-amber-400",
};

export const CONTEXT_POPOVER_SURFACE =
  "w-84 origin-(--transform-origin) overflow-hidden rounded-2xl border border-solid border-border/80 bg-popover/96 text-popover-foreground shadow-[0_18px_48px_-12px_rgba(0,0,0,0.16),0_3px_10px_-2px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-[transform,opacity] duration-(--ui-duration-normal) ease-(--ui-ease-out) outline-none data-ending-style:scale-97 data-ending-style:opacity-0 data-starting-style:scale-97 data-starting-style:opacity-0 dark:border-white/10 dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.78)]";

export const contextTriggerVariants = cva(
  `inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-solid font-mono font-medium text-foreground tabular-nums select-none transition-[background-color,border-color,box-shadow] duration-(--ui-duration-fast) data-popup-open:border-ring/70 data-popup-open:bg-accent ${CONTEXT_FOCUS_RING}`,
  {
    variants: {
      size: {
        sm: "h-7 px-2 text-[11px]",
        md: "h-8 px-2.5 text-[11px]",
      },
      surface: {
        default:
          "border-border/80 bg-card/90 shadow-xs hover:border-foreground/22 hover:bg-card dark:border-white/10 dark:bg-card/80 dark:hover:border-white/22",
        subtle:
          "border-transparent bg-secondary/75 hover:bg-secondary dark:bg-white/8 dark:hover:bg-white/12",
        glass:
          "border-border/75 bg-popover/85 shadow-xs backdrop-blur-xl hover:border-foreground/22 dark:border-white/10 dark:bg-popover/78",
      },
    },
    defaultVariants: {
      size: "md",
      surface: "default",
    },
  },
);

export const contextInlineVariants = cva(
  "w-full max-w-md rounded-2xl border border-solid text-card-foreground",
  {
    variants: {
      surface: {
        default: "border-border/80 bg-card/92 shadow-sm dark:border-white/10 dark:bg-card/85",
        subtle: "border-border/65 bg-secondary/40 dark:border-white/8 dark:bg-white/4",
        glass:
          "border-border/75 bg-popover/90 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-popover/80",
      },
    },
    defaultVariants: {
      surface: "default",
    },
  },
);

export const formatContextTokens = (n: number) => `${(n / 1000).toFixed(1)}K`;
