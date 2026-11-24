// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * ThinkingOrb：3D 光学水晶星尘思考球，支持 9 种 AI 认知态平滑形变、精密刻度玻璃表圈、双环氛围光晕与微光状态胶囊。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type CSSProperties, useEffect, useRef, useState } from "react";

export const THINKING_ORB_STATE_LABELS: Record<ThinkingOrbState, string> = {
  working: "处理中",
  searching: "检索中",
  solving: "求解中",
  listening: "聆听中",
  connecting: "连接中",
  weaving: "编织上下文",
  composing: "组织回答",
  breathing: "静候待命",
  shaping: "构思塑形",
};

export interface OrbThemeAccent {
  dot: string;
  glow: string;
  haloTint: string;
}

/** 各认知态的光学主题色（用于外环微光与状态胶囊脉冲点平滑呼应） */
export const ORB_STATE_ACCENTS: Record<ThinkingOrbState, OrbThemeAccent> = {
  working: { dot: "#7a5ee4", glow: "rgba(122,94,228,0.45)", haloTint: "rgba(122,94,228,0.16)" },
  searching: { dot: "#0ea5e9", glow: "rgba(14,165,233,0.45)", haloTint: "rgba(14,165,233,0.16)" },
  solving: { dot: "#6366f1", glow: "rgba(99,102,241,0.48)", haloTint: "rgba(99,102,241,0.18)" },
  listening: { dot: "#06b6d4", glow: "rgba(6,182,212,0.44)", haloTint: "rgba(6,182,212,0.16)" },
  connecting: { dot: "#818cf8", glow: "rgba(56,189,248,0.46)", haloTint: "rgba(129,140,248,0.17)" },
  weaving: { dot: "#c026d3", glow: "rgba(192,38,211,0.44)", haloTint: "rgba(168,85,247,0.17)" },
  composing: { dot: "#f59e0b", glow: "rgba(245,158,11,0.44)", haloTint: "rgba(245,158,11,0.16)" },
  breathing: { dot: "#8b73f2", glow: "rgba(139,115,242,0.36)", haloTint: "rgba(139,115,242,0.12)" },
  shaping: { dot: "#10b981", glow: "rgba(16,185,129,0.44)", haloTint: "rgba(16,185,129,0.16)" },
};

export const thinkingOrbFrameVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center rounded-full transition-[transform,box-shadow,border-color] duration-(--ui-duration-fast)",
  {
    variants: {
      variant: {
        minimal: "",
        framed:
          "border border-solid border-foreground/12 bg-gradient-to-b from-card via-card/95 to-muted/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(19,20,24,0.05),0_2px_6px_-2px_rgba(19,20,24,0.08),0_10px_24px_-12px_rgba(19,20,24,0.18)] dark:border-white/14 dark:from-white/[0.08] dark:via-card/90 dark:to-black/40 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_-1px_2px_rgba(0,0,0,0.45),0_12px_28px_-12px_rgba(0,0,0,0.72)]",
        halo: "border border-solid border-foreground/12 bg-gradient-to-b from-card/95 via-card/85 to-muted/65 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_0_0_4px_color-mix(in_oklab,var(--ui-foreground)_3%,transparent),0_14px_34px_-14px_rgba(19,20,24,0.22)] backdrop-blur-md dark:border-white/16 dark:from-white/[0.09] dark:via-card/80 dark:to-black/45 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_0_0_4px_rgba(255,255,255,0.045),0_16px_38px_-14px_rgba(0,0,0,0.78)]",
      },
      interactive: {
        true: "cursor-pointer hover:scale-[1.03] hover:border-foreground/22 active:scale-[0.99] dark:hover:border-white/26",
        false: "",
      },
    },
    defaultVariants: {
      variant: "minimal",
      interactive: false,
    },
  },
);

export const thinkingOrbRootVariants = cva("inline-flex shrink-0 items-center justify-center", {
  variants: {
    hasLabel: {
      true: "",
      false: "relative",
    },
    placement: {
      bottom: "flex-col gap-3",
      right: "flex-row gap-2.5",
    },
  },
  defaultVariants: {
    hasLabel: false,
    placement: "bottom",
  },
});

export const thinkingOrbLabelVariants = cva(
  "inline-flex items-center gap-2 font-sans text-xs font-medium tracking-tight text-foreground/85",
  {
    variants: {
      placement: {
        bottom:
          "rounded-full border border-solid border-border bg-card/90 px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_2px_8px_-4px_rgba(19,20,24,0.12)] backdrop-blur-sm dark:border-white/12 dark:bg-card/80 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_-4px_rgba(0,0,0,0.5)]",
        right: "text-foreground/90",
      },
    },
    defaultVariants: {
      placement: "bottom",
    },
  },
);
/** ThinkingOrb 支持的 9 种智能体认知状态 */
export type ThinkingOrbState =
  | "working"
  | "searching"
  | "solving"
  | "listening"
  | "connecting"
  | "weaving"
  | "composing"
  | "breathing"
  | "shaping";

/** ThinkingOrb 外观变体：极简无框、毛玻璃表圈、环境光晕 */
export type ThinkingOrbVariant = "minimal" | "framed" | "halo";

/** 认知状态文字标签相对球体的位置 */
export type ThinkingOrbLabelPlacement = "bottom" | "right";

export interface ThinkingOrbProps {
  /** 智能体当前认知状态预设，默认 "working" */
  state?: ThinkingOrbState;
  /** 外观风格：minimal 无框纯粒子、framed 玻璃表圈、halo 柔光氛围环，默认 "minimal" */
  variant?: ThinkingOrbVariant;
  /** 球体直径（像素），默认 64 */
  size?: number;
  /** 动效速率倍率，默认 1 */
  speed?: number;
  /** 强制指定明暗极性（true 为深底亮粒，false 为浅底墨粒）；省略时自动跟随页面主题 */
  dark?: boolean;
  /** 暂停当前轨道动画（保留粒子当前坐标） */
  paused?: boolean;
  /** 是否显示当前认知状态说明胶囊，默认 false */
  showLabel?: boolean;
  /** 自定义状态展示文案；传入时会自动展示状态说明 */
  label?: string;
  /** 状态说明的排布方位，默认 "bottom" */
  labelPlacement?: ThinkingOrbLabelPlacement;
  /** 是否启用轻微悬浮反馈（适合语音/助手触发器），默认 false */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}
type RgbTuple = [number, number, number];

interface OrbStateConfig {
  energy: number;
  rotation: number;
  tiltX: number;
  tiltZ: number;
  pulseFreq: number;
  pulseAmp: number;
  compression: number;
  turbulence: number;
  coreGlow: number;
  ringCount: number;
  ringOpacity: number;
  ringSpeed: number;
  scanStrength: number;
  rippleStrength: number;
  streamStrength: number;
  braidStrength: number;
  bandStrength: number;
  sculptStrength: number;
  ribbonStrength: number;
  deepRgb: RgbTuple;
  primaryRgb: RgbTuple;
  secondaryRgb: RgbTuple;
  accentRgb: RgbTuple;
}

const BASE_CONFIG = {
  energy: 0.96,
  rotation: 0.48,
  tiltX: 0.38,
  tiltZ: -0.18,
  pulseFreq: 1.05,
  pulseAmp: 0.028,
  compression: 0.96,
  turbulence: 0.16,
  coreGlow: 0.94,
  ringCount: 1,
  ringOpacity: 0.56,
  ringSpeed: 0.62,
  scanStrength: 0,
  rippleStrength: 0,
  streamStrength: 0.34,
  braidStrength: 0,
  bandStrength: 0,
  sculptStrength: 0,
  ribbonStrength: 0.85,
};

const makeState = (
  palette: [RgbTuple, RgbTuple, RgbTuple, RgbTuple],
  overrides: Partial<OrbStateConfig> = {},
): OrbStateConfig => ({
  ...BASE_CONFIG,
  deepRgb: palette[0],
  primaryRgb: palette[1],
  secondaryRgb: palette[2],
  accentRgb: palette[3],
  ...overrides,
});

const ORB_STATE_CONFIGS: Record<ThinkingOrbState, OrbStateConfig> = {
  working: makeState(
    [
      [20, 15, 48],
      [122, 94, 228],
      [96, 165, 250],
      [224, 215, 255],
    ],
    { braidStrength: 0.18 },
  ),
  searching: makeState(
    [
      [10, 24, 48],
      [14, 165, 233],
      [56, 189, 248],
      [207, 250, 254],
    ],
    {
      energy: 1.08,
      rotation: 0.72,
      tiltX: 0.44,
      tiltZ: 0.14,
      compression: 0.98,
      ringOpacity: 0.48,
      ringSpeed: 0.92,
      scanStrength: 1,
      streamStrength: 0.4,
      ribbonStrength: 0.62,
    },
  ),
  solving: makeState(
    [
      [22, 16, 56],
      [99, 102, 241],
      [168, 85, 247],
      [233, 213, 255],
    ],
    {
      energy: 1.22,
      rotation: 1.05,
      tiltX: 0.48,
      tiltZ: -0.26,
      pulseFreq: 1.55,
      pulseAmp: 0.036,
      compression: 0.88,
      turbulence: 0.24,
      coreGlow: 1.15,
      ringCount: 2,
      ringOpacity: 0.74,
      ringSpeed: 1.32,
      streamStrength: 1,
      braidStrength: 0.25,
      sculptStrength: 0.18,
      ribbonStrength: 1.08,
    },
  ),
  listening: makeState(
    [
      [8, 30, 42],
      [6, 182, 212],
      [20, 184, 166],
      [204, 251, 241],
    ],
    {
      energy: 0.86,
      rotation: 0.22,
      tiltX: 0.28,
      tiltZ: 0.06,
      pulseFreq: 1.2,
      pulseAmp: 0.04,
      compression: 0.92,
      turbulence: 0.08,
      ringCount: 0,
      ringOpacity: 0,
      rippleStrength: 1,
      streamStrength: 0.1,
      ribbonStrength: 0.58,
    },
  ),
  connecting: makeState(
    [
      [15, 20, 52],
      [129, 140, 248],
      [34, 211, 238],
      [224, 242, 254],
    ],
    {
      energy: 1.1,
      rotation: 0.92,
      tiltX: 0.52,
      tiltZ: 0.28,
      ringCount: 2,
      ringOpacity: 0.68,
      ringSpeed: 1.1,
      rippleStrength: 0.28,
      streamStrength: 1,
      braidStrength: 0.14,
      bandStrength: 0.28,
      ribbonStrength: 0.92,
    },
  ),
  weaving: makeState(
    [
      [34, 14, 46],
      [168, 85, 247],
      [236, 72, 153],
      [252, 231, 243],
    ],
    {
      energy: 1.06,
      rotation: 0.54,
      tiltX: 0.44,
      tiltZ: -0.22,
      turbulence: 0.22,
      ringCount: 2,
      ringOpacity: 0.54,
      ringSpeed: 0.72,
      streamStrength: 0.5,
      braidStrength: 1,
      sculptStrength: 0.22,
      ribbonStrength: 1.15,
    },
  ),
  composing: makeState(
    [
      [40, 22, 12],
      [245, 158, 11],
      [251, 113, 133],
      [254, 243, 199],
    ],
    {
      energy: 0.98,
      rotation: 0.36,
      tiltX: 0.32,
      tiltZ: 0.14,
      compression: 0.92,
      turbulence: 0.1,
      ringOpacity: 0.52,
      ringSpeed: 0.54,
      braidStrength: 0.2,
      bandStrength: 1,
      ribbonStrength: 0.88,
    },
  ),
  breathing: makeState(
    [
      [22, 24, 42],
      [129, 140, 248],
      [148, 163, 184],
      [238, 242, 255],
    ],
    {
      energy: 0.74,
      rotation: 0.14,
      tiltX: 0.24,
      tiltZ: -0.08,
      pulseFreq: 0.65,
      pulseAmp: 0.064,
      compression: 1,
      turbulence: 0.05,
      coreGlow: 0.78,
      ringCount: 0,
      ringOpacity: 0,
      rippleStrength: 0.42,
      streamStrength: 0,
      ribbonStrength: 0.45,
    },
  ),
  shaping: makeState(
    [
      [10, 34, 34],
      [16, 185, 129],
      [56, 189, 248],
      [209, 250, 229],
    ],
    {
      energy: 1.06,
      rotation: 0.52,
      tiltX: 0.4,
      tiltZ: 0.2,
      turbulence: 0.2,
      ringOpacity: 0.54,
      ringSpeed: 0.68,
      streamStrength: 0.42,
      braidStrength: 0.32,
      sculptStrength: 1,
      ribbonStrength: 1.05,
    },
  ),
};

const rgbCss = (rgb: RgbTuple, alpha: number): string =>
  `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${alpha})`;

const cloneOrbConfig = (state: ThinkingOrbState): OrbStateConfig => {
  const src = ORB_STATE_CONFIGS[state] ?? ORB_STATE_CONFIGS.working;
  return {
    ...src,
    deepRgb: [...src.deepRgb],
    primaryRgb: [...src.primaryRgb],
    secondaryRgb: [...src.secondaryRgb],
    accentRgb: [...src.accentRgb],
  };
};

const lerpRgb = (cur: RgbTuple, dst: RgbTuple, f: number): void => {
  cur[0] += (dst[0] - cur[0]) * f;
  cur[1] += (dst[1] - cur[1]) * f;
  cur[2] += (dst[2] - cur[2]) * f;
};

const SCALAR_KEYS: readonly (keyof typeof BASE_CONFIG)[] = [
  "energy",
  "rotation",
  "tiltX",
  "tiltZ",
  "pulseFreq",
  "pulseAmp",
  "compression",
  "turbulence",
  "coreGlow",
  "ringOpacity",
  "ringSpeed",
  "scanStrength",
  "rippleStrength",
  "streamStrength",
  "braidStrength",
  "bandStrength",
  "sculptStrength",
  "ribbonStrength",
];

const lerpOrbConfig = (current: OrbStateConfig, target: OrbStateConfig, factor: number): void => {
  for (const key of SCALAR_KEYS) {
    current[key] += (target[key] - current[key]) * factor;
  }
  current.ringCount = target.ringCount;
  lerpRgb(current.deepRgb, target.deepRgb, factor);
  lerpRgb(current.primaryRgb, target.primaryRgb, factor);
  lerpRgb(current.secondaryRgb, target.secondaryRgb, factor);
  lerpRgb(current.accentRgb, target.accentRgb, factor);
};
interface OrbParticle {
  theta: number;
  phi: number;
  shell: number;
  speed: number;
  size: number;
  phase: number;
  tier: number;
  bandDir: number;
}

interface ProjectedParticle {
  x: number;
  y: number;
  z: number;
  prevX: number;
  prevY: number;
  hasTrail: boolean;
  depth: number;
  light: number;
  boost: number;
  size: number;
  tier: number;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const seededUnit = (index: number, salt: number): number => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

/** 随画布直径自适应计算球腔内星尘数量 */
const orbParticleCountForSize = (size: number): number => {
  if (size <= 28) return 52;
  if (size <= 52) return 110;
  if (size <= 88) return 190;
  if (size <= 128) return 260;
  return 320;
};

/** 生成双层球腔星尘：悬浮于水晶球体内部，层次清晰不溢边 */
const createOrbParticles = (count: number): OrbParticle[] =>
  Array.from({ length: count }, (_, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const innerCore = seededUnit(i, 6) < 0.24;
    const shell = innerCore ? 0.34 + seededUnit(i, 1) * 0.36 : 0.72 + seededUnit(i, 1) * 0.2;
    const tier = seededUnit(i, 5);
    const size = tier > 0.86 ? 0.92 + seededUnit(i, 3) * 0.42 : 0.38 + seededUnit(i, 3) * 0.38;
    return {
      phi,
      theta,
      shell,
      speed: 0.45 + seededUnit(i, 2) * 0.85,
      size,
      phase: seededUnit(i, 4) * Math.PI * 2,
      tier,
      bandDir: Math.cos(phi) >= 0 ? 1 : -1,
    };
  });

/** 将球面坐标施加 3D 俯仰角与缓慢进动旋转 */
const rotateOrbPoint = (v: Vec3, tiltX: number, tiltZ: number): Vec3 => {
  const cosX = Math.cos(tiltX);
  const sinX = Math.sin(tiltX);
  const y1 = v.y * cosX - v.z * sinX;
  const z1 = v.y * sinX + v.z * cosX;

  const cosZ = Math.cos(tiltZ);
  const sinZ = Math.sin(tiltZ);
  return {
    x: v.x * cosZ - y1 * sinZ,
    y: v.x * sinZ + y1 * cosZ,
    z: z1,
  };
};

const evaluateParticle3D = (
  p: OrbParticle,
  cfg: OrbStateConfig,
  t: number,
  breathing: number,
  scanPhi: number,
): { pos: Vec3; boost: number } => {
  const streamSpin = cfg.streamStrength * p.bandDir * (0.48 + p.speed * 0.35);
  let theta = p.theta + t * (cfg.rotation * (0.72 + p.tier * 0.38) + streamSpin);
  let phi = p.phi;

  if (cfg.braidStrength > 0.01) {
    theta += Math.sin(phi * 5 + t * 1.45) * 0.26 * cfg.braidStrength;
    phi += Math.cos(theta * 3 - t * 1.1) * 0.14 * cfg.braidStrength;
  }

  if (cfg.bandStrength > 0.01) {
    const bandStep = Math.PI / 5;
    const nearestBand = Math.round(phi / bandStep) * bandStep;
    phi += (nearestBand - phi) * 0.42 * cfg.bandStrength;
  }

  const wave = Math.sin(theta * 3 + t * (1.1 + cfg.energy * 0.6)) * Math.cos(phi * 3 - t * 0.55);
  let r = p.shell * breathing * cfg.compression * (1 + wave * cfg.turbulence * 0.14);

  if (cfg.sculptStrength > 0.01) {
    const harmonic =
      Math.sin(theta * 3 + t * 1.05) * Math.sin(phi * 2) * 0.14 +
      Math.cos(phi * 3 - t * 0.85) * 0.08;
    r *= 1 + harmonic * cfg.sculptStrength;
  }

  let boost = 0;
  if (cfg.scanStrength > 0.01) {
    const dist = phi - scanPhi;
    boost = Math.exp(-(dist * dist) / 0.06) * cfg.scanStrength;
    r *= 1 + boost * 0.07;
  }

  const sinPhi = Math.sin(phi);
  const raw: Vec3 = {
    x: sinPhi * Math.cos(theta) * r,
    y: Math.cos(phi) * r,
    z: sinPhi * Math.sin(theta) * r,
  };
  const liveTiltZ = cfg.tiltZ + Math.sin(t * 0.38) * 0.055;
  return { pos: rotateOrbPoint(raw, cfg.tiltX, liveTiltZ), boost };
};

const toScreen = (pos: Vec3, center: number, radius: number) => {
  const fov = 2.8;
  const persp = fov / (fov - pos.z);
  return {
    x: center + pos.x * radius * persp,
    y: center + pos.y * radius * persp,
    persp,
  };
};

/** 批量计算星尘 3D 透视投影、球面光照、真实切线拖尾，并按深度从远到近排序 */
const projectOrbParticles = (
  particles: OrbParticle[],
  cfg: OrbStateConfig,
  opts: { size: number; radius: number; time: number; scanPhi: number },
): ProjectedParticle[] => {
  const { size, radius, time, scanPhi } = opts;
  const center = size / 2;
  const breathing = 1 + Math.sin(time * cfg.pulseFreq * Math.PI) * cfg.pulseAmp;
  const canTrail = size >= 44 && cfg.streamStrength > 0.16;
  const trailDt = 0.038;

  const projected = particles.map((p): ProjectedParticle => {
    const { pos, boost } = evaluateParticle3D(p, cfg, time, breathing, scanPhi);
    const screen = toScreen(pos, center, radius);
    const hasTrail = canTrail && pos.z > 0.08 && p.tier > 0.66;
    let prevX = screen.x;
    let prevY = screen.y;
    if (hasTrail) {
      const prev = evaluateParticle3D(p, cfg, time - trailDt, breathing, scanPhi);
      const prevScreen = toScreen(prev.pos, center, radius);
      prevX = prevScreen.x;
      prevY = prevScreen.y;
    }

    const depth = Math.min(Math.max((pos.z + 1) / 2, 0), 1);
    const light = Math.min(Math.max((-pos.x * 0.42 - pos.y * 0.52 + pos.z * 0.72 + 1) * 0.5, 0), 1);
    return {
      x: screen.x,
      y: screen.y,
      z: pos.z,
      prevX,
      prevY,
      hasTrail,
      depth,
      light,
      boost,
      size: p.size * screen.persp,
      tier: p.tier,
    };
  });

  projected.sort((a, b) => a.z - b.z);
  return projected;
};
interface RingHalfOpts {
  size: number;
  radius: number;
  ringR: number;
  tiltX: number;
  tiltZ: number;
  spin: number;
  opacity: number;
  front: boolean;
  colorRgb: RgbTuple;
  accentRgb: RgbTuple;
}

const isSegmentInHalf = (zA: number, zB: number, front: boolean): boolean =>
  front ? zA >= 0 && zB >= 0 : zA < 0 && zB < 0;

const drawStarGlint = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  arm: number,
  alpha: number,
  colorRgb: RgbTuple,
) => {
  ctx.save();
  ctx.strokeStyle = rgbCss(colorRgb, alpha);
  ctx.lineWidth = Math.max(arm * 0.16, 0.55);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - arm, y);
  ctx.lineTo(x + arm, y);
  ctx.moveTo(x, y - arm);
  ctx.lineTo(x, y + arm);
  ctx.stroke();
  ctx.restore();
};

const drawOrbitalNode = (ctx: CanvasRenderingContext2D, opts: RingHalfOpts) => {
  if (!opts.front || opts.size < 40) return;
  const head = rotateOrbPoint(
    { x: Math.cos(opts.spin) * opts.ringR, y: 0, z: Math.sin(opts.spin) * opts.ringR },
    opts.tiltX,
    opts.tiltZ,
  );
  if (head.z < 0) return;
  const c = opts.size / 2;
  const persp = 2.8 / (2.8 - head.z);
  const hx = c + head.x * opts.radius * persp;
  const hy = c + head.y * opts.radius * persp;
  const r = Math.max(opts.size * 0.018, 1.3);

  const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 3.8);
  glow.addColorStop(0, rgbCss(opts.accentRgb, 0.95));
  glow.addColorStop(0.4, rgbCss(opts.colorRgb, 0.55));
  glow.addColorStop(1, rgbCss(opts.colorRgb, 0));
  ctx.beginPath();
  ctx.arc(hx, hy, r * 3.8, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();

  drawStarGlint(ctx, hx, hy, r * 2.8, 0.85, opts.accentRgb);
  ctx.beginPath();
  ctx.arc(hx, hy, r * 0.85, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
  ctx.fill();
};

const drawOrbitalRingHalf = (ctx: CanvasRenderingContext2D, opts: RingHalfOpts) => {
  if (opts.opacity <= 0.015) return;
  const { size, radius, ringR, tiltX, tiltZ, spin, opacity, front, colorRgb, accentRgb } = opts;
  const c = size / 2;
  const steps = 56;
  const baseW = Math.max(size * 0.009, 0.65);

  let prevX = 0;
  let prevY = 0;
  let prevZ = 0;

  for (let i = 0; i <= steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2 + spin;
    const pt = rotateOrbPoint(
      { x: Math.cos(angle) * ringR, y: 0, z: Math.sin(angle) * ringR },
      tiltX,
      tiltZ,
    );
    const persp = 2.8 / (2.8 - pt.z);
    const sx = c + pt.x * radius * persp;
    const sy = c + pt.y * radius * persp;

    if (i > 0 && isSegmentInHalf(pt.z, prevZ, front)) {
      const comet = Math.pow(0.5 + 0.5 * Math.cos(angle - spin), 2.1);
      const segAlpha = opacity * (front ? 0.16 + comet * 0.72 : 0.14 + comet * 0.2);
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(sx, sy);
      ctx.lineWidth = front ? baseW * (0.9 + comet * 1.1) : baseW * 0.75;
      ctx.strokeStyle =
        comet > 0.65 && front ? rgbCss(accentRgb, segAlpha) : rgbCss(colorRgb, segAlpha);
      ctx.stroke();
    }
    prevX = sx;
    prevY = sy;
    prevZ = pt.z;
  }

  drawOrbitalNode(ctx, opts);
};

const drawAcousticRipples = (
  ctx: CanvasRenderingContext2D,
  size: number,
  radius: number,
  t: number,
  cfg: OrbStateConfig,
) => {
  if (cfg.rippleStrength <= 0.02) return;
  const c = size / 2;
  for (let i = 0; i < 2; i += 1) {
    const progress = (t * 0.42 + i * 0.5) % 1;
    const rippleR = radius * (0.86 + progress * 0.34);
    const fade = Math.sin(progress * Math.PI) * (1 - progress * 0.35);

    ctx.beginPath();
    ctx.arc(c, c, rippleR, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(size * 0.022, 1.8);
    ctx.strokeStyle = rgbCss(cfg.primaryRgb, fade * 0.24 * cfg.rippleStrength);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(c, c, rippleR, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(size * 0.008, 0.75);
    ctx.strokeStyle = rgbCss(cfg.accentRgb, fade * 0.65 * cfg.rippleStrength);
    ctx.stroke();
  }
};

const drawOrbitalLayer = (
  ctx: CanvasRenderingContext2D,
  opts: { size: number; radius: number; t: number; cfg: OrbStateConfig; front: boolean },
) => {
  const { size, radius, t, cfg, front } = opts;
  if (cfg.ringOpacity <= 0.015 || size < 30) return;
  const liveTiltZ = cfg.tiltZ + Math.sin(t * 0.38) * 0.055;

  drawOrbitalRingHalf(ctx, {
    size,
    radius,
    ringR: 1.12,
    tiltX: cfg.tiltX + 0.34,
    tiltZ: liveTiltZ - 0.18,
    spin: t * cfg.ringSpeed,
    opacity: cfg.ringOpacity,
    front,
    colorRgb: cfg.primaryRgb,
    accentRgb: cfg.accentRgb,
  });

  if (cfg.ringCount >= 2) {
    drawOrbitalRingHalf(ctx, {
      size,
      radius,
      ringR: 1.17,
      tiltX: -cfg.tiltX - 0.42,
      tiltZ: -liveTiltZ + 0.5,
      spin: -t * cfg.ringSpeed * 0.84 + 1.6,
      opacity: cfg.ringOpacity * 0.82,
      front,
      colorRgb: cfg.secondaryRgb,
      accentRgb: cfg.accentRgb,
    });
  }
};

const drawScanningRing = (
  ctx: CanvasRenderingContext2D,
  opts: { size: number; radius: number; t: number; scanPhi: number; cfg: OrbStateConfig },
) => {
  const { size, radius, t, scanPhi, cfg } = opts;
  const sinPhi = Math.sin(scanPhi);
  if (cfg.scanStrength <= 0.02 || sinPhi < 0.08) return;

  const c = size / 2;
  const steps = 44;
  const liveTiltZ = cfg.tiltZ + Math.sin(t * 0.38) * 0.055;
  const ringR = sinPhi * 0.96;
  const yPlane = Math.cos(scanPhi) * 0.96;

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const a = (i / steps) * Math.PI * 2;
    const pt = rotateOrbPoint(
      { x: Math.cos(a) * ringR, y: yPlane, z: Math.sin(a) * ringR },
      cfg.tiltX,
      liveTiltZ,
    );
    const persp = 2.8 / (2.8 - pt.z);
    const sx = c + pt.x * radius * persp;
    const sy = c + pt.y * radius * persp;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.lineWidth = Math.max(size * 0.026, 2.2);
  ctx.strokeStyle = rgbCss(cfg.secondaryRgb, sinPhi * 0.32 * cfg.scanStrength);
  ctx.stroke();

  ctx.lineWidth = Math.max(size * 0.009, 0.8);
  ctx.strokeStyle = rgbCss(cfg.accentRgb, sinPhi * 0.85 * cfg.scanStrength);
  ctx.stroke();
};

const drawSingleSilkRibbon = (
  ctx: CanvasRenderingContext2D,
  opts: {
    size: number;
    radius: number;
    t: number;
    cfg: OrbStateConfig;
    index: number;
    rgb: RgbTuple;
  },
) => {
  const { size, radius, t, cfg, index, rgb } = opts;
  const c = size / 2;
  const steps = 54;
  const phase = index * ((Math.PI * 2) / 3);
  const amp = 0.62 + cfg.sculptStrength * 0.14;
  const freqA = 2 + (index % 2) + cfg.braidStrength * 1.4;
  const freqB = 3 + cfg.bandStrength * 1.2;
  const liveTiltZ = cfg.tiltZ + index * 0.42 + Math.sin(t * 0.35 + index) * 0.12;

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const u = (i / steps) * Math.PI * 2;
    const spin = u + t * (0.45 + cfg.rotation * 0.55) + phase;
    const wobble = Math.sin(u * freqA + t * 1.2 + phase) * 0.24;
    const raw = {
      x: Math.cos(spin) * (amp + wobble * 0.35),
      y: Math.sin(u * freqB - t * 0.9 + phase) * (0.34 + cfg.braidStrength * 0.22),
      z: Math.sin(spin) * (amp - wobble * 0.35),
    };
    const pt = rotateOrbPoint(raw, cfg.tiltX + index * 0.35, liveTiltZ);
    const persp = 2.8 / (2.8 - pt.z);
    const sx = c + pt.x * radius * persp;
    const sy = c + pt.y * radius * persp;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();

  const strength = Math.min(cfg.ribbonStrength, 1.2);
  ctx.lineWidth = Math.max(size * 0.048, 3.2);
  ctx.strokeStyle = rgbCss(rgb, 0.16 * strength);
  ctx.stroke();

  ctx.lineWidth = Math.max(size * 0.018, 1.3);
  ctx.strokeStyle = rgbCss(rgb, 0.38 * strength);
  ctx.stroke();

  ctx.lineWidth = Math.max(size * 0.006, 0.55);
  ctx.strokeStyle = rgbCss(cfg.accentRgb, 0.64 * strength);
  ctx.stroke();
};

/** 在球腔内绘制 3 条交织流动的 3D 丝绸光学流带 */
const drawSilkRibbons = (
  ctx: CanvasRenderingContext2D,
  opts: { size: number; radius: number; t: number; cfg: OrbStateConfig },
) => {
  if (opts.cfg.ribbonStrength <= 0.05) return;
  const colors: RgbTuple[] = [opts.cfg.primaryRgb, opts.cfg.secondaryRgb, opts.cfg.accentRgb];
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3; i += 1) {
    drawSingleSilkRibbon(ctx, { ...opts, index: i, rgb: colors[i]! });
  }
  ctx.restore();
};
const drawAmbientAura = (
  ctx: CanvasRenderingContext2D,
  size: number,
  radius: number,
  cfg: OrbStateConfig,
  isDark: boolean,
) => {
  const c = size / 2;

  // 球体下方微偏的同色系柔和接地光晕，赋予悬浮空气感
  const ground = ctx.createRadialGradient(
    c,
    c + radius * 0.14,
    radius * 0.32,
    c,
    c + radius * 0.1,
    radius * 1.24,
  );
  ground.addColorStop(0, rgbCss(cfg.primaryRgb, isDark ? 0.32 : 0.24));
  ground.addColorStop(0.58, rgbCss(cfg.secondaryRgb, isDark ? 0.12 : 0.085));
  ground.addColorStop(1, rgbCss(cfg.primaryRgb, 0));
  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, size, size);
};

const drawCrystalBase = (
  ctx: CanvasRenderingContext2D,
  size: number,
  radius: number,
  t: number,
  cfg: OrbStateConfig,
) => {
  const c = size / 2;

  // 深邃立体光学宝石内腔基底：左上清透受光、中部深邃饱含能量、边缘虹彩微亮
  const base = ctx.createRadialGradient(
    c - radius * 0.34,
    c - radius * 0.38,
    radius * 0.06,
    c + radius * 0.08,
    c + radius * 0.1,
    radius * 1.18,
  );
  base.addColorStop(0, rgbCss(cfg.primaryRgb, 0.82));
  base.addColorStop(0.38, rgbCss(cfg.deepRgb, 0.92));
  base.addColorStop(0.78, rgbCss(cfg.deepRgb, 0.98));
  base.addColorStop(1, rgbCss(cfg.primaryRgb, 0.68));
  ctx.fillStyle = base;
  ctx.fillRect(c - radius, c - radius, radius * 2, radius * 2);

  // 3 团柔和绕核游走的体积极光云
  const clouds: { rgb: RgbTuple; angle: number; dist: number; scale: number; alpha: number }[] = [
    { rgb: cfg.primaryRgb, angle: t * 0.52, dist: 0.32, scale: 0.88, alpha: 0.56 },
    { rgb: cfg.secondaryRgb, angle: -t * 0.44 + 2.1, dist: 0.36, scale: 0.82, alpha: 0.5 },
    { rgb: cfg.accentRgb, angle: t * 0.36 + 4.2, dist: 0.24, scale: 0.62, alpha: 0.28 },
  ];

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const cloud of clouds) {
    const cx = c + Math.cos(cloud.angle) * radius * cloud.dist;
    const cy = c + Math.sin(cloud.angle * 0.85) * radius * cloud.dist;
    const cr = radius * cloud.scale;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    g.addColorStop(0, rgbCss(cloud.rgb, cloud.alpha));
    g.addColorStop(0.55, rgbCss(cloud.rgb, cloud.alpha * 0.28));
    g.addColorStop(1, rgbCss(cloud.rgb, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

const drawInnerCore = (
  ctx: CanvasRenderingContext2D,
  size: number,
  radius: number,
  t: number,
  cfg: OrbStateConfig,
) => {
  const c = size / 2;
  const pulse = 1 + Math.sin(t * cfg.pulseFreq * Math.PI * 1.35) * 0.12;
  const coreR = radius * 0.48 * pulse * Math.max(cfg.coreGlow, 0.55);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const grad = ctx.createRadialGradient(c, c, 0, c, c, coreR);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.88)");
  grad.addColorStop(0.24, rgbCss(cfg.accentRgb, 0.58));
  grad.addColorStop(0.58, rgbCss(cfg.primaryRgb, 0.22));
  grad.addColorStop(1, rgbCss(cfg.primaryRgb, 0));
  ctx.beginPath();
  ctx.arc(c, c, coreR, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
};

const drawParticleTrail = (
  ctx: CanvasRenderingContext2D,
  p: ProjectedParticle,
  opts: { size: number; dotR: number; rgb: RgbTuple; alpha: number },
) => {
  if (!p.hasTrail) return;
  const dx = p.x - p.prevX;
  const dy = p.y - p.prevY;
  const lenSq = dx * dx + dy * dy;
  if (lenSq <= 0.12 || lenSq >= opts.size * opts.size * 0.08) return;

  const grad = ctx.createLinearGradient(p.prevX, p.prevY, p.x, p.y);
  grad.addColorStop(0, rgbCss(opts.rgb, 0));
  grad.addColorStop(1, rgbCss(opts.rgb, opts.alpha * 0.65));
  ctx.beginPath();
  ctx.moveTo(p.prevX, p.prevY);
  ctx.lineTo(p.x, p.y);
  ctx.lineWidth = Math.max(opts.dotR * 0.9, 0.6);
  ctx.lineCap = "round";
  ctx.strokeStyle = grad;
  ctx.stroke();
};

const drawMicroCrossGlint = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  arm: number,
  alpha: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x - arm, y);
  ctx.lineTo(x + arm, y);
  ctx.moveTo(x, y - arm);
  ctx.lineTo(x, y + arm);
  ctx.lineWidth = 0.6;
  ctx.lineCap = "round";
  ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.stroke();
};

const drawSingleParticle = (
  ctx: CanvasRenderingContext2D,
  p: ProjectedParticle,
  opts: { size: number; cfg: OrbStateConfig },
) => {
  const { size, cfg } = opts;
  const scale = Math.max(size / 96, 0.5);
  const dotR = Math.min(Math.max(p.size * (0.48 + p.depth * 0.56) * scale, 0.36), 1.6);
  const rawAlpha =
    (0.16 + Math.pow(p.depth, 1.25) * 0.78) * (0.55 + p.light * 0.45) * (0.78 + cfg.energy * 0.22) +
    p.boost * 0.4;
  const alpha = Math.min(Math.max(rawAlpha, 0.09), 0.98);
  const starRgb: RgbTuple = p.depth > 0.55 || p.boost > 0.25 ? cfg.accentRgb : cfg.secondaryRgb;

  drawParticleTrail(ctx, p, { size, dotR, rgb: starRgb, alpha });

  if (p.depth > 0.45 && p.tier > 0.62) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, dotR * 2.7, 0, Math.PI * 2);
    ctx.fillStyle = rgbCss(cfg.primaryRgb, alpha * 0.28);
    ctx.fill();
  }

  if (size >= 64 && p.depth > 0.72 && p.tier > 0.9) {
    drawMicroCrossGlint(ctx, p.x, p.y, dotR * 3.1, alpha * 0.65);
  }

  ctx.beginPath();
  ctx.arc(p.x, p.y, dotR * (1 + p.boost * 0.3), 0, Math.PI * 2);
  ctx.fillStyle = p.depth > 0.72 ? `rgba(255, 255, 255, ${alpha})` : rgbCss(starRgb, alpha);
  ctx.fill();
};

const drawGlassRim = (
  ctx: CanvasRenderingContext2D,
  size: number,
  radius: number,
  cfg: OrbStateConfig,
) => {
  const c = size / 2;
  ctx.beginPath();
  ctx.arc(c, c, radius * 0.92, Math.PI * 1.1, Math.PI * 1.44);
  ctx.lineWidth = Math.max(size * 0.014, 1);
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
  ctx.stroke();

  const rim = ctx.createLinearGradient(c - radius, c - radius, c + radius, c + radius);
  rim.addColorStop(0, "rgba(255, 255, 255, 0.78)");
  rim.addColorStop(0.36, rgbCss(cfg.accentRgb, 0.45));
  rim.addColorStop(0.74, rgbCss(cfg.primaryRgb, 0.42));
  rim.addColorStop(1, rgbCss(cfg.secondaryRgb, 0.65));
  ctx.beginPath();
  ctx.arc(c, c, radius - 0.5, 0, Math.PI * 2);
  ctx.lineWidth = Math.max(size * 0.011, 0.9);
  ctx.strokeStyle = rim;
  ctx.stroke();
};

const drawGlassShell = (
  ctx: CanvasRenderingContext2D,
  size: number,
  radius: number,
  cfg: OrbStateConfig,
) => {
  const c = size / 2;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const caustic = ctx.createRadialGradient(
    c + radius * 0.16,
    c + radius * 0.76,
    radius * 0.04,
    c + radius * 0.12,
    c + radius * 0.64,
    radius * 0.62,
  );
  caustic.addColorStop(0, rgbCss(cfg.accentRgb, 0.52));
  caustic.addColorStop(0.45, rgbCss(cfg.secondaryRgb, 0.26));
  caustic.addColorStop(1, rgbCss(cfg.secondaryRgb, 0));
  ctx.fillStyle = caustic;
  ctx.beginPath();
  ctx.arc(c, c, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(c - radius * 0.34, c - radius * 0.38);
  ctx.rotate(-0.62);
  const spec = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.44);
  spec.addColorStop(0, "rgba(255, 255, 255, 0.56)");
  spec.addColorStop(0.5, "rgba(255, 255, 255, 0.14)");
  spec.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.scale(1.25, 0.62);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.44, 0, Math.PI * 2);
  ctx.fillStyle = spec;
  ctx.fill();
  ctx.restore();

  drawGlassRim(ctx, size, radius, cfg);
};

/** 渲染单帧 ThinkingOrb 3D 光学水晶星尘球 */
const renderOrbFrame = (
  ctx: CanvasRenderingContext2D,
  particles: OrbParticle[],
  opts: { cfg: OrbStateConfig; size: number; time: number; isDark: boolean },
) => {
  const { cfg, size, time, isDark } = opts;
  const c = size / 2;
  const radius = size * 0.4;
  const scanPhi = 0.16 + ((time * 0.56) % 1) * (Math.PI - 0.32);

  ctx.clearRect(0, 0, size, size);
  drawAmbientAura(ctx, size, radius, cfg, isDark);
  drawAcousticRipples(ctx, size, radius, time, cfg);
  drawOrbitalLayer(ctx, { size, radius, t: time, cfg, front: false });

  // 在精密水晶球壳内部渲染流动极光、丝绸光带、星尘与玻璃曲率高光
  ctx.save();
  ctx.beginPath();
  ctx.arc(c, c, radius, 0, Math.PI * 2);
  ctx.clip();

  drawCrystalBase(ctx, size, radius, time, cfg);
  drawSilkRibbons(ctx, { size, radius, t: time, cfg });

  const projected = projectOrbParticles(particles, cfg, { size, radius, time, scanPhi });
  const split = projected.findIndex((item) => item.z >= 0);
  const splitIndex = split === -1 ? projected.length : split;

  for (let i = 0; i < splitIndex; i += 1) {
    drawSingleParticle(ctx, projected[i]!, { size, cfg });
  }

  drawInnerCore(ctx, size, radius, time, cfg);
  drawScanningRing(ctx, { size, radius, t: time, scanPhi, cfg });

  for (let i = splitIndex; i < projected.length; i += 1) {
    drawSingleParticle(ctx, projected[i]!, { size, cfg });
  }

  drawGlassShell(ctx, size, radius, cfg);
  ctx.restore();

  drawOrbitalLayer(ctx, { size, radius, t: time, cfg, front: true });
};
const readDarkTheme = (): boolean => {
  if (typeof document === "undefined") return false;
  const root = document.documentElement;
  if (root.getAttribute("data-theme") === "dark" || root.classList.contains("dark")) return true;
  if (root.getAttribute("data-theme") === "light" || root.classList.contains("light")) return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
};

const useAutoDarkTheme = (darkProp: boolean | undefined) => {
  const [detected, setDetected] = useState(readDarkTheme);

  useEffect(() => {
    if (darkProp !== undefined || typeof document === "undefined") return;
    const sync = () => setDetected(readDarkTheme());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => observer.disconnect();
  }, [darkProp]);

  return darkProp ?? detected;
};

const usePrefersReducedMotion = () => {
  const ref = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      ref.current = media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return ref;
};

const watchCanvasVisibility = (canvas: HTMLCanvasElement, onChange: (visible: boolean) => void) => {
  if (typeof IntersectionObserver !== "function") return undefined;
  const observer = new IntersectionObserver(
    ([entry]) => onChange(entry ? entry.isIntersecting || entry.intersectionRatio > 0 : true),
    { rootMargin: "100px 0px" },
  );
  observer.observe(canvas);
  return observer;
};

interface OrbLoopConfig {
  size: number;
  isDark: boolean;
  paused: boolean;
}

interface OrbLoopRefs {
  particles: React.RefObject<OrbParticle[]>;
  dynamic: React.RefObject<{ state: ThinkingOrbState; speed: number }>;
  config: React.RefObject<OrbStateConfig>;
  time: React.RefObject<number>;
  last: React.RefObject<number>;
  reduced: React.RefObject<boolean>;
}

const configureCanvasSize = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  size: number,
) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const mountOrbLoop = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  loopCfg: OrbLoopConfig,
  refs: OrbLoopRefs,
) => {
  configureCanvasSize(canvas, ctx, loopCfg.size);

  let rafId: number | null = null;
  let visible = true;
  const canTick = () => visible && !loopCfg.paused && !refs.reduced.current;

  const drawFrame = (ts: number) => {
    const dyn = refs.dynamic.current;
    const dt = refs.last.current === 0 ? 0.016 : Math.min(ts - refs.last.current, 40) / 1000;
    refs.last.current = ts;

    const target = ORB_STATE_CONFIGS[dyn.state] ?? ORB_STATE_CONFIGS.working;
    if (loopCfg.paused || refs.reduced.current) {
      refs.config.current = cloneOrbConfig(dyn.state);
    } else {
      refs.time.current += dt * dyn.speed;
      lerpOrbConfig(refs.config.current, target, 1 - Math.exp(-dt * 5.2));
    }

    renderOrbFrame(ctx, refs.particles.current, {
      cfg: refs.config.current,
      size: loopCfg.size,
      time: refs.time.current,
      isDark: loopCfg.isDark,
    });
    rafId = canTick() ? window.requestAnimationFrame(drawFrame) : null;
  };

  const observer = watchCanvasVisibility(canvas, (nextVisible) => {
    visible = nextVisible;
    if (canTick() && rafId === null) {
      refs.last.current = 0;
      rafId = window.requestAnimationFrame(drawFrame);
    } else if (!visible && rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  drawFrame(performance.now());
  return () => {
    observer?.disconnect();
    if (rafId !== null) window.cancelAnimationFrame(rafId);
    refs.last.current = 0;
  };
};

const useOrbCanvasLoop = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  particlesRef: React.RefObject<OrbParticle[]>,
  opts: { state: ThinkingOrbState; size: number; speed: number; isDark: boolean; paused: boolean },
) => {
  const { state, size, speed, isDark, paused } = opts;
  const dynamicRef = useRef({ state, speed });
  const configRef = useRef<OrbStateConfig>(cloneOrbConfig(state));
  const timeRef = useRef(0);
  const lastRef = useRef(0);
  const reducedRef = usePrefersReducedMotion();

  useEffect(() => {
    dynamicRef.current = { state, speed };
    if (!paused && !reducedRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    configRef.current = cloneOrbConfig(state);
    renderOrbFrame(ctx, particlesRef.current, {
      cfg: configRef.current,
      size,
      time: timeRef.current,
      isDark,
    });
  }, [canvasRef, particlesRef, state, speed, size, isDark, paused, reducedRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    return mountOrbLoop(
      canvas,
      ctx,
      { size, isDark, paused },
      {
        particles: particlesRef,
        dynamic: dynamicRef,
        config: configRef,
        time: timeRef,
        last: lastRef,
        reduced: reducedRef,
      },
    );
  }, [canvasRef, particlesRef, size, isDark, paused, reducedRef]);
};
const DIAL_TICK_ANGLES = Array.from({ length: 36 }, (_, i) => i * 10);

const OrbDialTicks = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 100"
    className="pointer-events-none absolute inset-0 size-full text-foreground/22 dark:text-white/22"
  >
    <circle
      cx="50"
      cy="50"
      r="47.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.45"
      strokeOpacity="0.45"
    />
    {DIAL_TICK_ANGLES.map((deg) => {
      const major = deg % 90 === 0;
      return (
        <line
          key={deg}
          x1="50"
          y1={major ? "2.6" : "3.2"}
          x2="50"
          y2={major ? "6.2" : "5.1"}
          stroke="currentColor"
          strokeWidth={major ? "0.9" : "0.55"}
          strokeLinecap="round"
          strokeOpacity={major ? "0.95" : "0.52"}
          transform={`rotate(${deg} 50 50)`}
        />
      );
    })}
  </svg>
);

const ThinkingOrbDecor = ({
  variant,
  state,
  size,
}: {
  variant: ThinkingOrbVariant;
  state: ThinkingOrbState;
  size: number;
}) => {
  if (variant === "minimal") return null;
  const accent = ORB_STATE_ACCENTS[state] ?? ORB_STATE_ACCENTS.working;
  return (
    <>
      {variant === "halo" && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 rounded-full blur-md transition-colors duration-500"
            style={{
              background: `radial-gradient(circle, ${accent.haloTint} 0%, transparent 70%)`,
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1.5 rounded-full border border-solid border-foreground/[0.07] dark:border-white/[0.09]"
          />
        </>
      )}
      {size >= 44 && <OrbDialTicks />}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1px] rounded-full bg-gradient-to-b from-white/60 via-transparent to-transparent dark:from-white/[0.09]"
      />
    </>
  );
};

const ThinkingOrbCaption = ({
  label,
  state,
  placement,
  paused,
}: {
  label: string;
  state: ThinkingOrbState;
  placement: ThinkingOrbLabelPlacement;
  paused: boolean;
}) => {
  const accent = ORB_STATE_ACCENTS[state] ?? ORB_STATE_ACCENTS.working;
  return (
    <span data-slot="thinking-orb-label" className={thinkingOrbLabelVariants({ placement })}>
      <span
        data-slot="thinking-orb-indicator"
        aria-hidden="true"
        className="relative flex size-2 shrink-0 items-center justify-center"
      >
        {!paused && (
          <span
            className="absolute inline-flex size-full animate-ping rounded-full opacity-55"
            style={{ backgroundColor: accent.dot }}
          />
        )}
        <span
          className="relative inline-flex size-1.5 rounded-full transition-colors duration-300"
          style={{
            backgroundColor: accent.dot,
            boxShadow: `0 0 8px ${accent.glow}`,
          }}
        />
      </span>
      <span>{label}</span>
    </span>
  );
};

const resolveOrbDefaults = (props: ThinkingOrbProps) => ({
  state: props.state ?? "working",
  variant: props.variant ?? "minimal",
  size: props.size ?? 64,
  speed: props.speed ?? 1,
  paused: props.paused ?? false,
  showLabel: props.showLabel ?? false,
  labelPlacement: props.labelPlacement ?? "bottom",
  interactive: props.interactive ?? false,
});

const resolveFrameSize = (size: number, variant: ThinkingOrbVariant): number => {
  if (variant === "minimal") return size;
  const ratio = variant === "halo" ? 0.18 : 0.14;
  return size + Math.max(variant === "halo" ? 14 : 10, Math.round(size * ratio));
};

interface ThinkingOrbViewProps {
  opts: ReturnType<typeof resolveOrbDefaults>;
  frameClass: string;
  frameSize: number;
  aria: string;
  resolvedLabel: string;
  hasVisibleLabel: boolean;
  className?: string;
  style?: ThinkingOrbProps["style"];
  canvasNode: React.ReactNode;
}

const ThinkingOrbView = (p: ThinkingOrbViewProps) => {
  const frameInner = (
    <>
      <ThinkingOrbDecor variant={p.opts.variant} state={p.opts.state} size={p.opts.size} />
      {p.canvasNode}
    </>
  );

  if (!p.hasVisibleLabel) {
    return (
      <output
        data-slot="thinking-orb"
        data-state={p.opts.state}
        data-variant={p.opts.variant}
        aria-label={p.aria}
        className={cn(p.frameClass, p.className)}
        style={{ width: p.frameSize, height: p.frameSize, ...p.style }}
      >
        {frameInner}
      </output>
    );
  }
  return (
    <output
      data-slot="thinking-orb"
      data-state={p.opts.state}
      data-variant={p.opts.variant}
      aria-label={p.aria}
      className={cn(
        thinkingOrbRootVariants({ hasLabel: true, placement: p.opts.labelPlacement }),
        p.className,
      )}
      style={p.style}
    >
      <span
        data-slot="thinking-orb-frame"
        className={p.frameClass}
        style={{ width: p.frameSize, height: p.frameSize }}
      >
        {frameInner}
      </span>
      <ThinkingOrbCaption
        label={p.resolvedLabel}
        state={p.opts.state}
        placement={p.opts.labelPlacement}
        paused={p.opts.paused}
      />
    </output>
  );
};

export const ThinkingOrb = (props: ThinkingOrbProps) => {
  const opts = resolveOrbDefaults(props);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<OrbParticle[]>(
    createOrbParticles(orbParticleCountForSize(opts.size)),
  );
  const isDark = useAutoDarkTheme(props.dark);

  useEffect(() => {
    particlesRef.current = createOrbParticles(orbParticleCountForSize(opts.size));
  }, [opts.size]);

  useOrbCanvasLoop(canvasRef, particlesRef, {
    state: opts.state,
    size: opts.size,
    speed: opts.speed,
    isDark,
    paused: opts.paused,
  });

  const resolvedLabel = props.label ?? THINKING_ORB_STATE_LABELS[opts.state];
  const frameSize = resolveFrameSize(opts.size, opts.variant);
  return (
    <ThinkingOrbView
      opts={opts}
      frameClass={thinkingOrbFrameVariants({
        variant: opts.variant,
        interactive: opts.interactive,
      })}
      frameSize={frameSize}
      aria={props["aria-label"] ?? `智能体状态球：${resolvedLabel}`}
      resolvedLabel={resolvedLabel}
      hasVisibleLabel={Boolean(props.label) || opts.showLabel}
      className={props.className}
      style={props.style}
      canvasNode={
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="relative block"
          style={{ width: opts.size, height: opts.size }}
        />
      }
    />
  );
};
