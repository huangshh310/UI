/**
 * PromptQueue 的样式映射（纯类型化 Tailwind 查表，不引入 cva）。
 */
import type { PromptQueueSize, PromptQueueVariant } from "./prompt-queue.types.js";

export const PROMPT_QUEUE_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const PROMPT_QUEUE_COLLAPSE_TRANSITION = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const PROMPT_QUEUE_ACTION_BTN = `inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-solid border-transparent bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-muted hover:text-foreground dark:hover:bg-white/[0.08] ${PROMPT_QUEUE_FOCUS_RING}`;

export const PROMPT_QUEUE_SHELL_VARIANT: Record<PromptQueueVariant, string> = {
  default: "border-border bg-muted/45 dark:border-white/10 dark:bg-card/85",
  glass:
    "border-border bg-popover/90 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-popover/85",
  elevated: "border-border bg-card shadow-sm dark:border-white/10",
};

export const PROMPT_QUEUE_ROW_SIZE: Record<PromptQueueSize, string> = {
  sm: "px-3 py-1.5",
  md: "px-3.5 py-2",
};

export const PROMPT_QUEUE_HEADER_SIZE: Record<PromptQueueSize, string> = {
  sm: "px-3 py-1.5",
  md: "px-3.5 py-2",
};
