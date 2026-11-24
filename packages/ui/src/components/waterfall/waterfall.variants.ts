/**
 * Waterfall 样式变体定义：仅使用 --ui-* 设计 Token 静态类名与布局变量。
 */
import { cva } from "class-variance-authority";
import type { WaterfallSpanTone } from "./waterfall.types.js";

export const waterfallGridVariants = cva("grid items-center", {
  variants: {
    hasMeta: {
      true: "grid-cols-[minmax(116px,1.1fr)_76px_minmax(120px,1.75fr)] @lg:grid-cols-[minmax(160px,1.15fr)_88px_minmax(180px,2fr)]",
      false:
        "grid-cols-[minmax(120px,1.15fr)_minmax(140px,2fr)] @lg:grid-cols-[minmax(160px,1.15fr)_minmax(200px,2.2fr)]",
    },
  },
  defaultVariants: {
    hasMeta: false,
  },
});

export const WATERFALL_SHELL_CLASS =
  "@container flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-solid border-border bg-card font-sans text-card-foreground shadow-2xs";

export const WATERFALL_TOOLBAR_CLASS =
  "flex items-center justify-between gap-2 border-b border-solid border-border/70 bg-muted/30 px-3.5 py-2";

export const WATERFALL_CONTROL_BTN_CLASS =
  "inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg border border-solid border-border bg-background px-2.5 font-sans text-xs font-medium text-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring";

export const WATERFALL_HEADER_ROW_CLASS =
  "border-b border-solid border-border/80 bg-muted/25 text-[11px] font-medium text-muted-foreground";

export const WATERFALL_ROW_CLASS =
  "group border-b border-solid border-border/45 text-xs transition-colors duration-(--ui-duration-instant) outline-none last:border-b-0 hover:bg-muted/35 focus-visible:bg-accent/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-[selected]:bg-signal/10";

export const WATERFALL_ROW_HEADER_CLASS =
  "flex min-w-0 items-center gap-1.5 py-2 pr-2.5 pl-[calc((var(--waterfall-level,1)-1)*14px+12px)] font-medium text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const WATERFALL_INDICATOR_CLASS =
  "inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-transform duration-(--ui-duration-fast) hover:text-foreground data-[expanded]:rotate-90";

export const WATERFALL_META_CELL_CLASS =
  "truncate border-x border-solid border-border/45 px-2.5 py-2 text-right font-mono text-[11px] text-muted-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const WATERFALL_BAR_CELL_CLASS =
  "relative flex h-9 items-center px-3 outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const WATERFALL_TICK_CLASS =
  "pointer-events-none absolute bottom-1 left-(--waterfall-tick) -translate-x-1/2 font-mono text-[10px] leading-none text-muted-foreground whitespace-nowrap";

export const WATERFALL_MARK_CLASS =
  "pointer-events-none absolute top-0 bottom-0 left-(--waterfall-mark) z-10 flex items-start border-l border-dashed border-signal pl-1 pt-1 font-mono text-[10px] leading-none font-medium text-foreground whitespace-nowrap data-[outside]:hidden";

export const WATERFALL_TONE_BAR_CLASS: Record<WaterfallSpanTone, string> = {
  default: "bg-primary/75",
  signal: "bg-signal",
  success: "bg-emerald-600 dark:bg-emerald-500",
  warning: "bg-amber-500",
  destructive: "bg-destructive",
};
