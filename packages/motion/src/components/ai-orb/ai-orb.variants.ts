/**
 * AiOrb 的光学材质配色与动效参数映射表（纯静态 Tailwind 字面量，无 CVA 依赖）。
 */
import type { AiOrbSize, AiOrbState, AiOrbTone } from "./ai-orb.types.js";

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
  base: "radial-gradient(circle at 34% 26%, #f0f9ff 0%, #38bdf8 26%, #155dfc 60%, #1e3a8a 88%, #0f172a 100%)",
  cloudA:
    "radial-gradient(circle at 44% 48%, rgba(29,78,216,0.92) 0%, rgba(30,58,138,0.58) 50%, transparent 72%)",
  cloudB:
    "radial-gradient(circle at 58% 40%, rgba(56,189,248,0.92) 0%, rgba(125,211,252,0.46) 46%, transparent 72%)",
  cloudC:
    "radial-gradient(circle at 50% 50%, rgba(240,249,255,0.94) 0%, rgba(186,230,253,0.42) 44%, transparent 68%)",
  bounce: "radial-gradient(ellipse 72% 36% at 54% 92%, rgba(125,211,252,0.58) 0%, transparent 70%)",
  shadow: "0 12px 28px -8px rgba(21,93,252,0.46), 0 3px 10px -3px rgba(15,23,42,0.28)",
  shadowSm: "0 3px 9px -2px rgba(21,93,252,0.42)",
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
  dotClass: "bg-sky-300",
  centerGlow: "0 0 8px rgba(56,189,248,0.9), 0 0 2px rgba(240,249,255,0.95)",
  edgeGlow: "0 0 5px rgba(56,189,248,0.58)",
  cornerGlow: "0 0 3px rgba(56,189,248,0.28)",
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
  tail: "#38bdf8",
  head: "#155dfc",
  inner: "#60a5fa",
  core: "radial-gradient(circle at 34% 28%, #f0f9ff 0%, #38bdf8 46%, #155dfc 100%)",
  coreShadow: "0 0 10px rgba(21,93,252,0.5)",
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
