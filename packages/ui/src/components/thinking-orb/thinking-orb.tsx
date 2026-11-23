"use client";

/**
 * ThinkingOrb：极简纯单色 3D 球面粒子思考球，支持 9 种 AI 认知状态、玻璃表圈/光晕变体、状态胶囊与离屏暂停。
 */
import { cn } from "@matt-ui/utils";
import { useEffect, useRef, useState } from "react";
import {
  createOrbParticles,
  orbParticleCountForSize,
  renderOrbFrame,
  type OrbParticle,
} from "./thinking-orb-engine.js";
import type { ThinkingOrbProps, ThinkingOrbState } from "./thinking-orb.types.js";
import {
  THINKING_ORB_STATE_LABELS,
  thinkingOrbFrameVariants,
  thinkingOrbLabelVariants,
  thinkingOrbRootVariants,
} from "./thinking-orb.variants.js";

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

const ThinkingOrbCaption = ({ label }: { label: string }) => (
  <span data-slot="thinking-orb-label" className={thinkingOrbLabelVariants()}>
    {label}
  </span>
);

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
        {p.canvasNode}
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
        {p.canvasNode}
      </span>
      <ThinkingOrbCaption label={p.resolvedLabel} />
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
  const frameSize = opts.variant === "minimal" ? opts.size : opts.size + 12;
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
          className="block"
          style={{ width: opts.size, height: opts.size }}
        />
      }
    />
  );
};
