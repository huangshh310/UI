/**
 * AiResponse 的样式映射（纯类型化 Tailwind 查表，不引入 cva）。
 */
import type { AiResponseSize, AiResponseVariant } from "./ai-response.types.js";

export const AI_RESPONSE_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const AI_RESPONSE_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.8,
};

export const AI_RESPONSE_ACTION_BTN = `inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-secondary/90 hover:text-foreground dark:hover:bg-white/10 ${AI_RESPONSE_FOCUS_RING}`;

export const AI_RESPONSE_SHELL_VARIANT: Record<AiResponseVariant, string> = {
  card: "rounded-[22px] border border-solid border-border/80 bg-card/95 shadow-xs dark:border-white/10 dark:bg-card/85",
  ghost: "border-0 bg-transparent",
  glass:
    "rounded-[22px] border border-solid border-border/75 bg-popover/92 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-popover/82",
};

export const AI_RESPONSE_SHELL_PADDING: Record<AiResponseSize, string> = {
  sm: "p-4",
  md: "p-5",
};
