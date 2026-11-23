// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * NumberFlow：按位独立垂直滚动的等宽数字过渡组件。
 * 随数值增减自动切换上滚/下滚方向，启用 tabular-nums 与边缘柔化遮罩防止横向抖动。
 */

import { cn } from "@/lib/utils";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

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

export const NUMBER_FLOW_PREFIX_CLASS =
  "mr-[0.06em] font-sans text-[0.76em] font-medium opacity-75";

export const NUMBER_FLOW_SUFFIX_CLASS =
  "ml-[0.16em] font-sans text-[0.52em] font-medium tracking-normal opacity-70";
export type NumberFlowSize = "sm" | "md" | "lg" | "xl";

/** 数值变化趋势语义色 */
export type NumberFlowTrend = "neutral" | "up" | "down";

export interface NumberFlowProps {
  /** 要展示的数值 */
  value: number;
  /** Intl.NumberFormat 格式化配置 */
  format?: Intl.NumberFormatOptions;
  /** 区域设置，默认 zh-CN */
  locales?: string;
  /** 前缀（如 ¥、+） */
  prefix?: string;
  /** 后缀（如 /月、ms） */
  suffix?: string;
  /** 排版字号档位，默认 md */
  size?: NumberFlowSize;
  /** 趋势语义着色，默认 neutral */
  trend?: NumberFlowTrend;
  /** 自定义类名 */
  className?: string;
}
const NUMBER_FLOW_DEFAULTS = {
  locales: "zh-CN",
  size: "md",
  trend: "neutral",
} as const;

interface DigitSlotProps {
  char: string;
  slotKey: string;
  direction: number;
  reduced: boolean;
}

const DigitSlot = ({ char, slotKey, direction, reduced }: DigitSlotProps) => {
  if (!/\d/.test(char)) {
    return <span className="inline-block opacity-85">{char}</span>;
  }
  const enterY = reduced ? "0%" : direction >= 0 ? "72%" : "-72%";
  const exitY = reduced ? "0%" : direction >= 0 ? "-72%" : "72%";

  return (
    <span className={NUMBER_FLOW_DIGIT_SLOT_CLASS}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${slotKey}-${char}`}
          initial={{ y: enterY, opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: exitY, opacity: 0 }}
          transition={reduced ? { duration: 0 } : NUMBER_FLOW_DIGIT_SPRING}
          className="inline-block"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const useRollDirection = (value: number): number => {
  const [track, setTrack] = useState({ value, direction: 1 });
  if (track.value !== value) {
    setTrack({ value, direction: value >= track.value ? 1 : -1 });
  }
  return track.direction;
};

export const NumberFlow = (inputProps: NumberFlowProps) => {
  const p = { ...NUMBER_FLOW_DEFAULTS, ...inputProps };
  const reduced = Boolean(useReducedMotion());
  const direction = useRollDirection(p.value);
  const formatted = useMemo(
    () => new Intl.NumberFormat(p.locales, p.format).format(p.value),
    [p.locales, p.format, p.value],
  );
  const chars = [...formatted];

  return (
    <MotionConfig reducedMotion="user">
      <span
        data-slot="number-flow"
        data-size={p.size}
        data-trend={p.trend}
        className={cn(
          NUMBER_FLOW_ROOT_BASE,
          NUMBER_FLOW_SIZE_CLASSES[p.size],
          NUMBER_FLOW_TREND_CLASSES[p.trend],
          p.className,
        )}
      >
        <span className="sr-only">
          {p.prefix}
          {formatted}
          {p.suffix}
        </span>
        <span aria-hidden="true" className="inline-flex items-baseline">
          {p.prefix && <span className={NUMBER_FLOW_PREFIX_CLASS}>{p.prefix}</span>}
          {chars.map((char, idx) => (
            <DigitSlot
              key={`${chars.length - idx}`}
              slotKey={`${chars.length - idx}`}
              char={char}
              direction={direction}
              reduced={reduced}
            />
          ))}
          {p.suffix && <span className={NUMBER_FLOW_SUFFIX_CLASS}>{p.suffix}</span>}
        </span>
      </span>
    </MotionConfig>
  );
};
