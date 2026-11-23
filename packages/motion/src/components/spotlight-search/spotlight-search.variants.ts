/**
 * SpotlightSearch 的样式映射（纯类型化 Tailwind 查表，不引入 cva）。
 */
import type { SpotlightSearchSize } from "./spotlight-search.types.js";

export const SPOTLIGHT_SIZE_MAP: Record<SpotlightSearchSize, string> = {
  md: "max-w-xl",
  lg: "max-w-2xl",
};

export const SPOTLIGHT_TRIGGER_CLASS =
  "inline-flex h-9 cursor-pointer items-center gap-2.5 rounded-xl border border-solid border-border/85 bg-background px-3 font-sans text-sm font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast) hover:border-foreground/22 hover:bg-card focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/12 dark:bg-card/90 dark:hover:border-white/22 dark:hover:bg-card";

export const SPOTLIGHT_PANEL_CLASS =
  "fixed top-[13vh] left-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-solid border-border/80 bg-popover/96 text-popover-foreground backdrop-blur-xl outline-none shadow-[0_24px_64px_-12px_rgba(0,0,0,0.2),0_4px_16px_-4px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_30px_80px_-14px_rgba(0,0,0,0.8)]";

export const SPOTLIGHT_KBD_CLASS =
  "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md border border-solid border-border/85 bg-secondary/75 px-1.5 font-mono text-[10px] font-medium leading-none text-muted-foreground shadow-[0_1px_0_rgba(0,0,0,0.05)] dark:border-white/12 dark:bg-white/7 dark:shadow-[0_1px_0_rgba(0,0,0,0.35)]";
