/**
 * TypewriterButton 的样式定义：视觉变体、尺寸、圆角与光标样式。
 */
import { cva } from "class-variance-authority";

const BASE_CLASSES = [
  "m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center gap-2 border border-solid",
  "font-mono font-medium tracking-[-0.01em] whitespace-nowrap select-none",
  "transition-[background-color,border-color,color,transform,box-shadow] duration-(--ui-duration-fast) ease-out active:scale-[0.98] motion-reduce:active:scale-100",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
].join(" ");

export const typewriterButtonVariants = cva(BASE_CLASSES, {
  variants: {
    variant: {
      outline:
        "border-border bg-card text-foreground shadow-xs hover:border-foreground/22 hover:bg-accent/70 dark:bg-card/85 dark:hover:bg-accent",
      primary:
        "border-transparent bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.08)] hover:bg-primary/90 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(0,0,0,0.3)]",
      signal:
        "border-transparent bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_1px_2px_rgba(21,93,252,0.28)] hover:bg-signal/92",
      terminal:
        "border-neutral-800 bg-neutral-950 text-neutral-50 shadow-sm hover:border-neutral-700 hover:bg-neutral-900 dark:border-neutral-700/80 dark:bg-neutral-900 dark:hover:bg-neutral-800",
    },
    size: {
      sm: "h-8 px-3.5 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-11 px-6 text-[15px]",
    },
    radius: {
      pill: "rounded-full",
      default: "rounded-lg",
    },
  },
  compoundVariants: [{ size: "lg", radius: "default", class: "rounded-xl" }],
  defaultVariants: {
    variant: "outline",
    size: "md",
    radius: "pill",
  },
});

/** 不同变体下的前缀提示符颜色，浅深主题均保证高对比度 */
export const PREFIX_TONE_CLASSES = {
  outline: "text-muted-foreground",
  primary: "text-primary-foreground",
  signal: "text-signal-foreground",
  terminal: "text-emerald-400",
} as const;

/** 光标形态 */
export const CARET_STYLE_CLASSES = {
  line: "ml-px h-[1.1em] w-[1.5px] rounded-full bg-current",
  block: "ml-0.5 h-[1.05em] w-[0.55em] rounded-[2px] bg-current",
} as const;
