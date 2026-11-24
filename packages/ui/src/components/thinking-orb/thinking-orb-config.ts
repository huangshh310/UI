/**
 * ThinkingOrb 的 9 种认知状态 3D 光学物理编排、宝石级三色色板与平滑插值器。
 */
import type { ThinkingOrbState } from "./thinking-orb.types.js";

export type RgbTuple = [number, number, number];

export interface OrbStateConfig {
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

export const ORB_STATE_CONFIGS: Record<ThinkingOrbState, OrbStateConfig> = {
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

export const rgbCss = (rgb: RgbTuple, alpha: number): string =>
  `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${alpha})`;

export const cloneOrbConfig = (state: ThinkingOrbState): OrbStateConfig => {
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

export const lerpOrbConfig = (
  current: OrbStateConfig,
  target: OrbStateConfig,
  factor: number,
): void => {
  for (const key of SCALAR_KEYS) {
    current[key] += (target[key] - current[key]) * factor;
  }
  current.ringCount = target.ringCount;
  lerpRgb(current.deepRgb, target.deepRgb, factor);
  lerpRgb(current.primaryRgb, target.primaryRgb, factor);
  lerpRgb(current.secondaryRgb, target.secondaryRgb, factor);
  lerpRgb(current.accentRgb, target.accentRgb, factor);
};
