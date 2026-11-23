/**
 * MorphingDialog 的样式映射（纯类型化 Tailwind 查表，不引入 cva）。
 */
import type { MorphingDialogSize, MorphingDialogTagTone } from "./morphing-dialog.types.js";

export const MORPHING_SIZE_MAP: Record<MorphingDialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
};

export const MORPHING_TAG_MAP: Record<MorphingDialogTagTone, { pill: string; dot: string }> = {
  neutral: {
    pill: "border-border/80 bg-secondary/80 text-foreground dark:border-white/10 dark:bg-white/8",
    dot: "bg-muted-foreground",
  },
  signal: {
    pill: "border-signal/25 bg-signal/10 text-blue-800 dark:border-signal/35 dark:bg-signal/20 dark:text-blue-200",
    dot: "bg-signal",
  },
  success: {
    pill: "border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/15 dark:text-emerald-200",
    dot: "bg-emerald-500",
  },
  warning: {
    pill: "border-amber-500/30 bg-amber-500/12 text-amber-900 dark:border-amber-400/25 dark:bg-amber-400/15 dark:text-amber-200",
    dot: "bg-amber-500",
  },
};

export const MORPHING_TRIGGER_CLASS =
  "group flex w-full max-w-xs cursor-pointer flex-col gap-2.5 rounded-2xl border border-solid border-border/85 bg-card/95 p-4 text-left shadow-[0_2px_10px_-4px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] outline-none transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) hover:border-foreground/22 hover:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.12)] focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/10 dark:bg-card/90 dark:hover:border-white/22 dark:hover:shadow-[0_14px_36px_-10px_rgba(0,0,0,0.65)]";

export const MORPHING_PANEL_CLASS =
  "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-solid border-border/80 bg-popover/96 p-6 text-popover-foreground backdrop-blur-xl outline-none shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18),0_4px_16px_-4px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_28px_72px_-12px_rgba(0,0,0,0.78)]";

export const MORPHING_CLOSE_CLASS =
  "inline-flex size-7.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent text-muted-foreground outline-none transition-[background-color,color,border-color,transform] duration-(--ui-duration-fast) hover:border-border/60 hover:bg-accent/80 hover:text-foreground active:scale-95 focus-visible:ring-2 focus-visible:ring-ring dark:hover:border-white/10 dark:hover:bg-white/10";
