/**
 * AiToolCall 视觉变体与状态文案映射表。
 */
import { cva } from "class-variance-authority";
import type { AiToolCallStatus } from "./ai-tool-call.types.js";

export const toolCallShellVariants = cva(
  "w-full overflow-hidden rounded-2xl border border-solid transition-colors",
  {
    variants: {
      variant: {
        card: "border-border bg-card text-card-foreground shadow-xs",
        compact: "border-border bg-card text-card-foreground",
        obsidian: "[color-scheme:dark] border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xs",
      },
    },
    defaultVariants: {
      variant: "card",
    },
  },
);

export const TOOL_STATUS_LABEL: Record<AiToolCallStatus, string> = {
  running: "执行中",
  completed: "已完成",
  error: "失败",
  pending: "排队中",
};
