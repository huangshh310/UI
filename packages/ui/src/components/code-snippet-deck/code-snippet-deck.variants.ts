/**
 * CodeSnippetDeck 的样式定义：四种视觉风格（编辑卡 / 曜石黑终端 / 浮雕画框 / 极简命令条）。
 */
import { cva } from "class-variance-authority";

export const deckOuterVariants = cva("@container w-full min-w-0 max-w-2xl font-sans", {
  variants: {
    variant: {
      default:
        "overflow-hidden rounded-[22px] border border-solid border-border bg-card text-card-foreground shadow-[0_12px_32px_-12px_rgba(0,0,0,0.08)]",
      terminal:
        "overflow-hidden rounded-[22px] border border-solid border-[#26262c] bg-[#111114] text-[#fafafa] shadow-[0_16px_40px_-14px_rgba(0,0,0,0.35)] [color-scheme:dark]",
      elevated:
        "rounded-[26px] border border-solid border-border/80 bg-secondary/75 p-1.5 text-card-foreground shadow-[0_12px_36px_-14px_rgba(0,0,0,0.08)]",
      minimal:
        "overflow-hidden rounded-2xl border border-solid border-border bg-card text-card-foreground shadow-xs",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const deckInnerVariants = cva("overflow-hidden", {
  variants: {
    variant: {
      default: "",
      terminal: "",
      elevated: "rounded-[20px] border border-solid border-border/80 bg-card shadow-xs",
      minimal: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const deckHeaderVariants = cva(
  "flex min-w-0 flex-wrap items-center justify-between gap-2.5 border-b border-solid px-4 py-2.5",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-muted/65",
        terminal: "border-[#26262c] bg-[#18181c]",
        elevated: "border-border/80 bg-muted/55",
        minimal: "border-border/70 bg-card py-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const deckTabListVariants = cva(
  "inline-flex min-w-0 items-center gap-0.5 rounded-full p-0.5",
  {
    variants: {
      variant: {
        default: "bg-secondary ring-1 ring-border/70",
        terminal: "bg-[#111114] ring-1 ring-white/10",
        elevated: "bg-secondary ring-1 ring-border/70",
        minimal: "bg-secondary/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const deckTabVariants = cva(
  "shrink-0 cursor-pointer rounded-full border-0 bg-transparent px-2.5 py-1 font-mono text-xs font-medium outline-none transition-all duration-(--ui-duration-fast) focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground hover:text-foreground aria-selected:bg-card aria-selected:text-foreground aria-selected:shadow-xs",
        terminal:
          "text-[#a1a1aa] hover:text-[#fafafa] aria-selected:bg-[#27272e] aria-selected:text-[#fafafa]",
        elevated:
          "text-muted-foreground hover:text-foreground aria-selected:bg-card aria-selected:text-foreground aria-selected:shadow-xs",
        minimal:
          "text-muted-foreground hover:text-foreground aria-selected:bg-card aria-selected:text-foreground aria-selected:shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const deckStageVariants = cva("outline-none", {
  variants: {
    variant: {
      default: "bg-background/70 dark:bg-background/60",
      terminal: "bg-[#111114]",
      elevated: "bg-background/75 dark:bg-background/60",
      minimal: "bg-secondary/35 dark:bg-background/50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const deckParamPanelVariants = cva("border-t border-solid px-4 py-3.5", {
  variants: {
    variant: {
      default: "border-border/80 bg-card",
      terminal: "border-[#26262c] bg-[#16161b]",
      elevated: "border-border/80 bg-card",
      minimal: "border-border/70 bg-card py-3",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const deckInputVariants = cva(
  "h-9 w-full min-w-0 rounded-xl border border-solid px-3 font-mono text-xs transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
  {
    variants: {
      variant: {
        default:
          "border-input/55 bg-secondary/30 text-foreground shadow-xs hover:border-input/85 focus-visible:bg-card dark:border-border dark:bg-secondary/45",
        terminal:
          "border-white/12 bg-[#1f1f26] text-[#fafafa] placeholder:text-[#71717a] hover:border-white/25",
        elevated:
          "border-input/55 bg-secondary/30 text-foreground shadow-xs hover:border-input/85 focus-visible:bg-card dark:border-border dark:bg-secondary/45",
        minimal:
          "border-input/55 bg-secondary/40 text-foreground hover:border-input/85 focus-visible:bg-card dark:border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
