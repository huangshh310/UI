"use client";

/**
 * AnimatedText：逐段显现、短语轮播与流光文字，自动保留完整无障碍文本并响应减弱动效。
 */
import { cn } from "@matt-ui/utils";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { AnimatedTextProps } from "./animated-text.types.js";

const CycleText = ({
  phrases,
  intervalMs,
  className,
}: {
  phrases: string[];
  intervalMs: number;
  className?: string;
}) => {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || phrases.length <= 1) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % phrases.length), intervalMs);
    return () => window.clearInterval(timer);
  }, [reduced, phrases.length, intervalMs]);

  const current = phrases[index] ?? phrases[0] ?? "";
  return (
    <span
      data-slot="animated-text"
      data-mode="cycle"
      className={cn("inline-flex overflow-hidden", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.24 }}
          className="inline-block"
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const RevealText = ({ text, className }: { text: string; className?: string }) => (
  <MotionConfig reducedMotion="user">
    <span data-slot="animated-text" data-mode="reveal" className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(/(\s+)/).map((seg, idx) => (
          <motion.span
            key={`${seg}-${idx}`}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: idx * 0.03 }}
            className="inline-block whitespace-pre"
          >
            {seg}
          </motion.span>
        ))}
      </span>
    </span>
  </MotionConfig>
);

export const AnimatedText = ({
  text = "",
  phrases = [],
  mode = "reveal",
  intervalMs = 2400,
  className,
}: AnimatedTextProps) => {
  if (mode === "cycle") {
    return (
      <MotionConfig reducedMotion="user">
        <CycleText
          phrases={phrases.length > 0 ? phrases : [text]}
          intervalMs={intervalMs}
          className={className}
        />
      </MotionConfig>
    );
  }
  if (mode === "shimmer") {
    return (
      <span
        data-slot="animated-text"
        data-mode="shimmer"
        className={cn(
          "inline-block font-medium text-foreground animate-pulse motion-reduce:animate-none",
          className,
        )}
      >
        {text}
      </span>
    );
  }
  return <RevealText text={text} className={className} />;
};
