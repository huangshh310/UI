/**
 * Suggestion 的样式定义：极简发丝质感胶囊、毛玻璃灵感卡与垂直追问列表。
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
  `inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-solid font-sans font-medium transition-[transform,border-color,background-color,box-shadow] duration-(--ui-duration-fast) active:scale-98 ${SUGGESTION_FOCUS_RING}`,
  {
    variants: {
      variant: {
        default:
          "border-border/80 bg-card/90 text-foreground shadow-xs hover:-translate-y-0.5 hover:border-foreground/22 hover:bg-card dark:border-white/10 dark:bg-card/80 dark:hover:border-white/22 dark:hover:bg-card",
        ghost:
          "border-transparent bg-secondary/70 text-foreground hover:bg-secondary dark:bg-white/7 dark:hover:bg-white/12",
        signal:
          "border-signal/35 bg-signal/10 text-foreground hover:-translate-y-0.5 hover:border-signal/55 hover:bg-signal/15 dark:border-signal/40 dark:bg-signal/14",
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
  `group flex cursor-pointer items-start justify-between gap-3 rounded-2xl border border-solid text-left transition-[transform,border-color,background-color,box-shadow] duration-(--ui-duration-fast) ${SUGGESTION_FOCUS_RING}`,
  {
    variants: {
      surface: {
        default:
          "border-border/80 bg-card/90 shadow-xs hover:-translate-y-0.5 hover:border-foreground/22 hover:bg-card dark:border-white/10 dark:bg-card/80 dark:hover:border-white/22 dark:hover:bg-card",
        ghost:
          "border-border/60 bg-secondary/45 hover:border-border hover:bg-secondary/75 dark:border-white/8 dark:bg-white/5 dark:hover:border-white/16 dark:hover:bg-white/8",
        glass:
          "border-border/75 bg-popover/88 shadow-xs backdrop-blur-xl hover:-translate-y-0.5 hover:border-foreground/22 dark:border-white/10 dark:bg-popover/82 dark:hover:border-white/22",
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
  "flex w-full max-w-xl flex-col divide-y divide-border/65 overflow-hidden rounded-2xl border border-solid font-sans dark:divide-white/8",
  {
    variants: {
      surface: {
        default: "border-border/80 bg-card/90 shadow-xs dark:border-white/10 dark:bg-card/80",
        ghost: "border-border/60 bg-transparent dark:border-white/10",
        glass:
          "border-border/75 bg-popover/90 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-popover/82",
      },
    },
    defaultVariants: {
      surface: "default",
    },
  },
);
