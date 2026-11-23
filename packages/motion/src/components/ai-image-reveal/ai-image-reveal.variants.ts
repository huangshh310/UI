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
    "rounded-[26px] border border-solid border-border/80 bg-card/92 p-2 shadow-[0_14px_36px_-14px_rgba(0,0,0,0.14)] dark:border-white/10 dark:bg-card/85 dark:shadow-[0_20px_48px_-14px_rgba(0,0,0,0.72)]",
  glass:
    "rounded-[26px] border border-solid border-border/75 bg-popover/86 p-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-popover/78",
};

export const REVEAL_STAGE_RADIUS: Record<AiImageRevealRadius, string> = {
  md: "rounded-2xl",
  lg: "rounded-[20px]",
  xl: "rounded-3xl",
};
