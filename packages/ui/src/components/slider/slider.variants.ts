/**
 * Slider 的样式定义：支持 sm / md / lg 尺寸与 default / signal / emerald 三种激活色调。
 */
import { cva } from "class-variance-authority";

export const sliderTrackVariants = cva(
  "relative w-full rounded-full bg-secondary shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-border/60 dark:bg-white/12 dark:ring-white/10",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-1.5",
        lg: "h-2.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const sliderIndicatorVariants = cva(
  "h-full rounded-full transition-colors duration-(--ui-duration-fast)",
  {
    variants: {
      tone: {
        default: "bg-primary",
        signal: "bg-signal",
        emerald: "bg-emerald-500",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export const sliderThumbVariants = cva(
  "group/thumb relative cursor-pointer rounded-full border-2 border-solid bg-background shadow-[0_1px_3px_rgba(0,0,0,0.18),0_0.5px_1px_rgba(0,0,0,0.1)] outline-none transition-[transform,box-shadow,border-color] duration-(--ui-duration-fast) hover:scale-110 focus-visible:ring-4 data-dragging:scale-115 dark:bg-card",
  {
    variants: {
      size: {
        sm: "size-3.5",
        md: "size-4.5",
        lg: "size-5.5",
      },
      tone: {
        default: "border-primary focus-visible:ring-ring/25",
        signal: "border-signal focus-visible:ring-signal/25",
        emerald: "border-emerald-500 focus-visible:ring-emerald-500/25",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "default",
    },
  },
);

export const SLIDER_TOOLTIP_CLASS =
  "pointer-events-none absolute -top-7.5 left-1/2 -translate-x-1/2 translate-y-0.5 rounded-md bg-primary px-1.5 py-0.5 font-mono text-[10px] leading-tight font-medium whitespace-nowrap text-primary-foreground opacity-0 shadow-sm tabular-nums transition-[opacity,transform] duration-(--ui-duration-fast) group-hover/thumb:translate-y-0 group-hover/thumb:opacity-100 group-focus-visible/thumb:translate-y-0 group-focus-visible/thumb:opacity-100 group-data-dragging/thumb:translate-y-0 group-data-dragging/thumb:opacity-100";
