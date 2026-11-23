/**
 * AiImageReveal 的样式映射（纯类型化 Tailwind 查表，不引入 cva）。
 */
import type { AiImageRevealRadius, AiImageRevealVariant } from "./ai-image-reveal.types.js";

export const REVEAL_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const REVEAL_EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const REVEAL_SHELL_VARIANT: Record<AiImageRevealVariant, string> = {
  default: "",
  framed:
    "rounded-xl border border-solid border-border bg-card p-1.5 shadow-sm dark:border-white/10",
  glass:
    "rounded-xl border border-solid border-border bg-card/85 p-1.5 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-card/80",
};

export const REVEAL_STAGE_RADIUS: Record<AiImageRevealRadius, string> = {
  md: "rounded-lg",
  lg: "rounded-lg",
  xl: "rounded-xl",
};
