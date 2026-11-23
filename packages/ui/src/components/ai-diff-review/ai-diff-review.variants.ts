/**
 * AiDiffReview 视觉变体与内置示例差异行。
 */
import { cva } from "class-variance-authority";
import type { AiDiffLine, AiDiffLineType, AiDiffReviewTheme } from "./ai-diff-review.types.js";

export const diffReviewShellVariants = cva(
  "w-full max-w-xl overflow-hidden border border-solid border-border/85 bg-card text-card-foreground shadow-xs",
  {
    variants: {
      compact: {
        false: "rounded-2xl",
        true: "rounded-xl",
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export const DIFF_DEFAULT_LINES: AiDiffLine[] = [
  { id: "d1", lineNumber: 14, type: "context", content: "  --ui-shadow-sm:" },
  { id: "d2", lineNumber: 15, type: "remove", content: "    0 1px 2px 0 rgba(0, 0, 0, 0.05);" },
  { id: "d3", lineNumber: 15, type: "add", content: "    inset 0 1px 0 0 var(--ui-specular)," },
  { id: "d4", lineNumber: 16, type: "add", content: "    inset 0 -1px 0 0 var(--ui-bevel)," },
  { id: "d5", lineNumber: 17, type: "context", content: "    0 3px 8px -2px rgba(0, 0, 0, 0.06);" },
];

export const DIFF_ROW_STYLE: Record<AiDiffReviewTheme, Record<AiDiffLineType, string>> = {
  obsidian: {
    add: "border-l-2 border-l-emerald-500 bg-emerald-500/14 text-emerald-100",
    remove: "border-l-2 border-l-rose-500 bg-rose-500/14 text-rose-100",
    context: "border-l-2 border-l-transparent bg-transparent text-zinc-300",
  },
  adaptive: {
    add: "border-l-2 border-l-emerald-500 bg-emerald-500/10 text-foreground",
    remove: "border-l-2 border-l-rose-500 bg-rose-500/10 text-foreground",
    context: "border-l-2 border-l-transparent bg-transparent text-muted-foreground",
  },
};

export const DIFF_MARKER_STYLE: Record<AiDiffReviewTheme, Record<AiDiffLineType, string>> = {
  obsidian: {
    add: "text-emerald-400",
    remove: "text-rose-400",
    context: "text-zinc-500",
  },
  adaptive: {
    add: "text-emerald-700 dark:text-emerald-300",
    remove: "text-rose-700 dark:text-rose-300",
    context: "text-muted-foreground",
  },
};
