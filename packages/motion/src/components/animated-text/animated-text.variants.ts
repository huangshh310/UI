/**
 * AnimatedText 的排版字号、语义色调与四套动效编排预设（不依赖 class-variance-authority）。
 */
import type { Transition } from "motion/react";
import type {
  AnimatedTextSize,
  AnimatedTextTone,
  AnimatedTextVariant,
} from "./animated-text.types.js";

export const ANIMATED_TEXT_TONE_CLASSES: Record<AnimatedTextTone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  signal: "text-info",
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
