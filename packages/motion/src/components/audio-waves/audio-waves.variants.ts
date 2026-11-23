/**
 * AudioWaves 视觉变体映射表。
 */
import type { AudioWavesSize, AudioWavesTone } from "./audio-waves.types.js";

export const WAVE_BAR_ENVELOPE = [
  0.28, 0.5, 0.78, 0.62, 0.95, 0.72, 1, 0.88, 0.95, 0.64, 0.8, 0.52, 0.36, 0.25,
] as const;

export const WAVE_SHELL_TONE: Record<AudioWavesTone, string> = {
  default: "border-border/85 bg-card text-card-foreground shadow-xs",
  signal: "border-signal/25 bg-card text-card-foreground shadow-xs",
  emerald: "border-emerald-500/25 bg-card text-card-foreground shadow-xs",
  obsidian: "[color-scheme:dark] border-zinc-800 bg-zinc-950 text-zinc-50 shadow-md",
};

export const WAVE_BAR_ACTIVE_COLOR: Record<AudioWavesTone, string> = {
  default: "bg-foreground",
  signal: "bg-signal",
  emerald: "bg-emerald-500",
  obsidian: "bg-emerald-400",
};

export const WAVE_BAR_IDLE_COLOR: Record<AudioWavesTone, string> = {
  default: "bg-muted-foreground/35",
  signal: "bg-muted-foreground/35",
  emerald: "bg-muted-foreground/35",
  obsidian: "bg-zinc-700",
};

export const WAVE_DOT_INDICATOR: Record<AudioWavesTone, string> = {
  default: "bg-emerald-500",
  signal: "bg-signal",
  emerald: "bg-emerald-500",
  obsidian: "bg-emerald-400",
};

export const WAVE_HEIGHT_BY_SIZE: Record<AudioWavesSize, { box: string; maxPx: number }> = {
  sm: { box: "h-6 gap-[2.5px]", maxPx: 18 },
  md: { box: "h-8 gap-[3px]", maxPx: 26 },
  lg: { box: "h-10 gap-1", maxPx: 34 },
};
