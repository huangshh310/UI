/**
 * Calendar 的样式定义：极简发丝卡片、三种网格尺寸与圆角，单焦点环。
 */
import { cva } from "class-variance-authority";

export const calendarRootVariants = cva("w-fit font-sans text-card-foreground select-none", {
  variants: {
    variant: {
      default:
        "rounded-2xl border border-solid border-border/85 bg-card shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/10 dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]",
      elevated:
        "rounded-2xl border border-solid border-border/80 bg-card shadow-[0_10px_30px_-8px_rgba(0,0,0,0.1),0_2px_6px_-1px_rgba(0,0,0,0.04)] dark:border-white/12 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]",
      ghost: "border-0 bg-transparent shadow-none",
    },
    size: {
      sm: "p-3",
      md: "p-3.5",
      lg: "p-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export const calendarTableVariants = cva("border-collapse", {
  variants: {
    size: {
      sm: "w-[224px]",
      md: "w-[252px]",
      lg: "w-[280px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const calendarRowVariants = cva("", {
  variants: {
    size: {
      sm: "h-8",
      md: "h-9",
      lg: "h-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const calendarWeekdayVariants = cva(
  "p-0 text-center text-[11px] font-medium text-muted-foreground",
  {
    variants: {
      size: {
        sm: "size-8",
        md: "size-9",
        lg: "size-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const calendarDayVariants = cva(
  "relative m-0 box-border inline-flex cursor-pointer appearance-none items-center justify-center border border-solid border-transparent bg-transparent font-sans font-normal text-foreground tabular-nums select-none transition-colors duration-(--ui-duration-instant) hover:bg-accent outline-none focus-visible:z-10 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-35",
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        md: "size-9 text-[13px]",
        lg: "size-10 text-sm",
      },
      radius: {
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      radius: "md",
    },
  },
);

export const calendarNavButtonVariants = cva(
  "inline-flex size-7.5 cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent text-muted-foreground transition-[background-color,color,border-color,transform] duration-(--ui-duration-fast) hover:border-border/75 hover:bg-accent/70 hover:text-foreground active:scale-95 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:hover:border-white/12",
);
