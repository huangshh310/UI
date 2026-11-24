/**
 * ThinkingOrb 的 3D 黄金螺旋星尘场生成、连续状态形变与透视投影计算。
 */
import type { OrbStateConfig } from "./thinking-orb-config.js";

export interface OrbParticle {
  theta: number;
  phi: number;
  shell: number;
  speed: number;
  size: number;
  phase: number;
  tier: number;
  bandDir: number;
}

export interface ProjectedParticle {
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

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const seededUnit = (index: number, salt: number): number => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

/** 随画布直径自适应计算球腔内星尘数量 */
export const orbParticleCountForSize = (size: number): number => {
  if (size <= 28) return 52;
  if (size <= 52) return 110;
  if (size <= 88) return 190;
  if (size <= 128) return 260;
  return 320;
};

/** 生成双层球腔星尘：悬浮于水晶球体内部，层次清晰不溢边 */
export const createOrbParticles = (count: number): OrbParticle[] =>
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
export const rotateOrbPoint = (v: Vec3, tiltX: number, tiltZ: number): Vec3 => {
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
export const projectOrbParticles = (
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
