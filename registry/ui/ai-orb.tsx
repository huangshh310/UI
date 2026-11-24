// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiOrb：多模态智能体视觉状态球与触感状态胶囊。
 * 支持流体光学球（aurora）、精密微型 OLED 矩阵（lattice）、双轨声纹光环（ring）与触感胶囊形态（pill）。
 */

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useId } from "react";

export interface AuroraPalette {
  base: string;
  cloudA: string;
  cloudB: string;
  cloudC: string;
  bounce: string;
  shadow: string;
  shadowSm: string;
}

export interface LatticePalette {
  dotClass: string;
  centerGlow: string;
  edgeGlow: string;
  cornerGlow: string;
}

export interface RingPalette {
  tail: string;
  head: string;
  inner: string;
  core: string;
  coreShadow: string;
}

export const ORB_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

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
  md: "size-[7px]",
  lg: "size-[9px]",
  xl: "size-[11px]",
};

export const ORB_LATTICE_PADDING: Record<AiOrbSize, string> = {
  xs: "p-[3px] gap-[2px]",
  sm: "p-1 gap-[3px]",
  md: "p-2 gap-1.5",
  lg: "p-2.5 gap-2",
  xl: "p-3 gap-2.5",
};

/** 立体流体光学球配色：冰白高光核心 → 澄澈亮彩过渡 → 饱和主色 → 深邃边缘与同色接地影 */
const AURORA_SIGNAL: AuroraPalette = {
  base: "radial-gradient(circle at 34% 26%, #f5f3ff 0%, #a78bfa 26%, #7a5ee4 60%, #4c1d95 88%, #17122b 100%)",
  cloudA:
    "radial-gradient(circle at 44% 48%, rgba(101,71,212,0.92) 0%, rgba(76,29,149,0.58) 50%, transparent 72%)",
  cloudB:
    "radial-gradient(circle at 58% 40%, rgba(167,139,250,0.92) 0%, rgba(196,181,253,0.46) 46%, transparent 72%)",
  cloudC:
    "radial-gradient(circle at 50% 50%, rgba(245,243,255,0.94) 0%, rgba(221,214,254,0.42) 44%, transparent 68%)",
  bounce: "radial-gradient(ellipse 72% 36% at 54% 92%, rgba(180,158,255,0.58) 0%, transparent 70%)",
  shadow: "0 12px 28px -8px rgba(101,71,212,0.46), 0 3px 10px -3px rgba(19,20,24,0.28)",
  shadowSm: "0 3px 9px -2px rgba(101,71,212,0.42)",
};

const AURORA_LISTENING: AuroraPalette = {
  base: "radial-gradient(circle at 34% 26%, #ecfeff 0%, #22d3ee 28%, #0284c7 62%, #1d4ed8 88%, #172554 100%)",
  cloudA:
    "radial-gradient(circle at 46% 48%, rgba(3,105,161,0.88) 0%, rgba(30,64,175,0.54) 50%, transparent 72%)",
  cloudB:
    "radial-gradient(circle at 56% 40%, rgba(34,211,238,0.92) 0%, rgba(103,232,249,0.46) 46%, transparent 72%)",
  cloudC:
    "radial-gradient(circle at 50% 50%, rgba(236,254,255,0.95) 0%, rgba(165,243,252,0.42) 44%, transparent 68%)",
  bounce: "radial-gradient(ellipse 72% 36% at 54% 92%, rgba(103,232,249,0.6) 0%, transparent 70%)",
  shadow: "0 12px 28px -8px rgba(2,132,199,0.45), 0 3px 10px -3px rgba(15,23,42,0.26)",
  shadowSm: "0 3px 9px -2px rgba(2,132,199,0.42)",
};

const AURORA_EMERALD: AuroraPalette = {
  base: "radial-gradient(circle at 34% 26%, #ecfdf5 0%, #34d399 28%, #059669 62%, #065f46 88%, #022c22 100%)",
  cloudA:
    "radial-gradient(circle at 44% 48%, rgba(4,120,87,0.9) 0%, rgba(6,78,59,0.56) 50%, transparent 72%)",
  cloudB:
    "radial-gradient(circle at 58% 40%, rgba(52,211,153,0.9) 0%, rgba(110,231,183,0.46) 46%, transparent 72%)",
  cloudC:
    "radial-gradient(circle at 50% 50%, rgba(236,253,245,0.94) 0%, rgba(167,243,208,0.44) 44%, transparent 68%)",
  bounce: "radial-gradient(ellipse 72% 36% at 54% 92%, rgba(110,231,183,0.56) 0%, transparent 70%)",
  shadow: "0 12px 28px -8px rgba(5,150,105,0.44), 0 3px 10px -3px rgba(2,44,34,0.28)",
  shadowSm: "0 3px 9px -2px rgba(5,150,105,0.4)",
};

const AURORA_AMBER: AuroraPalette = {
  base: "radial-gradient(circle at 34% 26%, #fffbeb 0%, #fbbf24 28%, #d97706 62%, #92400e 88%, #451a03 100%)",
  cloudA:
    "radial-gradient(circle at 44% 50%, rgba(180,83,9,0.9) 0%, rgba(120,53,15,0.54) 50%, transparent 72%)",
  cloudB:
    "radial-gradient(circle at 58% 40%, rgba(251,191,36,0.92) 0%, rgba(253,230,138,0.46) 46%, transparent 72%)",
  cloudC:
    "radial-gradient(circle at 50% 50%, rgba(255,251,235,0.95) 0%, rgba(254,243,199,0.44) 44%, transparent 68%)",
  bounce: "radial-gradient(ellipse 72% 36% at 54% 92%, rgba(252,211,77,0.56) 0%, transparent 70%)",
  shadow: "0 12px 28px -8px rgba(217,119,6,0.44), 0 3px 10px -3px rgba(69,26,3,0.28)",
  shadowSm: "0 3px 9px -2px rgba(217,119,6,0.4)",
};

const AURORA_MONO: AuroraPalette = {
  base: "radial-gradient(circle at 34% 26%, #fafafa 0%, #a1a1aa 30%, #3f3f46 64%, #18181b 88%, #09090b 100%)",
  cloudA:
    "radial-gradient(circle at 45% 50%, rgba(39,39,42,0.88) 0%, rgba(24,24,27,0.56) 52%, transparent 74%)",
  cloudB:
    "radial-gradient(circle at 58% 38%, rgba(212,212,216,0.82) 0%, rgba(161,161,170,0.38) 48%, transparent 72%)",
  cloudC:
    "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.94) 0%, rgba(228,228,231,0.42) 45%, transparent 68%)",
  bounce: "radial-gradient(ellipse 72% 36% at 54% 92%, rgba(228,228,231,0.48) 0%, transparent 70%)",
  shadow: "0 12px 26px -8px rgba(24,24,27,0.42), 0 3px 10px -3px rgba(9,9,11,0.28)",
  shadowSm: "0 3px 9px -2px rgba(24,24,27,0.34)",
};

const AURORA_IDLE: AuroraPalette = {
  base: "radial-gradient(circle at 34% 26%, #ffffff 0%, #cbd5e1 30%, #64748b 64%, #334155 88%, #0f172a 100%)",
  cloudA:
    "radial-gradient(circle at 46% 50%, rgba(51,65,85,0.78) 0%, rgba(30,41,59,0.46) 52%, transparent 74%)",
  cloudB:
    "radial-gradient(circle at 58% 38%, rgba(203,213,225,0.78) 0%, rgba(148,163,184,0.38) 48%, transparent 72%)",
  cloudC:
    "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.92) 0%, rgba(226,232,240,0.4) 45%, transparent 68%)",
  bounce: "radial-gradient(ellipse 72% 36% at 54% 92%, rgba(226,232,240,0.46) 0%, transparent 70%)",
  shadow: "0 10px 24px -8px rgba(30,41,59,0.34), 0 3px 8px -3px rgba(15,23,42,0.22)",
  shadowSm: "0 3px 8px -2px rgba(30,41,59,0.28)",
};

export const ORB_AURORA_BY_STATE: Record<AiOrbState, AuroraPalette> = {
  idle: AURORA_IDLE,
  thinking: AURORA_SIGNAL,
  listening: AURORA_LISTENING,
  speaking: AURORA_EMERALD,
};

export const ORB_AURORA_BY_TONE: Record<Exclude<AiOrbTone, "auto">, AuroraPalette> = {
  signal: AURORA_SIGNAL,
  emerald: AURORA_EMERALD,
  amber: AURORA_AMBER,
  mono: AURORA_MONO,
};

/** 精密深黑曜石 OLED 矩阵发光点配色：中心最亮，边点次之，角点柔和衰减 */
const LATTICE_SIGNAL: LatticePalette = {
  dotClass: "bg-violet-300",
  centerGlow: "0 0 8px rgba(167,139,250,0.9), 0 0 2px rgba(245,243,255,0.95)",
  edgeGlow: "0 0 5px rgba(167,139,250,0.58)",
  cornerGlow: "0 0 3px rgba(167,139,250,0.28)",
};

const LATTICE_LISTENING: LatticePalette = {
  dotClass: "bg-cyan-300",
  centerGlow: "0 0 8px rgba(34,211,238,0.9), 0 0 2px rgba(236,254,255,0.95)",
  edgeGlow: "0 0 5px rgba(34,211,238,0.58)",
  cornerGlow: "0 0 3px rgba(34,211,238,0.28)",
};

const LATTICE_EMERALD: LatticePalette = {
  dotClass: "bg-emerald-300",
  centerGlow: "0 0 8px rgba(52,211,153,0.9), 0 0 2px rgba(236,253,245,0.95)",
  edgeGlow: "0 0 5px rgba(52,211,153,0.58)",
  cornerGlow: "0 0 3px rgba(52,211,153,0.28)",
};

const LATTICE_AMBER: LatticePalette = {
  dotClass: "bg-amber-300",
  centerGlow: "0 0 8px rgba(251,191,36,0.9), 0 0 2px rgba(255,251,235,0.95)",
  edgeGlow: "0 0 5px rgba(251,191,36,0.58)",
  cornerGlow: "0 0 3px rgba(251,191,36,0.28)",
};

const LATTICE_MONO: LatticePalette = {
  dotClass: "bg-neutral-100",
  centerGlow: "0 0 8px rgba(255,255,255,0.75), 0 0 2px rgba(255,255,255,0.95)",
  edgeGlow: "0 0 4px rgba(255,255,255,0.42)",
  cornerGlow: "0 0 2px rgba(255,255,255,0.2)",
};

export const ORB_LATTICE_BY_STATE: Record<AiOrbState, LatticePalette> = {
  idle: LATTICE_MONO,
  thinking: LATTICE_SIGNAL,
  listening: LATTICE_LISTENING,
  speaking: LATTICE_EMERALD,
};

export const ORB_LATTICE_BY_TONE: Record<Exclude<AiOrbTone, "auto">, LatticePalette> = {
  signal: LATTICE_SIGNAL,
  emerald: LATTICE_EMERALD,
  amber: LATTICE_AMBER,
  mono: LATTICE_MONO,
};

/** 精密双轨天文/声纹光环渐变色：渐变流光主弧 + 内圈细弧 + 悬浮光学核点 */
const RING_SIGNAL: RingPalette = {
  tail: "#b49eff",
  head: "#6547d4",
  inner: "#8b73f2",
  core: "radial-gradient(circle at 34% 28%, #f5f3ff 0%, #b49eff 46%, #6547d4 100%)",
  coreShadow: "0 0 10px rgba(101,71,212,0.5)",
};

const RING_LISTENING: RingPalette = {
  tail: "#67e8f9",
  head: "#0284c7",
  inner: "#22d3ee",
  core: "radial-gradient(circle at 34% 28%, #ecfeff 0%, #22d3ee 46%, #0284c7 100%)",
  coreShadow: "0 0 10px rgba(2,132,199,0.5)",
};

const RING_EMERALD: RingPalette = {
  tail: "#6ee7b7",
  head: "#059669",
  inner: "#34d399",
  core: "radial-gradient(circle at 34% 28%, #ecfdf5 0%, #34d399 46%, #059669 100%)",
  coreShadow: "0 0 10px rgba(5,150,105,0.5)",
};

const RING_AMBER: RingPalette = {
  tail: "#fde68a",
  head: "#d97706",
  inner: "#fbbf24",
  core: "radial-gradient(circle at 34% 28%, #fffbeb 0%, #fbbf24 46%, #d97706 100%)",
  coreShadow: "0 0 10px rgba(217,119,6,0.48)",
};

const RING_MONO: RingPalette = {
  tail: "#a1a1aa",
  head: "#52525b",
  inner: "#71717a",
  core: "radial-gradient(circle at 34% 28%, #fafafa 0%, #a1a1aa 48%, #3f3f46 100%)",
  coreShadow: "0 0 8px rgba(63,63,70,0.42)",
};

export const ORB_RING_BY_STATE: Record<AiOrbState, RingPalette> = {
  idle: RING_MONO,
  thinking: RING_SIGNAL,
  listening: RING_LISTENING,
  speaking: RING_EMERALD,
};

export const ORB_RING_BY_TONE: Record<Exclude<AiOrbTone, "auto">, RingPalette> = {
  signal: RING_SIGNAL,
  emerald: RING_EMERALD,
  amber: RING_AMBER,
  mono: RING_MONO,
};

export const ORB_STATUS_DOT_CLASS: Record<AiOrbState, string> = {
  idle: "bg-muted-foreground/50",
  thinking: "bg-signal",
  listening: "bg-sky-500 dark:bg-sky-400",
  speaking: "bg-emerald-600 dark:bg-emerald-400",
};

export const ORB_AURORA_MOTION: Record<
  AiOrbState,
  { scale: number[]; beat: number; drift: number; spin: number }
> = {
  idle: { scale: [1, 1.015, 1], beat: 5.4, drift: 9.2, spin: 14 },
  thinking: { scale: [1, 1.032, 1], beat: 3.2, drift: 5.2, spin: 4.2 },
  listening: { scale: [1, 1.045, 1], beat: 2.5, drift: 4.4, spin: 5.2 },
  speaking: { scale: [1, 1.06, 1], beat: 1.8, drift: 3.4, spin: 3.1 },
};

export const ORB_LATTICE_CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

export const resolveAuroraPalette = (state: AiOrbState, tone: AiOrbTone): AuroraPalette =>
  tone === "auto" ? ORB_AURORA_BY_STATE[state] : ORB_AURORA_BY_TONE[tone];

export const resolveLatticePalette = (state: AiOrbState, tone: AiOrbTone): LatticePalette =>
  tone === "auto" ? ORB_LATTICE_BY_STATE[state] : ORB_LATTICE_BY_TONE[tone];

export const resolveRingPalette = (state: AiOrbState, tone: AiOrbTone): RingPalette =>
  tone === "auto" ? ORB_RING_BY_STATE[state] : ORB_RING_BY_TONE[tone];
export type AiOrbState = "idle" | "thinking" | "listening" | "speaking";
export type AiOrbVariant = "aurora" | "lattice" | "ring";
export type AiOrbSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AiOrbTone = "auto" | "signal" | "emerald" | "amber" | "mono";

export interface AiOrbProps {
  /** 智能体当前状态 */
  state?: AiOrbState;
  /** 视觉形态：流光球体（aurora）、3x3 像素点阵（lattice）或轨道光环（ring） */
  variant?: AiOrbVariant;
  /** 尺寸规格 */
  size?: AiOrbSize;
  /** 色彩基调：auto 随状态自动映射，也可指定固定语义色调 */
  tone?: AiOrbTone;
  /** 是否包裹在触感状态胶囊中 */
  pill?: boolean;
  /** 状态文案（默认按 state 自动匹配） */
  label?: string;
  /** 胶囊模式下的右侧元信息徽标（如模型名或耗时） */
  badge?: string;
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}
interface OrbCoreProps {
  state: AiOrbState;
  size: AiOrbSize;
  tone: AiOrbTone;
  reduced: boolean | null;
}

const LATTICE_SPEED: Record<AiOrbState, number> = {
  idle: 2.4,
  thinking: 1.15,
  listening: 1.5,
  speaking: 0.85,
};

const LATTICE_STATIC_OPACITY = [0.96, 0.48, 0.2] as const;
const LATTICE_PULSE_OPACITY = [
  [0.58, 1, 0.58],
  [0.24, 0.86, 0.24],
  [0.12, 0.56, 0.12],
] as const;

const latticeTier = (idx: number): 0 | 1 | 2 => {
  if (idx === 4) return 0;
  return idx % 2 === 1 ? 1 : 2;
};

const latticeDelay = (state: AiOrbState, idx: number): number => {
  const row = Math.floor(idx / 3);
  const col = idx % 3;
  if (state === "listening") return latticeTier(idx) * 0.22;
  if (state === "speaking") return Math.abs(col - 1) * 0.16 + row * 0.08;
  return (row + col) * 0.12;
};

const latticeGlow = (tier: 0 | 1 | 2, palette: LatticePalette): string => {
  if (tier === 0) return palette.centerGlow;
  return tier === 1 ? palette.edgeGlow : palette.cornerGlow;
};

const LatticeOrb = ({ state, size, tone, reduced }: OrbCoreProps) => {
  const palette = resolveLatticePalette(state, tone);
  const active = !reduced && state !== "idle";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-grid shrink-0 grid-cols-3 place-items-center overflow-hidden rounded-[26%] border border-solid border-neutral-800/90 bg-neutral-950 ring-1 ring-inset ring-white/15 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6),0_4px_12px_-4px_rgba(0,0,0,0.2)] dark:border-white/15",
        ORB_LATTICE_PADDING[size],
        ORB_SIZE_CLASS[size],
      )}
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.09)_0%,transparent_44%)]" />
      {ORB_LATTICE_CELLS.map((idx) => {
        const tier = latticeTier(idx);
        return (
          <motion.span
            key={idx}
            animate={
              active
                ? { opacity: [...LATTICE_PULSE_OPACITY[tier]], scale: [0.88, 1.1, 0.88] }
                : { opacity: LATTICE_STATIC_OPACITY[tier], scale: 1 }
            }
            transition={{
              duration: LATTICE_SPEED[state],
              repeat: Number.POSITIVE_INFINITY,
              delay: latticeDelay(state, idx),
              ease: "easeInOut",
            }}
            style={{ boxShadow: latticeGlow(tier, palette) }}
            className={cn("relative rounded-full", palette.dotClass, ORB_LATTICE_DOT_SIZE[size])}
          />
        );
      })}
    </span>
  );
};

const RingDialBase = () => (
  <svg viewBox="0 0 48 48" fill="none" className="absolute inset-0 size-full">
    <circle
      cx="24"
      cy="24"
      r="20.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeDasharray="1.2 4.167"
      className="text-foreground/22 dark:text-white/22"
    />
    <circle
      cx="24"
      cy="24"
      r="14.2"
      stroke="currentColor"
      strokeWidth="0.85"
      className="text-foreground/12 dark:text-white/12"
    />
    <path
      d="M24 1.8V4.2M24 43.8V46.2M1.8 24H4.2M43.8 24H46.2"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className="text-foreground/28 dark:text-white/28"
    />
  </svg>
);

interface RingArcProps {
  uid: string;
  palette: RingPalette;
  spin: number;
  active: boolean;
}

const RingOuterArc = ({ uid, palette, spin, active }: RingArcProps) => (
  <motion.svg
    viewBox="0 0 48 48"
    fill="none"
    animate={active ? { rotate: 360 } : { rotate: -30 }}
    transition={{ duration: spin, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    className="absolute inset-0 size-full"
  >
    <defs>
      <linearGradient id={`${uid}-outer`} x1="95%" y1="45%" x2="36%" y2="100%">
        <stop offset="0%" stopColor={palette.tail} stopOpacity="0" />
        <stop offset="55%" stopColor={palette.tail} stopOpacity="0.88" />
        <stop offset="100%" stopColor={palette.head} stopOpacity="1" />
      </linearGradient>
    </defs>
    <circle
      cx="24"
      cy="24"
      r="20.5"
      stroke={`url(#${uid}-outer)`}
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeDasharray="36 93"
    />
    <circle cx="20.2" cy="44.15" r="1.75" fill={palette.head} />
  </motion.svg>
);

const RingInnerArc = ({ uid, palette, spin, active }: RingArcProps) => (
  <motion.svg
    viewBox="0 0 48 48"
    fill="none"
    animate={active ? { rotate: -360 } : { rotate: 24 }}
    transition={{ duration: spin * 1.65, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    className="absolute inset-0 size-full"
  >
    <defs>
      <linearGradient id={`${uid}-inner`} x1="100%" y1="50%" x2="40%" y2="95%">
        <stop offset="0%" stopColor={palette.inner} stopOpacity="0" />
        <stop offset="100%" stopColor={palette.inner} stopOpacity="0.85" />
      </linearGradient>
    </defs>
    <circle
      cx="24"
      cy="24"
      r="14.2"
      stroke={`url(#${uid}-inner)`}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeDasharray="24 66"
    />
  </motion.svg>
);

const RingOrb = ({ state, size, tone, reduced }: OrbCoreProps) => {
  const uid = useId();
  const cfg = ORB_AURORA_MOTION[state];
  const palette = resolveRingPalette(state, tone);
  const active = !reduced && state !== "idle";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-muted/55 ring-1 ring-inset ring-black/6 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] dark:bg-white/[0.04] dark:ring-white/10",
        ORB_SIZE_CLASS[size],
      )}
    >
      <RingDialBase />
      <RingOuterArc uid={uid} palette={palette} spin={cfg.spin} active={active} />
      <RingInnerArc uid={uid} palette={palette} spin={cfg.spin} active={active} />
      <motion.span
        animate={
          active
            ? { scale: [0.92, 1.12, 0.92], opacity: [0.82, 1, 0.82] }
            : { scale: 1, opacity: 0.9 }
        }
        transition={{ duration: cfg.beat, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{ background: palette.core, boxShadow: palette.coreShadow }}
        className="relative size-[27%] rounded-full ring-1 ring-inset ring-white/45"
      />
    </span>
  );
};

const CLOUD_A_ACTIVE = {
  x: ["-14%", "16%", "-14%"],
  y: ["-10%", "14%", "-10%"],
  rotate: [0, 360],
  scale: [1, 1.15, 1],
};
const CLOUD_A_IDLE = { x: "-10%", y: "8%", rotate: 0, scale: 1.04 };
const CLOUD_B_ACTIVE = {
  x: ["16%", "-15%", "16%"],
  y: ["14%", "-14%", "14%"],
  rotate: [360, 0],
  scale: [1.08, 0.94, 1.08],
};
const CLOUD_B_IDLE = { x: "12%", y: "-10%", rotate: 0, scale: 1.02 };
const CLOUD_C_ACTIVE = {
  x: ["-10%", "12%", "-10%"],
  y: ["-12%", "10%", "-12%"],
  scale: [0.96, 1.1, 0.96],
};
const CLOUD_C_IDLE = { x: "-12%", y: "-14%", scale: 1 };

const AuroraClouds = ({
  palette,
  drift,
  active,
}: {
  palette: AuroraPalette;
  drift: number;
  active: boolean;
}) => (
  <>
    <motion.span
      animate={active ? CLOUD_A_ACTIVE : CLOUD_A_IDLE}
      transition={{ duration: drift * 1.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      style={{ background: palette.cloudA }}
      className="pointer-events-none absolute -inset-[30%] rounded-full blur-[7px]"
    />
    <motion.span
      animate={active ? CLOUD_B_ACTIVE : CLOUD_B_IDLE}
      transition={{ duration: drift * 1.15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      style={{ background: palette.cloudB }}
      className="pointer-events-none absolute -inset-[28%] rounded-full blur-[6px] mix-blend-screen"
    />
    <motion.span
      animate={active ? CLOUD_C_ACTIVE : CLOUD_C_IDLE}
      transition={{ duration: drift * 0.95, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      style={{ background: palette.cloudC }}
      className="pointer-events-none absolute -inset-[20%] rounded-full opacity-85 blur-[5px]"
    />
  </>
);

const AuroraOrb = ({ state, size, tone, reduced }: OrbCoreProps) => {
  const cfg = ORB_AURORA_MOTION[state];
  const palette = resolveAuroraPalette(state, tone);
  const active = !reduced && state !== "idle";
  const compact = size === "xs" || size === "sm";

  return (
    <motion.span
      aria-hidden="true"
      animate={reduced ? { scale: 1 } : { scale: cfg.scale }}
      transition={{ duration: cfg.beat, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      style={{ background: palette.base, boxShadow: compact ? palette.shadowSm : palette.shadow }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        ORB_SIZE_CLASS[size],
      )}
    >
      <AuroraClouds palette={palette} drift={cfg.drift} active={active} />
      <span
        style={{ background: palette.bounce }}
        className="pointer-events-none absolute inset-0 rounded-full"
      />
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(ellipse_66%_40%_at_34%_18%,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0.2)_46%,transparent_72%)]" />
      <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_-6px_14px_rgba(0,0,0,0.34),inset_0_2px_5px_rgba(255,255,255,0.42)] ring-1 ring-inset ring-white/40" />
    </motion.span>
  );
};
const OrbCore = ({
  variant,
  state,
  size,
  tone,
  reduced,
}: OrbCoreProps & { variant: AiOrbVariant }) => {
  if (variant === "lattice") {
    return <LatticeOrb state={state} size={size} tone={tone} reduced={reduced} />;
  }
  if (variant === "ring") {
    return <RingOrb state={state} size={size} tone={tone} reduced={reduced} />;
  }
  return <AuroraOrb state={state} size={size} tone={tone} reduced={reduced} />;
};

const OrbPillButton = ({
  state,
  variant,
  displayLabel,
  badge,
  onClick,
  className,
  core,
}: {
  state: AiOrbState;
  variant: AiOrbVariant;
  displayLabel: string;
  badge?: string;
  onClick?: () => void;
  className?: string;
  core: ReactNode;
}) => (
  <button
    type="button"
    data-slot="ai-orb"
    data-state={state}
    data-variant={variant}
    onClick={onClick}
    className={cn(
      "inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-solid border-border/90 bg-card/95 py-1.5 pr-3.5 pl-1.5 font-sans text-xs font-medium text-foreground shadow-[0_2px_8px_-4px_rgba(15,23,42,0.16)] backdrop-blur-sm transition-all hover:border-foreground/20 hover:bg-card active:scale-[0.985] dark:border-white/12 dark:bg-neutral-900/90 dark:hover:border-white/22",
      ORB_FOCUS_RING,
      className,
    )}
  >
    {core}
    <span className="tracking-tight">{displayLabel}</span>
    {badge ? (
      <span className="rounded-full border border-solid border-border/70 bg-muted/75 px-2 py-0.5 font-mono text-[10px] font-medium tracking-tight text-muted-foreground dark:border-white/10 dark:bg-white/[0.06]">
        {badge}
      </span>
    ) : (
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", ORB_STATUS_DOT_CLASS[state])}
      />
    )}
  </button>
);

const resolveOrbDefaults = (props: AiOrbProps) => ({
  state: props.state ?? "thinking",
  variant: props.variant ?? "aurora",
  size: props.size ?? "md",
  tone: props.tone ?? "auto",
  pill: props.pill ?? false,
});

export const AiOrb = (props: AiOrbProps) => {
  const cfg = resolveOrbDefaults(props);
  const reduced = useReducedMotion();
  const displayLabel = props.label ?? ORB_STATE_LABEL[cfg.state];
  const core = (
    <OrbCore
      variant={cfg.variant}
      state={cfg.state}
      size={cfg.pill ? "sm" : cfg.size}
      tone={cfg.tone}
      reduced={reduced}
    />
  );

  if (cfg.pill || props.onClick) {
    return (
      <OrbPillButton
        state={cfg.state}
        variant={cfg.variant}
        displayLabel={displayLabel}
        badge={props.badge}
        onClick={props.onClick}
        className={props.className}
        core={core}
      />
    );
  }

  return (
    <output
      aria-label={displayLabel}
      data-slot="ai-orb"
      data-state={cfg.state}
      data-variant={cfg.variant}
      className={cn("inline-flex items-center gap-3", props.className)}
    >
      {core}
      {props.label && (
        <span className="text-xs font-medium tracking-tight text-foreground">{props.label}</span>
      )}
    </output>
  );
};
