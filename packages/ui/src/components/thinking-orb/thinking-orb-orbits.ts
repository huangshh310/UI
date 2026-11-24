/**
 * ThinkingOrb 的 3D 丝绸光学流带、精密彗星轨道环、声波涟漪与经纬扫描面绘制。
 */
import { rgbCss, type OrbStateConfig, type RgbTuple } from "./thinking-orb-config.js";
import { rotateOrbPoint } from "./thinking-orb-field.js";

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

export const drawAcousticRipples = (
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

export const drawOrbitalLayer = (
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

export const drawScanningRing = (
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
export const drawSilkRibbons = (
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
