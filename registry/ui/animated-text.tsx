// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AnimatedText：精致排版微动效组件，支持逐段显现（fade-up / blur-in / slide / wave）、
 * 短语轮播与流光扫掠，完整保留屏幕阅读器可读文本并平滑降级减弱动效。
 */

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";

export const ANIMATED_TEXT_TONE_CLASSES: Record<AnimatedTextTone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  signal: "text-signal dark:text-blue-400",
  emerald: "text-emerald-700 dark:text-emerald-400",
};

export const ANIMATED_TEXT_SIZE_CLASSES: Record<AnimatedTextSize, string> = {
  sm: "text-xs leading-relaxed tracking-normal",
  md: "text-base leading-snug tracking-[-0.015em]",
  lg: "text-xl leading-tight tracking-[-0.025em]",
  xl: "text-3xl leading-[1.12] tracking-[-0.035em]",
};

export interface RevealMotionPreset {
  masked: boolean;
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  transition: Transition;
}

export const ANIMATED_TEXT_REVEAL_PRESETS: Record<AnimatedTextVariant, RevealMotionPreset> = {
  "fade-up": {
    masked: true,
    initial: { y: "85%" },
    animate: { y: "0%" },
    transition: { type: "spring", stiffness: 360, damping: 28, mass: 0.75 },
  },
  "blur-in": {
    masked: false,
    initial: { y: 5, filter: "blur(6px)" },
    animate: { y: 0, filter: "blur(0px)" },
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
  },
  slide: {
    masked: true,
    initial: { x: -12 },
    animate: { x: 0 },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
  wave: {
    masked: false,
    initial: { y: 10, scale: 0.94 },
    animate: { y: 0, scale: 1 },
    transition: { type: "spring", stiffness: 440, damping: 22, mass: 0.7 },
  },
};

export interface CycleMotionPreset {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  exit: Record<string, number | string>;
  transition: Transition;
}

export const ANIMATED_TEXT_CYCLE_PRESETS: Record<AnimatedTextVariant, CycleMotionPreset> = {
  "fade-up": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: "0%", opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
    transition: { type: "spring", stiffness: 380, damping: 32, mass: 0.72 },
  },
  "blur-in": {
    initial: { y: 6, opacity: 0, filter: "blur(6px)" },
    animate: { y: 0, opacity: 1, filter: "blur(0px)" },
    exit: { y: -6, opacity: 0, filter: "blur(6px)" },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
  slide: {
    initial: { x: 14, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -14, opacity: 0 },
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
  wave: {
    initial: { y: 10, scale: 0.94, opacity: 0 },
    animate: { y: 0, scale: 1, opacity: 1 },
    exit: { y: -10, scale: 0.96, opacity: 0 },
    transition: { type: "spring", stiffness: 420, damping: 24, mass: 0.72 },
  },
};

export const ANIMATED_TEXT_SHIMMER_TRANSITION: Transition = {
  duration: 2.2,
  repeat: Infinity,
  ease: "easeInOut",
};
export type AnimatedTextMode = "reveal" | "cycle" | "shimmer";

/** 入场与切换编排风格 */
export type AnimatedTextVariant = "fade-up" | "blur-in" | "slide" | "wave";

/** 语义文字色调 */
export type AnimatedTextTone = "default" | "muted" | "signal" | "emerald";

/** 排版字号档位 */
export type AnimatedTextSize = "sm" | "md" | "lg" | "xl";

export interface AnimatedTextProps {
  /** 要展示的文本；cycle 模式下可传 phrases 数组 */
  text?: string;
  /** cycle 模式下轮播的短语列表 */
  phrases?: string[];
  /** 动效模式：逐段显现 / 词句轮播 / 流光思考，默认 reveal */
  mode?: AnimatedTextMode;
  /** reveal 与 cycle 模式的动效编排风格，默认 fade-up */
  variant?: AnimatedTextVariant;
  /** 语义色调；shimmer 默认 muted，其余默认 default */
  tone?: AnimatedTextTone;
  /** 可选排版字号档位；不传时继承父级字号 */
  size?: AnimatedTextSize;
  /** cycle 轮播间隔（毫秒），默认 2400 */
  intervalMs?: number;
  /** reveal 逐段错峰间隔（毫秒），默认 32 */
  staggerMs?: number;
  /** 自定义类名 */
  className?: string;
}
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
