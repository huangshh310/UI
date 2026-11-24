/**
 * ThinkingOrb 的 Canvas 动画循环、离屏可见性监听与主题/减动效响应。
 */
import { useEffect, useRef, useState } from "react";
import {
  ORB_STATE_CONFIGS,
  cloneOrbConfig,
  lerpOrbConfig,
  type OrbStateConfig,
} from "./thinking-orb-config.js";
import type { OrbParticle } from "./thinking-orb-field.js";
import { renderOrbFrame } from "./thinking-orb-render.js";
import type { ThinkingOrbState } from "./thinking-orb.types.js";

const readDarkTheme = (): boolean => {
  if (typeof document === "undefined") return false;
  const root = document.documentElement;
  if (root.getAttribute("data-theme") === "dark" || root.classList.contains("dark")) return true;
  if (root.getAttribute("data-theme") === "light" || root.classList.contains("light")) return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
};

export const useAutoDarkTheme = (darkProp: boolean | undefined) => {
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

export const useOrbCanvasLoop = (
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
