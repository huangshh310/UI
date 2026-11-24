/**
 * ThinkingOrb 的 7 层光学水晶渲染管线：色散投影、立体宝石腔体、体积极光云、丝绸光带、微距星尘与玻璃高光。
 */
import { rgbCss, type OrbStateConfig, type RgbTuple } from "./thinking-orb-config.js";
import {
  projectOrbParticles,
  type OrbParticle,
  type ProjectedParticle,
} from "./thinking-orb-field.js";
import {
  drawAcousticRipples,
  drawOrbitalLayer,
  drawScanningRing,
  drawSilkRibbons,
} from "./thinking-orb-orbits.js";

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
export const renderOrbFrame = (
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
