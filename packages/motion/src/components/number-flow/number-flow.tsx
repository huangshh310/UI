"use client";

/**
 * NumberFlow：按位独立垂直滚动的等宽数字过渡组件。
 * 随数值增减自动切换上滚/下滚方向，启用 tabular-nums 与边缘柔化遮罩防止横向抖动。
 */
import { cn } from "@matt-ui/utils";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import type { NumberFlowProps } from "./number-flow.types.js";
import {
  NUMBER_FLOW_DIGIT_SLOT_CLASS,
  NUMBER_FLOW_DIGIT_SPRING,
  NUMBER_FLOW_PREFIX_CLASS,
  NUMBER_FLOW_ROOT_BASE,
  NUMBER_FLOW_SIZE_CLASSES,
  NUMBER_FLOW_SUFFIX_CLASS,
  NUMBER_FLOW_TREND_CLASSES,
} from "./number-flow.variants.js";

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
    return <span className="inline-block">{char}</span>;
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
