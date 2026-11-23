/**
 * Conversation 的样式定义：极简/利落画布/柔光视口、阅读栏宽阶梯与克制悬浮归位触发器。
 */
import { cva } from "class-variance-authority";

export const CONVERSATION_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const conversationRootVariants = cva(
  "relative flex min-h-0 w-full flex-1 flex-col overflow-hidden",
  {
    variants: {
      variant: {
        minimal: "",
        surface:
          "rounded-xl border border-solid border-border bg-background shadow-xs dark:border-white/10",
        glass:
          "rounded-xl border border-solid border-border bg-card/85 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-card/75",
      },
    },
    defaultVariants: {
      variant: "minimal",
    },
  },
);

export const conversationContentVariants = cva("mx-auto flex w-full flex-1 flex-col", {
  variants: {
    size: {
      sm: "max-w-xl gap-4 px-4 py-4",
      md: "max-w-2xl gap-6 px-5 py-6",
      lg: "max-w-3xl gap-7 px-6 py-7",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const conversationEmptyVariants = cva(
  "my-auto flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "gap-3 py-6",
        md: "gap-4 py-10",
        lg: "gap-5 py-14",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const conversationScrollButtonVariants = cva(
  `pointer-events-auto inline-flex cursor-pointer items-center justify-center rounded-full border border-solid border-border bg-popover/98 font-sans text-xs font-medium text-popover-foreground shadow-[0_6px_20px_-6px_rgba(0,0,0,0.12),0_2px_4px_-1px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-colors duration-(--ui-duration-fast) hover:border-foreground/20 hover:bg-accent/60 dark:border-white/10 dark:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.6)] dark:hover:border-white/20 ${CONVERSATION_FOCUS_RING}`,
  {
    variants: {
      variant: {
        pill: "h-8 gap-1.5 px-3",
        icon: "relative size-8",
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  },
);
