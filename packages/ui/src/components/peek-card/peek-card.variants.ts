/**
 * PeekCard 的样式定义：磨砂悬停预览卡、多档宽度与状态圆点色调。
 */
import { cva } from "class-variance-authority";

export const peekCardPopupVariants = cva(
  [
    "z-50 origin-(--transform-origin) rounded-2xl border border-solid border-border/80 bg-popover/96 p-4 text-popover-foreground backdrop-blur-xl outline-none",
    "shadow-[0_18px_46px_-10px_rgba(0,0,0,0.16),0_3px_10px_-2px_rgba(0,0,0,0.05)]",
    "dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.75)]",
    "transition-[opacity,transform] duration-(--ui-duration-fast) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    "data-starting-style:scale-[0.95] data-starting-style:opacity-0 data-ending-style:scale-[0.96] data-ending-style:opacity-0",
  ],
  {
    variants: {
      size: {
        sm: "w-72",
        md: "w-80",
        lg: "w-96",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const peekCardStatusDotVariants = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    tone: {
      signal: "bg-signal",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      destructive: "bg-destructive",
      muted: "bg-muted-foreground/60",
    },
  },
  defaultVariants: {
    tone: "signal",
  },
});
