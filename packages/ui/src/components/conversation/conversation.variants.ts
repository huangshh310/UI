/**
 * Conversation 的样式定义：极简/发丝画布/毛玻璃视口、阅读栏宽阶梯与悬浮归位触发器。
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
          "rounded-2xl border border-solid border-border/80 bg-background shadow-xs dark:border-white/10",
        glass:
          "rounded-2xl border border-solid border-border/75 bg-card/75 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-card/65",
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
      sm: "max-w-xl gap-4 px-3.5 py-4",
      md: "max-w-2xl gap-6 px-4 py-6",
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
  `pointer-events-auto inline-flex cursor-pointer items-center justify-center rounded-full border border-solid border-border/80 bg-popover/96 font-sans text-xs font-medium text-popover-foreground shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18),0_2px_6px_-1px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-[transform,background-color,border-color,box-shadow] duration-(--ui-duration-fast) hover:-translate-y-0.5 hover:border-foreground/22 hover:bg-popover active:scale-98 dark:border-white/12 dark:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.75)] dark:hover:border-white/22 ${CONVERSATION_FOCUS_RING}`,
  {
    variants: {
      variant: {
        pill: "h-8 gap-1.5 px-3",
        icon: "relative size-8.5",
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  },
);
