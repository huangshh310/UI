// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * ThinkingOrb：极简纯单色 3D 球面粒子思考球，支持 9 种 AI 认知状态、明暗极性自动适配、离屏暂停与减弱动效降级。
 */

import { cn } from "@/lib/utils";
import { type CSSProperties, useEffect, useRef, useState } from "react";

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

export interface ThinkingOrbProps {
  /** 智能体当前认知状态预设，默认 "working" */
  state?: ThinkingOrbState;
  /** 球体直径（像素），默认 64 */
  size?: number;
  /** 动效速率倍率，默认 1 */
  speed?: number;
  /** 强制指定明暗极性（true 为深底亮粒，false 为浅底墨粒）；省略时自动跟随页面主题 */
  dark?: boolean;
  /** 暂停当前轨道动画（保留粒子当前坐标） */
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}
interface OrbStateParams {
  energy: number;
  turbulence: number;
  rotation: number;
  pulse: number;
  compression: number;
  wave: number;
  coreGlow: number;
}

interface OrbParticle {
  theta: number;
  phi: number;
  radius: number;
  speed: number;
  size: number;
  phase: number;
  depth: number;
}

const ORB_STATE_PARAMS: Record<ThinkingOrbState, OrbStateParams> = {
  working: {
    energy: 0.8,
    turbulence: 0.2,
    rotation: 0.35,
    pulse: 0.7,
    compression: 1,
    wave: 0.2,
    coreGlow: 0.9,
  },
  searching: {
    energy: 1.15,
    turbulence: 0.5,
    rotation: 0.8,
    pulse: 0.55,
    compression: 1.02,
    wave: 0.45,
    coreGlow: 0.75,
  },
  solving: {
    energy: 1.35,
    turbulence: 0.7,
    rotation: 0.95,
    pulse: 0.85,
    compression: 0.92,
    wave: 0.65,
    coreGlow: 1,
  },
  listening: {
    energy: 0.4,
    turbulence: 0.08,
    rotation: 0.12,
    pulse: 1.2,
    compression: 1.04,
    wave: 0.06,
    coreGlow: 0.65,
  },
  connecting: {
    energy: 0.95,
    turbulence: 0.28,
    rotation: 1.3,
    pulse: 0.5,
    compression: 1,
    wave: 0.3,
    coreGlow: 0.85,
  },
  weaving: {
    energy: 1.1,
    turbulence: 0.6,
    rotation: 0.45,
    pulse: 0.65,
    compression: 0.88,
    wave: 0.9,
    coreGlow: 0.8,
  },
  composing: {
    energy: 0.75,
    turbulence: 0.18,
    rotation: 0.2,
    pulse: 0.9,
    compression: 0.75,
    wave: 0.35,
    coreGlow: 0.7,
  },
  breathing: {
    energy: 0.25,
    turbulence: 0.04,
    rotation: 0.06,
    pulse: 1.5,
    compression: 1.1,
    wave: 0.03,
    coreGlow: 0.5,
  },
  shaping: {
    energy: 0.95,
    turbulence: 0.42,
    rotation: 0.5,
    pulse: 0.7,
    compression: 0.92,
    wave: 0.75,
    coreGlow: 0.85,
  },
};

/** 确定性伪随机数，保证相同粒子数量下球面分布均衡稳定 */
const seededNoise = (index: number, salt: number) => {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** 按黄金螺旋均匀分布球面粒子 */
const createOrbParticles = (count: number): OrbParticle[] =>
  Array.from({ length: count }, (_, i) => ({
    phi: Math.acos(1 - (2 * (i + 0.5)) / count),
    theta: Math.PI * (1 + Math.sqrt(5)) * i,
    radius: 0.75 + seededNoise(i, 1) * 0.25,
    speed: 0.15 + seededNoise(i, 2) * 0.85,
    size: 0.45 + seededNoise(i, 3) * 1.05,
    phase: seededNoise(i, 4) * Math.PI * 2,
    depth: seededNoise(i, 5),
  }));

const orbParticleCountForSize = (size: number) => {
  if (size <= 24) return 45;
  if (size <= 48) return 90;
  if (size <= 80) return 160;
  return 220;
};

interface SphericalCoords {
  r: number;
  theta: number;
  phi: number;
}

const deformByState = (
  state: ThinkingOrbState,
  p: OrbParticle,
  t: number,
  coords: SphericalCoords,
): SphericalCoords => {
  let { r, theta, phi } = coords;
  if (state === "searching") {
    r += Math.sin(t * 1.6 + p.phase) * 0.03;
    theta += Math.sin(t * 1.2 + p.phase) * 0.02;
  } else if (state === "solving") {
    const converge = Math.sin(t * 2.8 + p.phase);
    r += converge * 0.045;
    phi += converge * 0.02;
  } else if (state === "listening") {
    r += Math.sin(t * 0.75 + p.phase) * 0.012;
  } else if (state === "connecting") {
    theta += p.radius * t * 0.5;
    phi += Math.sin(t * 1.1 + p.phase) * 0.03;
  } else if (state === "weaving") {
    theta += Math.sin(phi * 6 + t * 1.4) * 0.05;
    phi += Math.cos(theta * 4 + t * 1.1) * 0.045;
  } else if (state === "composing") {
    r *= 0.96;
    phi += Math.sin(t * 1.4 + p.phase) * 0.015;
  } else if (state === "shaping") {
    r *= 1 + Math.sin(theta * 2 + t * 0.9) * 0.08;
  }
  return { r, theta, phi };
};

const drawHalo = (ctx: CanvasRenderingContext2D, size: number, radius: number, isDark: boolean) => {
  const c = size / 2;
  const halo = ctx.createRadialGradient(c, c, 0, c, c, radius * 1.55);
  const rgb = isDark ? "255, 255, 255" : "10, 10, 12";
  halo.addColorStop(0, `rgba(${rgb}, ${isDark ? 0.06 : 0.05})`);
  halo.addColorStop(0.4, `rgba(${rgb}, ${isDark ? 0.02 : 0.015})`);
  halo.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);
};

const drawNucleus = (
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  cfg: OrbStateParams,
  isDark: boolean,
) => {
  const c = size / 2;
  const coreRadius = size * 0.046 * (1 + Math.sin(t * cfg.pulse * 1.7) * 0.1 * cfg.coreGlow);
  const bloom = ctx.createRadialGradient(c, c, 0, c, c, coreRadius * 4.2);
  if (isDark) {
    bloom.addColorStop(0, "rgba(255, 255, 255, 0.92)");
    bloom.addColorStop(0.22, "rgba(255, 255, 255, 0.48)");
    bloom.addColorStop(0.55, "rgba(235, 235, 245, 0.12)");
    bloom.addColorStop(1, "rgba(0, 0, 0, 0)");
  } else {
    bloom.addColorStop(0, "rgba(12, 12, 16, 0.92)");
    bloom.addColorStop(0.22, "rgba(32, 32, 40, 0.45)");
    bloom.addColorStop(0.55, "rgba(70, 70, 82, 0.12)");
    bloom.addColorStop(1, "rgba(255, 255, 255, 0)");
  }
  ctx.beginPath();
  ctx.arc(c, c, coreRadius * 4.2, 0, Math.PI * 2);
  ctx.fillStyle = bloom;
  ctx.fill();
};

const drawSingleParticle = (
  ctx: CanvasRenderingContext2D,
  p: OrbParticle,
  opts: {
    state: ThinkingOrbState;
    cfg: OrbStateParams;
    size: number;
    t: number;
    breathing: number;
    rotation: number;
    isDark: boolean;
  },
) => {
  const { state, cfg, size, t, breathing, rotation, isDark } = opts;
  const baseTheta = p.theta + rotation * (0.65 + p.depth * 0.45);
  const wave =
    Math.sin(baseTheta * 3 + t * (1.05 + cfg.energy * 0.8)) * Math.cos(p.phi * 3 - t * 0.5);
  const baseR = p.radius * breathing * cfg.compression * (1 + wave * cfg.turbulence * 0.06);
  const { r, theta, phi } = deformByState(state, p, t, { r: baseR, theta: baseTheta, phi: p.phi });

  const flow = Math.sin(theta * 3 + t) * Math.sin(phi * 2 - t * 0.4);
  const x = Math.sin(phi) * Math.cos(theta) * r + flow * cfg.wave * 0.025;
  const y = Math.cos(phi) * r + Math.cos(theta * 2 - t * 0.8) * cfg.wave * 0.02;
  const z = Math.sin(phi) * Math.sin(theta);

  const center = size / 2;
  const perspective = 1 / (1.22 - z * 0.22);
  const screenX = center + x * (size * 0.36) * perspective;
  const screenY = center + y * (size * 0.36) * perspective;
  const depth = (z + 1) / 2;
  const pSize = Math.max(p.size * (0.5 + depth * 0.85) * (size / 64), 0.35);
  const rawAlpha = (0.2 + depth * 0.8) * (0.25 + p.depth * 0.55) * cfg.energy;
  const alpha = Math.min(Math.max(depth < 0.25 ? rawAlpha * 0.5 : rawAlpha, 0.06), 0.95);
  const rgb = isDark ? "255, 255, 255" : "18, 18, 22";

  if (cfg.energy > 0.8 && pSize > 0.85 && size >= 48) {
    const trailLen = p.speed * cfg.rotation * 2.2;
    ctx.strokeStyle = `rgba(${rgb}, ${alpha * 0.2})`;
    ctx.lineWidth = Math.max(pSize * 0.5, 0.35);
    ctx.beginPath();
    ctx.moveTo(screenX - Math.cos(theta) * trailLen, screenY - Math.sin(theta) * trailLen);
    ctx.lineTo(screenX, screenY);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(screenX, screenY, pSize, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
  ctx.fill();
};

const renderOrbFrame = (
  ctx: CanvasRenderingContext2D,
  particles: OrbParticle[],
  opts: { state: ThinkingOrbState; size: number; time: number; isDark: boolean },
) => {
  const { state, size, time, isDark } = opts;
  const cfg = ORB_STATE_PARAMS[state] ?? ORB_STATE_PARAMS.working;
  ctx.clearRect(0, 0, size, size);
  drawHalo(ctx, size, size * 0.36, isDark);

  const breathing = 1 + Math.sin(time * cfg.pulse * 1.35) * 0.045 * cfg.energy;
  const rotation = time * cfg.rotation * 0.65;
  for (const particle of particles) {
    drawSingleParticle(ctx, particle, {
      state,
      cfg,
      size,
      t: time,
      breathing,
      rotation,
      isDark,
    });
  }
  drawNucleus(ctx, size, time, cfg, isDark);
};
const STATE_LABELS: Record<ThinkingOrbState, string> = {
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

const mountOrbLoop = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  particlesRef: React.RefObject<OrbParticle[]>,
  timers: {
    timeRef: React.RefObject<number>;
    lastRef: React.RefObject<number>;
    reducedRef: React.RefObject<boolean>;
  },
  opts: { state: ThinkingOrbState; size: number; speed: number; isDark: boolean; paused: boolean },
) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = opts.size * dpr;
  canvas.height = opts.size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  let rafId: number | null = null;
  let visible = true;
  const canTick = () => visible && !opts.paused && !timers.reducedRef.current;

  const drawFrame = (ts: number) => {
    const dt =
      timers.lastRef.current === 0 ? 0.016 : Math.min(ts - timers.lastRef.current, 40) / 1000;
    timers.lastRef.current = ts;
    if (!opts.paused && !timers.reducedRef.current) timers.timeRef.current += dt * opts.speed;
    renderOrbFrame(ctx, particlesRef.current, {
      state: opts.state,
      size: opts.size,
      time: timers.timeRef.current,
      isDark: opts.isDark,
    });
    rafId = canTick() ? window.requestAnimationFrame(drawFrame) : null;
  };

  const observer = watchCanvasVisibility(canvas, (nextVisible) => {
    visible = nextVisible;
    if (canTick() && rafId === null) rafId = window.requestAnimationFrame(drawFrame);
    else if (!visible && rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  drawFrame(performance.now());
  return () => {
    observer?.disconnect();
    if (rafId !== null) window.cancelAnimationFrame(rafId);
    timers.lastRef.current = 0;
  };
};

const useOrbCanvasLoop = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  particlesRef: React.RefObject<OrbParticle[]>,
  opts: { state: ThinkingOrbState; size: number; speed: number; isDark: boolean; paused: boolean },
) => {
  const timeRef = useRef(0);
  const lastRef = useRef(0);
  const reducedRef = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    return mountOrbLoop(canvas, ctx, particlesRef, { timeRef, lastRef, reducedRef }, opts);
  }, [canvasRef, particlesRef, opts, reducedRef]);
};

export const ThinkingOrb = ({
  state = "working",
  size = 64,
  speed = 1,
  dark,
  paused = false,
  className,
  style,
  "aria-label": ariaLabel,
}: ThinkingOrbProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<OrbParticle[]>(createOrbParticles(orbParticleCountForSize(size)));
  const isDark = useAutoDarkTheme(dark);

  useEffect(() => {
    particlesRef.current = createOrbParticles(orbParticleCountForSize(size));
  }, [size]);

  useOrbCanvasLoop(canvasRef, particlesRef, { state, size, speed, isDark, paused });

  return (
    <output
      data-slot="thinking-orb"
      data-state={state}
      aria-label={ariaLabel ?? `智能体状态球：${STATE_LABELS[state]}`}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size, ...style }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block"
        style={{ width: size, height: size }}
      />
    </output>
  );
};
