/**
 * SplitButton 的样式定义：主操作按钮、菜单触发按钮与分隔线。
 */
import { cva } from "class-variance-authority";

const SEGMENT_BASE = [
  "m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center gap-2 border border-solid",
  "font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none",
  "transition-[background-color,border-color,color,transform] duration-(--ui-duration-fast) ease-out active:scale-[0.985] motion-reduce:active:scale-100",
  "outline-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
  "data-loading:pointer-events-none",
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
].join(" ");

export const splitSegmentVariants = cva(SEGMENT_BASE, {
  variants: {
    variant: {
      primary: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
      signal: "border-transparent bg-signal text-signal-foreground hover:bg-signal/92",
      secondary: "border-border/70 bg-secondary text-secondary-foreground hover:bg-accent",
      outline:
        "border-border bg-card text-foreground hover:border-foreground/22 hover:bg-accent/70 dark:bg-card/85 dark:hover:bg-accent",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    size: {
      sm: "h-8 text-xs",
      md: "h-10 text-sm",
      lg: "h-11 text-[15px]",
    },
    part: {
      primary: "",
      trigger: "group",
    },
    radius: {
      pill: "",
      default: "",
    },
  },
  compoundVariants: [
    { part: "primary", size: "sm", class: "pr-3 pl-3.5" },
    { part: "primary", size: "md", class: "pr-4 pl-5" },
    { part: "primary", size: "lg", class: "pr-4.5 pl-6" },
    { part: "trigger", size: "sm", class: "pr-2.5 pl-2" },
    { part: "trigger", size: "md", class: "pr-3.5 pl-2.5" },
    { part: "trigger", size: "lg", class: "pr-4 pl-3" },
    { part: "primary", radius: "pill", class: "rounded-l-full rounded-r-none" },
    { part: "trigger", radius: "pill", class: "rounded-l-none rounded-r-full" },
    { part: "primary", radius: "default", class: "rounded-l-lg rounded-r-none" },
    { part: "trigger", radius: "default", class: "rounded-l-none rounded-r-lg" },
    { part: "primary", radius: "default", size: "lg", class: "rounded-l-xl" },
    { part: "trigger", radius: "default", size: "lg", class: "rounded-r-xl" },
    { part: "trigger", variant: "outline", class: "-ml-px" },
    { part: "trigger", variant: "secondary", class: "-ml-px" },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
    part: "primary",
    radius: "pill",
  },
});

/** 整个分体控件的外层阴影与圆角 */
export const splitGroupVariants = cva("inline-flex items-stretch", {
  variants: {
    variant: {
      primary:
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
      signal: "shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_1px_3px_rgba(21,93,252,0.26)]",
      secondary: "shadow-xs",
      outline: "shadow-xs",
      destructive: "shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
    },
    radius: {
      pill: "rounded-full",
      default: "rounded-lg",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  compoundVariants: [{ size: "lg", radius: "default", class: "rounded-xl" }],
  defaultVariants: {
    variant: "primary",
    radius: "pill",
    size: "md",
  },
});

/** 实底变体中间的 1px 发丝分隔线 */
export const SPLIT_DIVIDER_CLASSES = {
  primary: "bg-primary-foreground/22",
  signal: "bg-signal-foreground/25",
  destructive: "bg-destructive-foreground/25",
} as const;
