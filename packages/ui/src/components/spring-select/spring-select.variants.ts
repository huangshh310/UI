/**
 * SpringSelect 的样式定义：参考 shadcn/ui 极简发丝质感，支持单选与多选芯片。
 */
import { cva } from "class-variance-authority";

export const selectTriggerVariants = cva(
  "group inline-flex w-full cursor-pointer items-center justify-between gap-2 border border-solid font-sans text-foreground select-none transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast) outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input/50 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/25 hover:bg-card data-popup-open:border-ring dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22 dark:hover:bg-card",
        filled:
          "border-transparent bg-secondary/75 hover:bg-secondary data-popup-open:border-ring data-popup-open:bg-card focus-visible:bg-card dark:bg-white/7 dark:hover:bg-white/11",
        elevated:
          "border-border/85 bg-card shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/20 data-popup-open:border-ring dark:border-white/12 dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.5)]",
        ghost: "border-transparent bg-transparent hover:bg-accent/70 data-popup-open:bg-accent/80",
      },
      size: {
        sm: "min-h-8 px-2.5 py-1 text-xs",
        md: "min-h-9.5 px-3 py-1.5 text-sm",
        lg: "min-h-11 px-3.5 py-2 text-sm",
      },
      radius: {
        md: "rounded-lg",
        lg: "rounded-xl",
        pill: "rounded-full",
      },
      invalid: {
        true: "border-destructive hover:border-destructive data-popup-open:border-destructive focus-visible:border-destructive focus-visible:ring-destructive dark:border-destructive dark:hover:border-destructive",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      radius: "md",
      invalid: false,
    },
  },
);

export const selectPopupVariants = cva(
  "min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden border border-solid border-border/80 bg-popover/96 text-popover-foreground backdrop-blur-xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.04)] outline-none transition-[transform,opacity] duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)] data-starting-style:-translate-y-1 data-starting-style:scale-[0.97] data-starting-style:opacity-0 data-ending-style:-translate-y-0.5 data-ending-style:scale-[0.98] data-ending-style:opacity-0 dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]",
  {
    variants: {
      radius: {
        md: "rounded-xl",
        lg: "rounded-2xl",
        pill: "rounded-2xl",
      },
    },
    defaultVariants: {
      radius: "md",
    },
  },
);

export const selectItemVariants = cva(
  "group/item flex cursor-pointer items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 font-sans text-sm outline-none select-none transition-colors duration-(--ui-duration-instant) data-disabled:pointer-events-none data-disabled:opacity-45",
  {
    variants: {
      tone: {
        default:
          "text-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        signal:
          "text-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:text-signal dark:data-selected:text-[#93b4ff]",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export const selectCheckVariants = cva(
  "inline-flex size-4 shrink-0 items-center justify-center transition-transform duration-(--ui-duration-fast) ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  {
    variants: {
      tone: {
        default: "text-foreground",
        signal: "text-signal dark:text-[#93b4ff]",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export const selectMultiBoxVariants = cva(
  "inline-flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-solid border-input/70 bg-transparent transition-colors duration-(--ui-duration-instant)",
  {
    variants: {
      tone: {
        default:
          "group-data-selected/item:border-foreground group-data-selected/item:bg-foreground group-data-selected/item:text-background",
        signal:
          "group-data-selected/item:border-signal group-data-selected/item:bg-signal group-data-selected/item:text-signal-foreground",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export const selectDotVariants = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    dot: {
      signal: "bg-signal",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      destructive: "bg-destructive",
      muted: "bg-muted-foreground/55",
    },
  },
});
