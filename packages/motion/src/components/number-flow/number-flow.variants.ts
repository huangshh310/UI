/**
 * NumberFlow 的排版档位、趋势语义色与弹簧参数映射（不依赖 class-variance-authority）。
 */
import type { NumberFlowSize, NumberFlowTrend } from "./number-flow.types.js";

export const NUMBER_FLOW_DIGIT_SPRING = {
  type: "spring" as const,
  stiffness: 360,
  damping: 30,
  mass: 0.72,
};

export const NUMBER_FLOW_ROOT_BASE =
  "inline-flex items-baseline font-mono font-semibold tracking-[-0.03em] tabular-nums transition-colors duration-(--ui-duration-fast)";

export const NUMBER_FLOW_SIZE_CLASSES: Record<NumberFlowSize, string> = {
  sm: "text-base leading-none",
  md: "text-2xl leading-none",
  lg: "text-3xl leading-none",
  xl: "text-4xl leading-none",
};

export const NUMBER_FLOW_TREND_CLASSES: Record<NumberFlowTrend, string> = {
  neutral: "text-foreground",
  up: "text-emerald-700 dark:text-emerald-400",
  down: "text-destructive",
};

export const NUMBER_FLOW_DIGIT_SLOT_CLASS =
  "relative inline-flex h-[1.18em] w-[0.62em] items-center justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]";

export const NUMBER_FLOW_PREFIX_CLASS = "mr-[0.06em] font-sans text-[0.76em] font-medium";

export const NUMBER_FLOW_SUFFIX_CLASS =
  "ml-[0.16em] font-sans text-[0.52em] font-medium tracking-normal";
