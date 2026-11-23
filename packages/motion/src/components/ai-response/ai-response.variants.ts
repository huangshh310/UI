/**
 * AiResponse 的样式映射（纯类型化 Tailwind 查表，不引入 cva）。
 */
import type { AiResponseSize, AiResponseVariant } from "./ai-response.types.js";

export const AI_RESPONSE_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const AI_RESPONSE_COLLAPSE_TRANSITION = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const AI_RESPONSE_ACTION_BTN = `inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-muted hover:text-foreground dark:hover:bg-white/[0.08] ${AI_RESPONSE_FOCUS_RING}`;

export const AI_RESPONSE_TRIGGER_BTN = `inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-solid border-transparent bg-transparent px-2 py-1 font-sans text-xs font-medium text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-muted/70 hover:text-foreground dark:hover:bg-white/[0.06] ${AI_RESPONSE_FOCUS_RING}`;

export const AI_RESPONSE_SHELL_VARIANT: Record<AiResponseVariant, string> = {
  card: "rounded-xl border border-solid border-border bg-card shadow-xs dark:border-white/10",
  ghost: "border-0 bg-transparent",
  glass:
    "rounded-xl border border-solid border-border bg-popover/90 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-popover/85",
};

export const AI_RESPONSE_SHELL_PADDING: Record<AiResponseSize, string> = {
  sm: "p-4",
  md: "p-5",
};
