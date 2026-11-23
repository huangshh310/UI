/**
 * PromptQueue 的样式映射（纯类型化 Tailwind 查表，不引入 cva）。
 */
import type { PromptQueueSize, PromptQueueVariant } from "./prompt-queue.types.js";

export const PROMPT_QUEUE_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const PROMPT_QUEUE_ACTION_BTN = `inline-flex size-6.5 cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent/85 hover:text-foreground ${PROMPT_QUEUE_FOCUS_RING}`;

export const PROMPT_QUEUE_SHELL_VARIANT: Record<PromptQueueVariant, string> = {
  default: "border-border/80 bg-secondary/72 dark:border-white/10 dark:bg-card/82",
  glass:
    "border-border/75 bg-popover/92 shadow-[0_14px_36px_-12px_rgba(0,0,0,0.14),0_2px_8px_-2px_rgba(0,0,0,0.05)] backdrop-blur-xl dark:border-white/10 dark:bg-popover/84 dark:shadow-[0_20px_48px_-12px_rgba(0,0,0,0.75)]",
  elevated:
    "border-border/80 bg-card shadow-[0_12px_32px_-10px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.04)] dark:border-white/12 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.68)]",
};

export const PROMPT_QUEUE_ROW_SIZE: Record<PromptQueueSize, string> = {
  sm: "px-2.5 py-1.5",
  md: "px-3 py-2",
};

export const PROMPT_QUEUE_HEADER_SIZE: Record<PromptQueueSize, string> = {
  sm: "px-2.5 py-1.5",
  md: "px-3 py-2",
};
