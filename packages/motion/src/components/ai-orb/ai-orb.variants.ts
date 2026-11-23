/**
 * AiOrb 的视觉映射表（无 CVA 依赖，纯静态 Tailwind 字面量）。
 */
import type { AiOrbSize, AiOrbState, AiOrbTone } from "./ai-orb.types.js";

export const ORB_STATE_LABEL: Record<AiOrbState, string> = {
  idle: "AI 待命",
  thinking: "深度思考中…",
  listening: "正在聆听…",
  speaking: "语音回应中…",
};

export const ORB_SIZE_CLASS: Record<AiOrbSize, string> = {
  xs: "size-5",
  sm: "size-7",
  md: "size-12",
  lg: "size-16",
  xl: "size-20",
};

export const ORB_LATTICE_DOT_SIZE: Record<AiOrbSize, string> = {
  xs: "size-[3px]",
  sm: "size-1",
  md: "size-1.5",
  lg: "size-2",
  xl: "size-2.5",
};

export const ORB_LATTICE_PADDING: Record<AiOrbSize, string> = {
  xs: "rounded-lg p-1 gap-0.5",
  sm: "rounded-xl p-1 gap-0.5",
  md: "rounded-2xl p-1.5 gap-1",
  lg: "rounded-[20px] p-2 gap-1.5",
  xl: "rounded-[24px] p-2.5 gap-2",
};

export const ORB_AURORA_MESH: Record<AiOrbState, string> = {
  idle: "conic-gradient(from 40deg, #52525b, #3b82f6, #60a5fa, #71717a, #52525b)",
  thinking: "conic-gradient(from 0deg, #155dfc, #3b82f6, #38bdf8, #818cf8, #155dfc)",
  listening: "conic-gradient(from 90deg, #0284c7, #155dfc, #38bdf8, #60a5fa, #0284c7)",
  speaking: "conic-gradient(from 180deg, #10b981, #14b8a6, #3b82f6, #60a5fa, #10b981)",
};

export const ORB_TONE_MESH: Record<Exclude<AiOrbTone, "auto">, string> = {
  signal: "conic-gradient(from 0deg, #155dfc, #3b82f6, #60a5fa, #2563eb, #155dfc)",
  emerald: "conic-gradient(from 120deg, #059669, #10b981, #2dd4bf, #34d399, #059669)",
  amber: "conic-gradient(from 60deg, #d97706, #f59e0b, #fbbf24, #ea580c, #d97706)",
  mono: "conic-gradient(from 30deg, #3f3f46, #71717a, #e4e4e7, #52525b, #3f3f46)",
};

export const ORB_LATTICE_DOT_BY_STATE: Record<AiOrbState, string> = {
  idle: "bg-zinc-400/55 dark:bg-zinc-500/60",
  thinking: "bg-signal shadow-[0_0_6px_color-mix(in_srgb,var(--ui-signal)_50%,transparent)]",
  listening: "bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.55)]",
  speaking: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.55)]",
};

export const ORB_LATTICE_DOT_BY_TONE: Record<Exclude<AiOrbTone, "auto">, string> = {
  signal: "bg-signal shadow-[0_0_6px_color-mix(in_srgb,var(--ui-signal)_50%,transparent)]",
  emerald: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.55)]",
  amber: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.55)]",
  mono: "bg-zinc-200 shadow-[0_0_6px_rgba(228,228,231,0.45)]",
};

export const ORB_STATUS_DOT_CLASS: Record<AiOrbState, string> = {
  idle: "bg-muted-foreground/50",
  thinking: "bg-signal",
  listening: "bg-sky-500",
  speaking: "bg-emerald-500",
};

export const ORB_AURORA_MOTION: Record<
  AiOrbState,
  { scale: number[]; beat: number; spin: number }
> = {
  idle: { scale: [1, 1.025, 1], beat: 2.6, spin: 7 },
  thinking: { scale: [1, 1.045, 1], beat: 1.9, spin: 3.1 },
  listening: { scale: [1, 1.065, 1], beat: 1.65, spin: 4.2 },
  speaking: { scale: [1, 1.1, 1], beat: 0.85, spin: 2.3 },
};

export const ORB_LATTICE_CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

export const resolveOrbMesh = (state: AiOrbState, tone: AiOrbTone): string =>
  tone === "auto" ? ORB_AURORA_MESH[state] : ORB_TONE_MESH[tone];

export const resolveLatticeDotTone = (state: AiOrbState, tone: AiOrbTone): string =>
  tone === "auto" ? ORB_LATTICE_DOT_BY_STATE[state] : ORB_LATTICE_DOT_BY_TONE[tone];
