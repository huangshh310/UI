/**
 * Shimmer 的样式定义：微光流光扫掠时长、色调映射、流式段落骨架尺寸与利落容器表面。
 */
import { cva } from "class-variance-authority";
import type { ShimmerSpeed, ShimmerTone } from "./shimmer.types.js";

/** 扫光动画时长（毫秒），供 Web Animations API 直接驱动 */
export const SHIMMER_SPEED_MS: Record<ShimmerSpeed, number> = {
  slow: 2800,
  normal: 1800,
  fast: 1100,
};

/** 扫光装饰层按语义色调区分的线性渐变高光带 */
export const SHIMMER_SWEEP_GRADIENT: Record<ShimmerTone, string> = {
  muted: "linear-gradient(110deg, transparent 28%, var(--ui-foreground) 50%, transparent 72%)",
  foreground:
    "linear-gradient(110deg, transparent 28%, color-mix(in oklab, var(--ui-background) 78%, transparent) 50%, transparent 72%)",
  signal:
    "linear-gradient(110deg, transparent 28%, color-mix(in oklab, var(--ui-signal-foreground) 82%, var(--ui-signal)) 50%, transparent 72%)",
};

/** 段落骨架条水平流光渐变 */
export const SHIMMER_LINE_SWEEP_GRADIENT =
  "linear-gradient(110deg, transparent 25%, color-mix(in oklab, var(--ui-background) 72%, transparent) 50%, transparent 75%)";

export const SHIMMER_LINE_WIDTHS = ["w-[88%]", "w-[74%]", "w-[60%]", "w-[81%]", "w-[48%]"] as const;

export const shimmerTextVariants = cva("relative inline-flex items-center font-sans font-medium", {
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
      pill: "rounded-full border border-solid border-border bg-card px-3 py-1 shadow-xs dark:border-white/10",
    },
  },
  defaultVariants: {
    size: "xs",
    tone: "muted",
    variant: "default",
  },
});

export const shimmerLinesContainerVariants = cva("flex w-full flex-col", {
  variants: {
    size: {
      sm: "gap-2",
      md: "gap-2.5",
      lg: "gap-3",
    },
    variant: {
      default: "py-1",
      card: "rounded-xl border border-solid border-border bg-card p-4 shadow-xs dark:border-white/10",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export const shimmerLineBarVariants = cva("block rounded-full", {
  variants: {
    size: {
      sm: "h-2.5",
      md: "h-3",
      lg: "h-3.5",
    },
    tone: {
      muted: "bg-secondary dark:bg-white/10",
      subtle: "bg-muted dark:bg-white/6",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "muted",
  },
});
