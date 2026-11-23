/**
 * SegmentedControl 的样式映射表：零 CVA 依赖，提供 default / glass / signal 三种质感与 sm / md / lg 尺寸。
 */
import type { SegmentedControlSize, SegmentedControlVariant } from "./segmented-control.types.js";

export const SEGMENTED_TRACK_BASE =
  "m-0 inline-flex flex-wrap items-center gap-0.5 rounded-full border border-solid p-1 select-none";

export const SEGMENTED_TRACK_VARIANTS: Record<SegmentedControlVariant, string> = {
  default:
    "border-border/80 bg-secondary/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/12 dark:bg-white/[0.06]",
  glass:
    "border-border/75 bg-card/70 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_3px_rgba(0,0,0,0.04)] dark:border-white/15 dark:bg-white/[0.08] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
  signal:
    "border-border/80 bg-secondary/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/12 dark:bg-white/[0.06]",
};

export const SEGMENTED_THUMB_VARIANTS: Record<SegmentedControlVariant, string> = {
  default:
    "pointer-events-none absolute inset-0 rounded-full bg-card shadow-[0_1px_3px_rgba(0,0,0,0.10),0_0.5px_1px_rgba(0,0,0,0.05)] ring-1 ring-border/75 dark:bg-card dark:ring-white/12",
  glass:
    "pointer-events-none absolute inset-0 rounded-full bg-background/95 shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] ring-1 ring-border/75 dark:bg-card/90 dark:ring-white/18 dark:shadow-[0_2px_10px_rgba(0,0,0,0.35)]",
  signal:
    "pointer-events-none absolute inset-0 rounded-full bg-signal shadow-[0_1px_3px_rgba(21,93,252,0.35),inset_0_1px_0_rgba(255,255,255,0.22)]",
};

export const SEGMENTED_BUTTON_BASE =
  "relative inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border-0 bg-transparent font-sans font-medium whitespace-nowrap transition-colors duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45";

export const SEGMENTED_BUTTON_SIZES: Record<SegmentedControlSize, string> = {
  sm: "h-7 px-2.5 text-xs",
  md: "h-8 px-3.5 text-xs",
  lg: "h-9.5 px-4 text-sm",
};

export const SEGMENTED_ACTIVE_TEXT: Record<SegmentedControlVariant, string> = {
  default: "text-foreground",
  glass: "text-foreground",
  signal: "text-signal-foreground",
};

export const SEGMENTED_BADGE_ACTIVE: Record<SegmentedControlVariant, string> = {
  default: "bg-primary text-primary-foreground",
  glass: "bg-primary text-primary-foreground",
  signal: "bg-black/25 text-signal-foreground",
};
