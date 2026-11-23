/**
 * BookCallButton 的样式定义：按钮底面变体、尺寸与展开胶囊色调。
 */
import { cva } from "class-variance-authority";

const BUTTON_BASE = [
  "group relative m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center overflow-hidden rounded-full border border-solid",
  "font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none",
  "transition-[background-color,border-color,transform,box-shadow] duration-(--ui-duration-fast) ease-out active:scale-[0.98] motion-reduce:active:scale-100",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
].join(" ");

export const bookCallButtonVariants = cva(BUTTON_BASE, {
  variants: {
    variant: {
      primary:
        "border-transparent bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_2px_6px_-1px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_8px_-2px_rgba(0,0,0,0.45)]",
      outline:
        "border-border bg-card text-foreground shadow-xs hover:border-foreground/22 dark:bg-card/85",
      surface: "border-border/70 bg-secondary text-secondary-foreground shadow-xs",
    },
    size: {
      sm: "h-10 py-0 pr-4.5 pl-1 text-xs",
      md: "h-12 py-0 pr-6 pl-1.5 text-sm",
      lg: "h-13 py-0 pr-7 pl-1.5 text-[15px]",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export const bookCallCapsuleVariants = cva(
  "absolute rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-[width] duration-(--ui-duration-slow) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
  {
    variants: {
      tone: {
        signal: "bg-signal",
        emerald: "bg-emerald-700 dark:bg-emerald-500",
        primary: "bg-primary",
      },
      size: {
        sm: "inset-y-1 left-1 w-8 group-hover:w-[calc(100%-0.5rem)] group-focus-visible:w-[calc(100%-0.5rem)]",
        md: "inset-y-1.5 left-1.5 w-9 group-hover:w-[calc(100%-0.75rem)] group-focus-visible:w-[calc(100%-0.75rem)]",
        lg: "inset-y-1.5 left-1.5 w-10 group-hover:w-[calc(100%-0.75rem)] group-focus-visible:w-[calc(100%-0.75rem)]",
      },
    },
    defaultVariants: {
      tone: "signal",
      size: "md",
    },
  },
);

/** 胶囊内部前景色，确保浅深主题均满足高对比度 */
export const CAPSULE_FOREGROUND_CLASSES = {
  signal: "text-signal-foreground",
  emerald: "text-white dark:text-neutral-950",
  primary: "text-primary-foreground",
} as const;

/** 静置图标占位宽度，与胶囊初始宽度严格对齐 */
export const LEADING_SLOT_CLASSES = {
  sm: "w-8",
  md: "w-9",
  lg: "w-10",
} as const;
