"use client";

/**
 * AiImageReveal 画布驱动与图像预加载 Hook。
 */
import { useEffect, useLayoutEffect, useState } from "react";
import type { AiImageRevealPhase } from "./ai-image-reveal.types.js";
import { averageCells, createParticleField, type ParticleField } from "./particle-field.js";

/** 低饱和中性微光灰阶与克制信号色点缀的柔光显影色板 */
const DARK_PALETTE = ["#e4e4e7", "#a1a1aa", "#71717a", "#cbd5e1", "#60a5fa"];
const LIGHT_PALETTE = ["#71717a", "#a1a1aa", "#52525b", "#94a3b8", "#3b82f6"];

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
  const dur = opts.duration * 0.55;
  const elapsed = (opts.now - eng.gatherStart) / 1000;
  const done = field.draw(buf, opts.t, elapsed, dur);
  ctx.putImageData(imgData, 0, 0);
  if (!eng.refined && (done || elapsed >= dur * 0.9)) {
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
  opts: { durationRef: React.RefObject<number>; onRefine: () => void },
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
      field.stepIdle(dt, t);
      field.draw(buf, t, null, 0);
      ctx.putImageData(imgData, 0, 0);
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
