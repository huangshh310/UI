/**
 * IntroLoader 的样式映射（纯类型化 Tailwind 查表，不引入 cva）。
 */
import type { IntroLoaderTone, IntroLoaderVariant } from "./intro-loader.types.js";

export const INTRO_SURFACE_VARIANT: Record<IntroLoaderVariant, string> = {
  default: "bg-card/95 backdrop-blur-2xl dark:bg-card/92",
  minimal: "bg-background/98 backdrop-blur-md dark:bg-background/96",
  spotlight: "bg-card/96 backdrop-blur-2xl dark:bg-card/94",
};

export const INTRO_INLINE_CLASS =
  "min-h-52 w-full rounded-[22px] border border-solid border-border/80 p-7 shadow-[0_14px_40px_-12px_rgba(0,0,0,0.12),0_2px_8px_-2px_rgba(0,0,0,0.04)] dark:border-white/10 dark:shadow-[0_20px_54px_-12px_rgba(0,0,0,0.72)]";

export const INTRO_PROGRESS_FILL: Record<IntroLoaderTone, string> = {
  neutral: "bg-foreground",
  signal: "bg-signal",
};

export const INTRO_SKIP_BUTTON_CLASS =
  "absolute right-4 bottom-4 z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-solid border-border/85 bg-background/90 px-3 py-1 font-mono text-[11px] font-medium text-muted-foreground shadow-xs outline-none transition-[border-color,color,background-color] duration-(--ui-duration-fast) hover:border-foreground/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring dark:border-white/12 dark:bg-white/6 dark:hover:border-white/25";
