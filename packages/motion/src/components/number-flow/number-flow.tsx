"use client";

/**
 * NumberFlow：按位独立垂直滚动的数字过渡组件，始终启用 tabular-nums 防横向抖动。
 */
import { cn } from "@matt-ui/utils";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useMemo } from "react";
import type { NumberFlowProps } from "./number-flow.types.js";

const DIGIT_SPRING = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.7 };

const DigitSlot = ({ char, slotKey }: { char: string; slotKey: string }) => {
  if (!/\d/.test(char)) {
    return <span className="inline-block">{char}</span>;
  }
  return (
    <span className="relative inline-flex h-[1.15em] w-[0.64em] items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${slotKey}-${char}`}
          initial={{ y: "65%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-65%", opacity: 0 }}
          transition={DIGIT_SPRING}
          className="inline-block"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export const NumberFlow = ({
  value,
  format,
  locales = "zh-CN",
  prefix,
  suffix,
  className,
}: NumberFlowProps) => {
  const formatted = useMemo(
    () => new Intl.NumberFormat(locales, format).format(value),
    [locales, format, value],
  );
  const chars = [...formatted];

  return (
    <MotionConfig reducedMotion="user">
      <span
        data-slot="number-flow"
        className={cn(
          "inline-flex items-baseline font-mono font-semibold tracking-tight text-foreground tabular-nums",
          className,
        )}
      >
        <span className="sr-only">
          {prefix}
          {formatted}
          {suffix}
        </span>
        <span aria-hidden="true" className="inline-flex items-baseline">
          {prefix && <span>{prefix}</span>}
          {chars.map((char, idx) => (
            <DigitSlot
              key={`${chars.length - idx}`}
              slotKey={`${chars.length - idx}`}
              char={char}
            />
          ))}
          {suffix && (
            <span className="ml-0.5 font-sans text-[0.55em] font-normal text-muted-foreground">
              {suffix}
            </span>
          )}
        </span>
      </span>
    </MotionConfig>
  );
};
