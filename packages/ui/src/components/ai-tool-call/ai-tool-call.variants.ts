/**
 * AiToolCall 视觉变体与状态映射表。
 */
import { cva } from "class-variance-authority";
import type { AiToolCallStatus } from "./ai-tool-call.types.js";

export const toolCallShellVariants = cva(
  "w-full max-w-xl overflow-hidden border border-solid transition-colors",
  {
    variants: {
      variant: {
        card: "rounded-2xl border-border/85 bg-card text-card-foreground shadow-xs",
        compact: "rounded-xl border-border/80 bg-card text-card-foreground shadow-2xs",
        obsidian:
          "[color-scheme:dark] rounded-2xl border-zinc-800 bg-zinc-950 text-zinc-50 shadow-md",
      },
    },
    defaultVariants: {
      variant: "card",
    },
  },
);

export const TOOL_STATUS_META: Record<
  AiToolCallStatus,
  { label: string; pillClass: string; dotClass: string }
> = {
  running: {
    label: "执行中",
    pillClass: "border-signal/30 bg-signal/10 text-signal",
    dotClass: "bg-signal animate-pulse",
  },
  completed: {
    label: "已完成",
    pillClass: "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  error: {
    label: "失败",
    pillClass: "border-destructive/35 bg-destructive/12 text-destructive",
    dotClass: "bg-destructive",
  },
  pending: {
    label: "排队中",
    pillClass: "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
};

export const TOOL_STATUS_META_DARK: Record<
  AiToolCallStatus,
  { label: string; pillClass: string; dotClass: string }
> = {
  running: {
    label: "执行中",
    pillClass: "border-sky-500/35 bg-sky-500/15 text-sky-300",
    dotClass: "bg-sky-400 animate-pulse",
  },
  completed: {
    label: "已完成",
    pillClass: "border-emerald-500/35 bg-emerald-500/15 text-emerald-300",
    dotClass: "bg-emerald-400",
  },
  error: {
    label: "失败",
    pillClass: "border-rose-500/35 bg-rose-500/15 text-rose-300",
    dotClass: "bg-rose-400",
  },
  pending: {
    label: "排队中",
    pillClass: "border-amber-500/35 bg-amber-500/15 text-amber-300",
    dotClass: "bg-amber-400",
  },
};
