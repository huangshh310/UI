/**
 * AudioWaves 视觉变体映射表。
 */
import type { AudioWavesSize, AudioWavesTone } from "./audio-waves.types.js";

export const WAVE_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

/** 自然语音包络曲线（用于纯 scaleY GPU 合成动画） */
export const WAVE_BAR_ENVELOPE = [
  0.26, 0.44, 0.68, 0.56, 0.88, 0.74, 1, 0.84, 0.92, 0.66, 0.76, 0.52, 0.38, 0.24,
] as const;

export const WAVE_SHELL_TONE: Record<AudioWavesTone, string> = {
  default: "border-border bg-card text-card-foreground shadow-xs dark:border-white/10",
  signal: "border-border bg-card text-card-foreground shadow-xs dark:border-white/10",
  emerald: "border-border bg-card text-card-foreground shadow-xs dark:border-white/10",
  obsidian: "[color-scheme:dark] border-white/10 bg-neutral-950 text-neutral-50 shadow-xs",
};

export const WAVE_BAR_ACTIVE_COLOR: Record<AudioWavesTone, string> = {
  default: "bg-foreground/85",
  signal: "bg-signal",
  emerald: "bg-emerald-600 dark:bg-emerald-400",
  obsidian: "bg-white/90",
};

export const WAVE_BAR_IDLE_COLOR: Record<AudioWavesTone, string> = {
  default: "bg-muted-foreground/30",
  signal: "bg-muted-foreground/30",
  emerald: "bg-muted-foreground/30",
  obsidian: "bg-white/20",
};

export const WAVE_DOT_INDICATOR: Record<AudioWavesTone, string> = {
  default: "bg-foreground/80",
  signal: "bg-signal",
  emerald: "bg-emerald-600 dark:bg-emerald-400",
  obsidian: "bg-white/85",
};

export const WAVE_SIZE_CLASS: Record<AudioWavesSize, { box: string; barHeight: string }> = {
  sm: { box: "h-5 gap-[2.5px]", barHeight: "h-4" },
  md: { box: "h-7 gap-[3px]", barHeight: "h-6" },
  lg: { box: "h-9 gap-1", barHeight: "h-8" },
};
