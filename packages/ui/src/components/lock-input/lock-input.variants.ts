/**
 * LockInput 的样式定义：视觉变体、尺寸、圆角、聚焦锁定环与交互微按钮。
 * 聚焦锁定环采用 -inset-px 与壳体边线齐平贴合，避免出现内外双层重复边框；
 * 颜色、圆角与时长全部使用标准语义 Token，保证在任意 shadcn 主题与深浅模式下表现一致。
 */
import { cva } from "class-variance-authority";

const SHELL_BASE = [
  "relative flex items-center border border-solid text-foreground",
  "transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast)",
  "data-invalid:border-destructive",
].join(" ");

export const lockInputShellVariants = cva(SHELL_BASE, {
  variants: {
    variant: {
      default:
        "border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-foreground/22 group-focus-within/lock:shadow-none data-locked:border-border/80 data-locked:bg-muted/75 data-locked:shadow-none",
      filled:
        "border-transparent bg-secondary hover:bg-accent/75 group-focus-within/lock:bg-card data-locked:border-border/60 data-locked:bg-muted",
      ghost:
        "border-transparent bg-transparent hover:bg-secondary/65 group-focus-within/lock:bg-card data-locked:border-dashed data-locked:border-border data-locked:bg-muted/45",
      underline:
        "rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0.5 shadow-none hover:border-foreground/30 data-locked:border-dashed data-locked:border-border",
    },
    size: {
      sm: "h-9 gap-1.5 px-3 text-xs",
      md: "h-10.5 gap-2 px-3.5 text-sm",
      lg: "h-12 gap-2.5 px-4 text-[15px]",
    },
    radius: {
      md: "rounded-lg",
      lg: "rounded-xl",
      full: "rounded-full",
    },
    ringTone: {
      signal: "",
      neutral: "",
    },
  },
  compoundVariants: [
    { variant: "underline", radius: "md", class: "rounded-none" },
    { variant: "underline", radius: "lg", class: "rounded-none" },
    { variant: "underline", radius: "full", class: "rounded-none" },
    { variant: "underline", size: "sm", class: "px-0.5" },
    { variant: "underline", size: "md", class: "px-0.5" },
    { variant: "underline", size: "lg", class: "px-0.5" },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    radius: "lg",
    ringTone: "signal",
  },
});

const RING_BASE = [
  "pointer-events-none absolute opacity-0",
  "transition-[transform,opacity] duration-(--ui-duration-normal) ease-[cubic-bezier(0.22,1,0.36,1)]",
  "motion-reduce:transition-opacity",
].join(" ");

export const lockInputRingVariants = cva(RING_BASE, {
  variants: {
    variant: {
      default:
        "-inset-px border-2 border-solid scale-x-[1.02] scale-y-[1.08] group-focus-within/lock:scale-100 group-focus-within/lock:opacity-100",
      filled:
        "-inset-px border-2 border-solid scale-x-[1.02] scale-y-[1.08] group-focus-within/lock:scale-100 group-focus-within/lock:opacity-100",
      ghost:
        "-inset-px border-2 border-solid scale-x-[1.02] scale-y-[1.08] group-focus-within/lock:scale-100 group-focus-within/lock:opacity-100",
      underline:
        "inset-x-0 -bottom-px top-auto h-0.5 border-0 scale-x-0 group-focus-within/lock:scale-x-100 group-focus-within/lock:opacity-100",
    },
    radius: {
      md: "rounded-lg",
      lg: "rounded-xl",
      full: "rounded-full",
    },
    ringTone: {
      signal:
        "border-ring group-data-locked/lock:border-foreground/45 group-data-invalid/lock:border-destructive",
      neutral:
        "border-foreground/85 group-data-locked/lock:border-foreground/45 group-data-invalid/lock:border-destructive",
    },
  },
  compoundVariants: [
    { variant: "underline", radius: "md", class: "rounded-full" },
    { variant: "underline", radius: "lg", class: "rounded-full" },
    { variant: "underline", radius: "full", class: "rounded-full" },
    {
      variant: "underline",
      ringTone: "signal",
      class:
        "bg-ring group-data-locked/lock:bg-muted-foreground/45 group-data-invalid/lock:bg-destructive",
    },
    {
      variant: "underline",
      ringTone: "neutral",
      class:
        "bg-foreground group-data-locked/lock:bg-muted-foreground/45 group-data-invalid/lock:bg-destructive",
    },
  ],
  defaultVariants: {
    variant: "default",
    radius: "lg",
    ringTone: "signal",
  },
});

export const lockInputActionVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer items-center justify-center text-muted-foreground",
    "transition-[background-color,color,transform] duration-(--ui-duration-fast)",
    "hover:bg-accent hover:text-foreground active:scale-95 motion-reduce:active:scale-100",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-45",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-6",
        md: "size-6.5",
        lg: "size-7.5",
      },
      radius: {
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      radius: "lg",
    },
  },
);
