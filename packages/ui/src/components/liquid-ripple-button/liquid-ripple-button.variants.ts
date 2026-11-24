/**
 * LiquidRippleButton 的样式定义：视觉变体、尺寸、圆角与对应波纹色调。
 */
import { cva } from "class-variance-authority";

const BASE_CLASSES = [
  "relative isolate m-0 box-border inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden",
  "appearance-none border border-solid border-transparent",
  "font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none",
  "transition-[background-color,border-color,color,transform,box-shadow] duration-(--ui-duration-fast) ease-out active:scale-[0.985] motion-reduce:active:scale-100",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
].join(" ");

export const liquidRippleButtonVariants = cva(BASE_CLASSES, {
  variants: {
    variant: {
      primary:
        "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.08)] hover:bg-primary/92 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(0,0,0,0.3)]",
      signal:
        "bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(101,71,212,0.28)] hover:bg-signal/92",
      secondary:
        "border-border/60 bg-secondary text-secondary-foreground shadow-xs hover:border-border hover:bg-accent",
      outline:
        "border-border bg-card text-foreground shadow-xs hover:border-foreground/22 hover:bg-accent/70 dark:bg-card/85 dark:hover:bg-accent",
      destructive:
        "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.08)] hover:bg-destructive/92",
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
    variant: "primary",
    size: "md",
    radius: "pill",
  },
});

/** 各变体对应的默认波纹色，确保浅底与深底都清晰可辨 */
export const RIPPLE_TONE_CLASSES = {
  primary: "bg-primary-foreground",
  signal: "bg-signal-foreground",
  secondary: "bg-foreground/25",
  outline: "bg-foreground/20",
  destructive: "bg-destructive-foreground",
} as const;
