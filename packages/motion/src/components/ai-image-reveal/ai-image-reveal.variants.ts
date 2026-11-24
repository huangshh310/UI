/**
 * AiImageReveal 的样式映射（纯类型化 Tailwind 查表，对标 AICSS / BeautifulUI 极简克制单色语言）。
 */
import type { AiImageRevealRadius, AiImageRevealVariant } from "./ai-image-reveal.types.js";

export const REVEAL_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

/** 电影级指数缓出曲线，模拟光学镜头精准合焦 */
export const REVEAL_EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const REVEAL_SHELL_VARIANT: Record<AiImageRevealVariant, string> = {
  default: "group",
  framed:
    "group rounded-2xl border border-solid border-border bg-card p-2 shadow-xs dark:border-white/[0.08] dark:bg-card",
  glass:
    "group rounded-2xl border border-solid border-border/80 bg-card/75 p-2 shadow-xs backdrop-blur-md dark:border-white/[0.09] dark:bg-white/[0.03]",
};

export const REVEAL_STAGE_RADIUS: Record<AiImageRevealRadius, string> = {
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-[18px]",
};

/** 成图上的中性微透深炭胶囊：零偏色且满足高对比度，适配任意明暗摄影作品 */
export const REVEAL_MEDIA_CHIP =
  "border border-solid border-white/15 bg-neutral-950/76 text-white backdrop-blur-md";

/** 等待态画布内的极简等宽角标（对标 AICSS 1024 × 1024 微标） */
export const REVEAL_WAIT_CHIP =
  "border border-solid border-black/[0.06] bg-white/90 text-neutral-700 backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.08] dark:text-neutral-300";
