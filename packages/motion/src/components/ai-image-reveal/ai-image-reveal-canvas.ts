"use client";

/**
 * AiImageReveal 画布驱动与图像预加载 Hook：
 * 等待态渲染 AICSS 风格径向呼吸点阵矩阵，图像就绪后平滑过渡至柔焦采样凝聚与高清显影。
 */
import { useEffect, useLayoutEffect, useState } from "react";
import type { AiImageRevealPhase } from "./ai-image-reveal.types.js";
import { averageCells, createParticleField, type ParticleField } from "./particle-field.js";

const DARK_PALETTE = ["#e4e4e7", "#a1a1aa", "#71717a", "#d4d4d8"];
const LIGHT_PALETTE = ["#27272a", "#52525b", "#71717a", "#3f3f46"];

export interface RevealEngineState {
  field: ParticleField | null;
  mode: "idle" | "gather" | "hold";
  gatherStart: number;
  refined: boolean;
  kick: () => void;
}

const isDarkDocument = () => {
  if (typeof document === "undefined") return false;
  const el = document.documentElement;
  if (el.getAttribute("data-theme") === "dark" || el.classList.contains("dark")) return true;
  if (el.getAttribute("data-theme") === "light" || el.classList.contains("light")) return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
};

/** 绘制对标 AICSS Image Processing 的精密径向呼吸圆点矩阵 */
const drawRadialDotMatrix = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  dark: boolean,
) => {
  ctx.clearRect(0, 0, w, h);
  const pad = Math.min(w, h) * 0.06;
  const innerW = Math.max(1, w - pad * 2);
  const innerH = Math.max(1, h - pad * 2);
  const step = Math.max(11, Math.min(18, Math.round(Math.min(w, h) / 17)));
  const cols = Math.max(6, Math.floor(innerW / step));
  const rows = Math.max(6, Math.floor(innerH / step));
  const startX = (w - (cols - 1) * step) / 2;
  const startY = (h - (rows - 1) * step) / 2;
  const cx = w / 2;
  const cy = h / 2;
  const maxDist = Math.hypot(innerW / 2, innerH / 2) || 1;
  const rgb = dark ? "244, 244, 245" : "24, 24, 27";

  for (let r = 0; r < rows; r += 1) {
    const y = startY + r * step;
    for (let c = 0; c < cols; c += 1) {
      const x = startX + c * step;
      const normDist = Math.hypot(x - cx, y - cy) / maxDist;
      const radial = Math.exp(-(normDist * normDist) * 3.4);
      const wave = 0.5 + 0.5 * Math.sin(normDist * 7.2 - t * 3.1);
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.9 + c * 0.35 + r * 0.35);
      const alpha = Math.min(
        0.92,
        Math.max(0.055, radial * (0.36 + wave * 0.54) + 0.045 + pulse * 0.04 * radial),
      );
      const dotR = Math.max(0.85, (0.9 + radial * (0.75 + wave * 0.55)) * (step / 15));
      ctx.beginPath();
      ctx.arc(x, y, dotR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
      ctx.fill();
    }
  }
};

const sampleImageCells = (img: HTMLImageElement, w: number, h: number, cell: number) => {
  try {
    const offscreen = document.createElement("canvas");
    offscreen.width = w;
    offscreen.height = h;
    const g = offscreen.getContext("2d", { willReadFrequently: true });
    if (!g) return null;
    const scale = Math.max(w / Math.max(1, img.naturalWidth), h / Math.max(1, img.naturalHeight));
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    g.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    return averageCells(g.getImageData(0, 0, w, h).data, w, h, cell);
  } catch {
    return null;
  }
};

export const useRevealBoxSize = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      if (w && h) setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    sync();
    if (typeof ResizeObserver !== "function") return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
};

const stepGatherFrame = (
  eng: RevealEngineState,
  field: ParticleField,
  buf: Uint32Array,
  ctx: CanvasRenderingContext2D,
  imgData: ImageData,
  opts: { now: number; t: number; duration: number; onRefine: () => void },
): boolean => {
  if (eng.gatherStart < 0) eng.gatherStart = opts.now;
  const dur = opts.duration * 0.44;
  const elapsed = (opts.now - eng.gatherStart) / 1000;
  const done = field.draw(buf, opts.t, elapsed, dur);
  ctx.putImageData(imgData, 0, 0);
  if (!eng.refined && (done || elapsed >= dur * 0.88)) {
    eng.refined = true;
    opts.onRefine();
  }
  if (done) eng.mode = "hold";
  return done;
};

const startParticleAnimation = (
  ctx: CanvasRenderingContext2D,
  field: ParticleField,
  imgData: ImageData,
  eng: RevealEngineState,
  opts: { w: number; h: number; durationRef: React.RefObject<number>; onRefine: () => void },
) => {
  const buf = new Uint32Array(imgData.data.buffer);
  let raf = 0;
  let last = performance.now();
  let t = 0;
  const stop = () => {
    window.cancelAnimationFrame(raf);
    raf = 0;
  };
  const frame = (now: number) => {
    raf = window.requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    if (eng.mode === "idle") {
      drawRadialDotMatrix(ctx, opts.w, opts.h, t, isDarkDocument());
    } else if (eng.mode === "gather") {
      const done = stepGatherFrame(eng, field, buf, ctx, imgData, {
        now,
        t,
        duration: opts.durationRef.current,
        onRefine: opts.onRefine,
      });
      if (done) stop();
    }
  };
  const start = () => {
    if (raf || eng.mode === "hold") return;
    last = performance.now();
    raf = window.requestAnimationFrame(frame);
  };
  eng.kick = start;
  start();
  return () => {
    stop();
    eng.kick = () => {};
  };
};

export const runCanvasLoop = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  eng: RevealEngineState,
  opts: {
    w: number;
    h: number;
    density: number;
    colors?: string[];
    durationRef: React.RefObject<number>;
    onRefine: () => void;
  },
) => {
  const maxP = Math.min(20000, Math.max(1500, 8000 * opts.density));
  const cell = Math.min(16, Math.max(3, Math.round(Math.sqrt((opts.w * opts.h) / maxP))));
  canvas.width = opts.w;
  canvas.height = opts.h;
  const palette = opts.colors?.length
    ? opts.colors
    : isDarkDocument()
      ? DARK_PALETTE
      : LIGHT_PALETTE;
  const field = createParticleField({ width: opts.w, height: opts.h, cell, colors: palette });
  eng.field = field;
  if (eng.mode === "gather") eng.mode = "idle";
  return startParticleAnimation(ctx, field, ctx.createImageData(opts.w, opts.h), eng, opts);
};

export const useImageLoaderEffect = (
  engineRef: React.RefObject<RevealEngineState>,
  opts: {
    src?: string | null;
    waiting: boolean;
    runId: number;
    w: number;
    h: number;
    crossOrigin: "" | "anonymous" | "use-credentials";
    reduce: boolean;
    onPhase: (phase: AiImageRevealPhase, src: string | null) => void;
    onError: () => void;
  },
) => {
  const { src, waiting, runId, w, h, crossOrigin, reduce, onPhase, onError } = opts;

  useEffect(() => {
    const eng = engineRef.current;
    eng.mode = "idle";
    eng.refined = false;
    eng.kick();
    if (runId < 0 || !src || waiting || !w) return;

    let alive = true;
    const img = new Image();
    if (crossOrigin) img.crossOrigin = crossOrigin;
    img.decoding = "async";
    const handleError = () => {
      if (!alive) return;
      onPhase("error", null);
      onError();
    };
    const handleLoad = () => {
      if (!alive) return;
      if (reduce || !eng.field) return onPhase("refine", src);
      eng.field.setTargets(sampleImageCells(img, w, h, eng.field.cell));
      eng.gatherStart = -1;
      eng.refined = false;
      eng.mode = "gather";
      onPhase("gather", src);
      eng.kick();
    };
    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);
    img.src = src;
    return () => {
      alive = false;
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [engineRef, src, waiting, runId, w, h, crossOrigin, reduce, onPhase, onError]);
};
