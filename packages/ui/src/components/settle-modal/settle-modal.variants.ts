/**
 * SettleModal 的样式定义：磨砂玻璃浮层、多层次柔和阴影与阻尼落位过渡。
 */
import { cva } from "class-variance-authority";

export const settleModalBackdropVariants = cva(
  "fixed inset-0 z-50 transition-opacity duration-(--ui-duration-normal) data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
  {
    variants: {
      backdrop: {
        blur: "bg-black/25 backdrop-blur-[6px] dark:bg-black/65",
        dim: "bg-black/40 dark:bg-black/72",
        transparent: "bg-transparent",
      },
    },
    defaultVariants: {
      backdrop: "blur",
    },
  },
);

export const settleModalPopupVariants = cva(
  [
    "fixed left-1/2 z-50 flex w-[calc(100vw-2rem)] -translate-x-1/2 flex-col overflow-hidden",
    "rounded-2xl border border-solid border-border/80 bg-popover/96 text-popover-foreground backdrop-blur-xl outline-none",
    "shadow-[0_20px_54px_-12px_rgba(0,0,0,0.16),0_4px_14px_-2px_rgba(0,0,0,0.06)]",
    "dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_26px_68px_-14px_rgba(0,0,0,0.75)]",
    "transition-[opacity,transform] duration-(--ui-duration-normal) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    "data-starting-style:scale-[0.96] data-starting-style:opacity-0",
    "data-ending-style:scale-[0.97] data-ending-style:opacity-0",
  ],
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-xl",
        xl: "max-w-2xl",
      },
      align: {
        center:
          "top-1/2 -translate-y-1/2 data-starting-style:translate-y-[calc(-50%+12px)] data-ending-style:translate-y-[calc(-50%+8px)]",
        top: "top-[12vh] data-starting-style:translate-y-3 data-ending-style:translate-y-2",
      },
      tone: {
        default: "",
        signal: "border-signal/25 dark:border-signal/35",
        destructive: "border-destructive/30 dark:border-destructive/40",
      },
    },
    defaultVariants: {
      size: "md",
      align: "center",
      tone: "default",
    },
  },
);

export const settleModalIconVariants = cva(
  "inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-solid",
  {
    variants: {
      tone: {
        default:
          "border-border/80 bg-secondary/70 text-foreground dark:border-white/10 dark:bg-white/7",
        signal: "border-transparent bg-signal/12 text-info dark:bg-signal/22",
        destructive:
          "border-destructive/25 bg-destructive/10 text-destructive dark:border-destructive/35 dark:bg-destructive/18",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);
