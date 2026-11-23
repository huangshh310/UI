"use client";

/**
 * AnimatedText：精致排版微动效组件，支持逐段显现（fade-up / blur-in / slide / wave）、
 * 短语轮播与流光扫掠，完整保留屏幕阅读器可读文本并平滑降级减弱动效。
 */
import { cn } from "@matt-ui/utils";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type {
  AnimatedTextProps,
  AnimatedTextSize,
  AnimatedTextTone,
  AnimatedTextVariant,
} from "./animated-text.types.js";
import {
  ANIMATED_TEXT_CYCLE_PRESETS,
  ANIMATED_TEXT_REVEAL_PRESETS,
  ANIMATED_TEXT_SHIMMER_TRANSITION,
  ANIMATED_TEXT_SIZE_CLASSES,
  ANIMATED_TEXT_TONE_CLASSES,
} from "./animated-text.variants.js";

const buildTextClasses = (tone: AnimatedTextTone, size?: AnimatedTextSize, className?: string) =>
  cn(ANIMATED_TEXT_TONE_CLASSES[tone], size && ANIMATED_TEXT_SIZE_CLASSES[size], className);

interface CycleTextProps {
  phrases: string[];
  intervalMs: number;
  variant: AnimatedTextVariant;
  tone: AnimatedTextTone;
  size?: AnimatedTextSize;
  className?: string;
}

const CycleText = ({ phrases, intervalMs, variant, tone, size, className }: CycleTextProps) => {
  const reduced = Boolean(useReducedMotion());
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || phrases.length <= 1) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % phrases.length), intervalMs);
    return () => window.clearInterval(timer);
  }, [reduced, phrases.length, intervalMs]);

  const current = phrases[index] ?? phrases[0] ?? "";
  const preset = ANIMATED_TEXT_CYCLE_PRESETS[variant];

  return (
    <span
      data-slot="animated-text"
      data-mode="cycle"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      className={cn(
        "inline-flex overflow-hidden align-bottom",
        buildTextClasses(tone, size, className),
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={reduced ? false : preset.initial}
          animate={preset.animate}
          exit={reduced ? undefined : preset.exit}
          transition={reduced ? { duration: 0 } : preset.transition}
          className="inline-block"
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

interface RevealTextProps {
  text: string;
  variant: AnimatedTextVariant;
  tone: AnimatedTextTone;
  size?: AnimatedTextSize;
  staggerMs: number;
  className?: string;
}

const RevealText = ({ text, variant, tone, size, staggerMs, className }: RevealTextProps) => {
  const reduced = Boolean(useReducedMotion());
  const preset = ANIMATED_TEXT_REVEAL_PRESETS[variant];
  const segments = text.split(/(\s+)/);

  return (
    <span
      data-slot="animated-text"
      data-mode="reveal"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      className={cn("inline-block", buildTextClasses(tone, size, className))}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {segments.map((seg, idx) => {
          const delay = reduced ? 0 : Math.min((idx * staggerMs) / 1000, 0.32);
          const inner = (
            <motion.span
              initial={reduced ? false : preset.initial}
              animate={preset.animate}
              transition={reduced ? { duration: 0 } : { ...preset.transition, delay }}
              className="inline-block whitespace-pre"
            >
              {seg}
            </motion.span>
          );
          return preset.masked ? (
            <span key={`${seg}-${idx}`} className="inline-block overflow-hidden align-bottom">
              {inner}
            </span>
          ) : (
            <span key={`${seg}-${idx}`} className="inline-block">
              {inner}
            </span>
          );
        })}
      </span>
    </span>
  );
};

interface ShimmerTextProps {
  text: string;
  tone: AnimatedTextTone;
  size?: AnimatedTextSize;
  className?: string;
}

const ShimmerText = ({ text, tone, size, className }: ShimmerTextProps) => {
  const reduced = Boolean(useReducedMotion());

  return (
    <span
      data-slot="animated-text"
      data-mode="shimmer"
      data-tone={tone}
      data-size={size}
      className={cn(
        "relative inline-block overflow-hidden font-medium",
        buildTextClasses(tone, size, className),
      )}
    >
      <span>{text}</span>
      {!reduced && (
        <motion.span
          aria-hidden="true"
          initial={{ x: "-100%" }}
          animate={{ x: "140%" }}
          transition={ANIMATED_TEXT_SHIMMER_TRANSITION}
          className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-transparent via-foreground/18 to-transparent motion-reduce:hidden"
        />
      )}
    </span>
  );
};

const ANIMATED_TEXT_DEFAULTS = {
  text: "",
  phrases: [] as string[],
  mode: "reveal" as const,
  variant: "fade-up" as const,
  intervalMs: 2400,
  staggerMs: 32,
};

export const AnimatedText = (inputProps: AnimatedTextProps) => {
  const p = { ...ANIMATED_TEXT_DEFAULTS, ...inputProps };
  const resolvedTone: AnimatedTextTone = p.tone ?? (p.mode === "shimmer" ? "muted" : "default");

  if (p.mode === "cycle") {
    return (
      <MotionConfig reducedMotion="user">
        <CycleText
          phrases={p.phrases.length > 0 ? p.phrases : [p.text]}
          intervalMs={p.intervalMs}
          variant={p.variant}
          tone={resolvedTone}
          size={p.size}
          className={p.className}
        />
      </MotionConfig>
    );
  }

  if (p.mode === "shimmer") {
    return (
      <MotionConfig reducedMotion="user">
        <ShimmerText text={p.text} tone={resolvedTone} size={p.size} className={p.className} />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <RevealText
        text={p.text}
        variant={p.variant}
        tone={resolvedTone}
        size={p.size}
        staggerMs={p.staggerMs}
        className={p.className}
      />
    </MotionConfig>
  );
};
