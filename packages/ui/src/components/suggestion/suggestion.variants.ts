/**
 * Suggestion 的样式定义：极简发丝质感胶囊、利落灵感卡与垂直追问列表。
 */
import { cva } from "class-variance-authority";
import type { SuggestionsColumns } from "./suggestion.types.js";

export const SUGGESTION_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const SUGGESTIONS_GRID_COLUMNS: Record<SuggestionsColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

export const suggestionPillVariants = cva(
  `inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-solid font-sans font-medium transition-colors duration-(--ui-duration-fast) ${SUGGESTION_FOCUS_RING}`,
  {
    variants: {
      variant: {
        default:
          "border-border bg-card text-foreground shadow-xs hover:border-foreground/20 hover:bg-accent/50 dark:border-white/10 dark:hover:border-white/20",
        ghost:
          "border-transparent bg-secondary/70 text-foreground hover:bg-secondary dark:bg-white/8 dark:hover:bg-white/12",
        signal:
          "border-signal/35 bg-signal/10 text-foreground hover:border-signal/55 hover:bg-signal/15 dark:border-signal/40 dark:bg-signal/14",
      },
      size: {
        sm: "h-7 px-3 text-[11px]",
        md: "h-8 px-3.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const suggestionCardVariants = cva(
  `group flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-solid text-left transition-colors duration-(--ui-duration-fast) ${SUGGESTION_FOCUS_RING}`,
  {
    variants: {
      surface: {
        default:
          "border-border bg-card shadow-xs hover:border-foreground/20 hover:bg-accent/50 dark:border-white/10 dark:hover:border-white/20",
        ghost:
          "border-border/75 bg-secondary/45 hover:border-border hover:bg-secondary/75 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/8",
        glass:
          "border-border bg-popover/90 shadow-xs backdrop-blur-xl hover:border-foreground/20 hover:bg-accent/50 dark:border-white/10 dark:bg-popover/85 dark:hover:border-white/20",
      },
      size: {
        sm: "p-3",
        md: "p-3.5",
      },
    },
    defaultVariants: {
      surface: "default",
      size: "md",
    },
  },
);

export const suggestionListContainerVariants = cva(
  "flex w-full flex-col divide-y divide-border overflow-hidden rounded-xl border border-solid font-sans dark:divide-white/10",
  {
    variants: {
      surface: {
        default: "border-border bg-card shadow-xs dark:border-white/10",
        ghost: "border-border/75 bg-transparent dark:border-white/10",
        glass:
          "border-border bg-popover/90 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-popover/85",
      },
    },
    defaultVariants: {
      surface: "default",
    },
  },
);
