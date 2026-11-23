/**
 * Shimmer 的样式定义：微光文字变体、流式段落骨架尺寸与容器表面。
 */
import { cva } from "class-variance-authority";
import type { ShimmerSpeed } from "./shimmer.types.js";

export const SHIMMER_SPEED_DURATION: Record<ShimmerSpeed, string> = {
  slow: "duration-(--ui-duration-slow)",
  normal: "duration-(--ui-duration-normal)",
  fast: "duration-(--ui-duration-fast)",
};

export const SHIMMER_LINE_WIDTHS = ["w-[88%]", "w-[74%]", "w-[60%]", "w-[81%]", "w-[48%]"] as const;

export const shimmerTextVariants = cva(
  "relative inline-block overflow-hidden font-sans font-medium",
  {
    variants: {
      size: {
        xs: "text-xs leading-5",
        sm: "text-sm leading-5",
        md: "text-base leading-6",
      },
      tone: {
        muted: "text-muted-foreground",
        foreground: "text-foreground",
        signal: "text-signal",
      },
      variant: {
        default: "",
        pill: "rounded-full border border-solid border-border/80 bg-card/85 px-3 py-1 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-card/75",
      },
    },
    defaultVariants: {
      size: "xs",
      tone: "muted",
      variant: "default",
    },
  },
);

export const shimmerLinesContainerVariants = cva("flex w-full flex-col", {
  variants: {
    size: {
      sm: "gap-2",
      md: "gap-2.5",
      lg: "gap-3",
    },
    variant: {
      default: "py-1",
      card: "rounded-2xl border border-solid border-border/80 bg-card/80 p-4 shadow-xs dark:border-white/10 dark:bg-card/70",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export const shimmerLineBarVariants = cva(
  "block animate-pulse rounded-full motion-reduce:animate-none",
  {
    variants: {
      size: {
        sm: "h-2.5",
        md: "h-3",
        lg: "h-3.5",
      },
      tone: {
        muted: "bg-secondary/95 dark:bg-white/10",
        subtle: "bg-muted/85 dark:bg-white/7",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "muted",
    },
  },
);
