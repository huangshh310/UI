// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiImageReveal：AI 图像生成显影组件，呈现粒子云呼吸等待、聚拢降噪马赛克到高清柔焦显影的完整过程。
 */

import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export const REVEAL_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const REVEAL_EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const REVEAL_SHELL_VARIANT: Record<AiImageRevealVariant, string> = {
  default: "",
  framed:
    "rounded-[26px] border border-solid border-border/80 bg-card/92 p-2 shadow-[0_14px_36px_-14px_rgba(0,0,0,0.14)] dark:border-white/10 dark:bg-card/85 dark:shadow-[0_20px_48px_-14px_rgba(0,0,0,0.72)]",
  glass:
    "rounded-[26px] border border-solid border-border/75 bg-popover/86 p-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-popover/78",
};

export const REVEAL_STAGE_RADIUS: Record<AiImageRevealRadius, string> = {
  md: "rounded-2xl",
  lg: "rounded-[20px]",
  xl: "rounded-3xl",
};
export type AiImageRevealPhase = "idle" | "gather" | "refine" | "done" | "error";

export type AiImageRevealVariant = "default" | "framed" | "glass";

export type AiImageRevealRadius = "md" | "lg" | "xl";

export interface AiImageRevealHandle {
  /** 重新播放当前图像的粒子聚拢与降噪显影序列 */
  replay: () => void;
}

export interface AiImageRevealProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** 生成完成的目标图片地址；留空时保持粒子云等待态 */
  src?: string | null;
  /** 图片替代描述文本 */
  alt: string;
  /** 强制处于生成等待态（默认在 src 为空时自动等待） */
  generating?: boolean;
  /** 展示变体：default 极简画框、framed 画廊相框卡、glass 毛玻璃悬浮框，默认 default */
  variant?: AiImageRevealVariant;
  /** 画幅圆角等级，默认 lg */
  radius?: AiImageRevealRadius;
  /** 可选左上角毛玻璃角标（如分辨率或模型标识） */
  badge?: string;
  /** 显影完成后是否在右上角提供内联重播按钮，默认 false */
  showReplayButton?: boolean;
  /** 显影完成后悬浮于右下角的自定义操作槽（如下载、放大） */
  actions?: ReactNode;
  /** 画幅宽高比（宽 / 高），默认 1（正方形） */
  aspectRatio?: number;
  /** 展示在画幅下方的提示词说明 */
  prompt?: string;
  /** 等待态状态胶囊文案（默认「正在生成图像…」） */
  generatingLabel?: string;
  /** 等待态粒子云调色板（#rrggbb 数组），留空时自动匹配当前明暗主题 */
  colors?: string[];
  /** 粒子密度倍率（0.4 – 2），越大马赛克越精细，默认 1 */
  density?: number;
  /** 完整粒子聚拢至高清显影时长（秒），默认 2.8 */
  duration?: number;
  crossOrigin?: "anonymous" | "use-credentials" | "";
  onReveal?: () => void;
  onImageError?: () => void;
}
const DARK_PALETTE = ["#93c5fd", "#6ee7b7", "#fcd34d", "#f9a8d4", "#d4d4d8"];
const LIGHT_PALETTE = ["#155dfc", "#0f766e", "#d97706", "#e11d48", "#27272a"];

interface RevealEngineState {
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

const useRevealBoxSize = (ref: React.RefObject<HTMLDivElement | null>) => {
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

const runCanvasLoop = (
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

const useImageLoaderEffect = (
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
const RevealStatusPill = ({ label }: { label: string }) => (
  <motion.div
    key="reveal-status"
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 4, transition: { duration: 0.2 } }}
    transition={{ duration: 0.28, ease: REVEAL_EASE_OUT }}
    className="absolute bottom-3 left-3 inline-flex h-8 items-center gap-2 rounded-full border border-solid border-border/80 bg-popover/92 px-3 text-xs font-medium text-popover-foreground shadow-sm backdrop-blur-xl dark:border-white/12"
  >
    <span className="relative flex size-2">
      <span className="absolute inset-0 animate-ping rounded-full bg-signal/45 motion-reduce:hidden" />
      <span className="relative size-2 rounded-full bg-signal" />
    </span>
    <span>{label}</span>
  </motion.div>
);

const RevealErrorOverlay = ({ onRetry }: { onRetry: () => void }) => (
  <div
    role="alert"
    className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 px-6 text-center backdrop-blur-md"
  >
    <p className="m-0 rounded-lg border border-solid border-destructive/35 bg-destructive/8 px-3 py-1.5 text-xs text-foreground dark:border-destructive dark:bg-destructive/14">
      图像加载失败，请重试。
    </p>
    <button
      type="button"
      onClick={onRetry}
      className={cn(
        "h-8 cursor-pointer rounded-full border border-solid border-transparent bg-primary px-4 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-transform active:scale-[0.97]",
        REVEAL_FOCUS_RING,
      )}
    >
      重新生成
    </button>
  </div>
);

const RevealDoneControls = ({
  showReplayButton,
  actions,
  onRetry,
}: {
  showReplayButton: boolean;
  actions?: ReactNode;
  onRetry: () => void;
}) => (
  <>
    {showReplayButton && (
      <button
        type="button"
        aria-label="重播显影动画"
        onClick={onRetry}
        className={cn(
          "absolute top-3 right-3 inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border border-solid border-border/75 bg-popover/90 px-2.5 font-sans text-[11px] font-medium text-popover-foreground shadow-xs backdrop-blur-xl transition-colors hover:bg-popover dark:border-white/12",
          REVEAL_FOCUS_RING,
        )}
      >
        <RotateCcw aria-hidden="true" className="size-3" />
        <span>重播</span>
      </button>
    )}
    {actions && (
      <div className="absolute right-3 bottom-3 flex items-center gap-1.5">{actions}</div>
    )}
  </>
);

interface RevealOverlaysProps {
  phase: AiImageRevealPhase;
  reduce: boolean;
  generatingLabel: string;
  badge?: string;
  showReplayButton: boolean;
  actions?: ReactNode;
  onRetry: () => void;
}

const RevealOverlays = (p: RevealOverlaysProps) => {
  const pending = p.phase === "idle" || p.phase === "gather";
  return (
    <>
      {p.badge && (
        <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center rounded-full border border-solid border-border/75 bg-popover/88 px-2.5 py-0.5 font-mono text-[10px] font-medium text-popover-foreground shadow-xs backdrop-blur-xl dark:border-white/12">
          {p.badge}
        </span>
      )}
      {p.phase === "done" && (
        <RevealDoneControls
          showReplayButton={p.showReplayButton}
          actions={p.actions}
          onRetry={p.onRetry}
        />
      )}
      {p.reduce && pending && (
        <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-foreground/[0.06]" />
      )}
      <AnimatePresence>{pending && <RevealStatusPill label={p.generatingLabel} />}</AnimatePresence>
      {p.phase === "error" && <RevealErrorOverlay onRetry={p.onRetry} />}
    </>
  );
};
interface RevealControllerInput {
  src?: string | null;
  generating?: boolean;
  colors?: string[];
  density: number;
  duration: number;
  crossOrigin: "" | "anonymous" | "use-credentials";
  reduce: boolean;
  onReveal?: () => void;
  onImageError?: () => void;
}

const useLatestRevealRefs = (input: RevealControllerInput) => {
  const durationRef = useRef(input.duration);
  const callbacksRef = useRef({ onReveal: input.onReveal, onImageError: input.onImageError });
  useEffect(() => {
    durationRef.current = input.duration;
    callbacksRef.current = { onReveal: input.onReveal, onImageError: input.onImageError };
  }, [input.duration, input.onReveal, input.onImageError]);
  return { durationRef, callbacksRef };
};

const useCanvasLoopEffect = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  engineRef: React.RefObject<RevealEngineState>,
  size: { w: number; h: number },
  input: RevealControllerInput,
  durationRef: React.RefObject<number>,
  onRefine: () => void,
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !size.w || !size.h || input.reduce) return;
    return runCanvasLoop(canvas, ctx, engineRef.current, {
      w: size.w,
      h: size.h,
      density: input.density,
      colors: input.colors,
      durationRef,
      onRefine,
    });
  }, [
    canvasRef,
    engineRef,
    size.w,
    size.h,
    input.density,
    input.colors,
    input.reduce,
    durationRef,
    onRefine,
  ]);
};

const useRefineFinishEffect = (phase: AiImageRevealPhase, delayMs: number, onDone: () => void) => {
  useEffect(() => {
    if (phase !== "refine") return;
    const id = window.setTimeout(onDone, delayMs);
    return () => window.clearTimeout(id);
  }, [phase, delayMs, onDone]);
};

const useRevealPhaseActions = (
  cycleKey: string,
  callbacksRef: React.RefObject<{ onReveal?: () => void; onImageError?: () => void }>,
  setState: React.Dispatch<
    React.SetStateAction<{ key: string; phase: AiImageRevealPhase; loadedSrc: string | null }>
  >,
) => {
  const handleRefine = useCallback(
    () => setState((p) => ({ key: cycleKey, phase: "refine", loadedSrc: p.loadedSrc })),
    [cycleKey, setState],
  );
  const handleDone = useCallback(() => {
    setState((p) => ({ key: cycleKey, phase: "done", loadedSrc: p.loadedSrc }));
    callbacksRef.current.onReveal?.();
  }, [cycleKey, callbacksRef, setState]);
  const handlePhase = useCallback(
    (p: AiImageRevealPhase, s: string | null) =>
      setState({ key: cycleKey, phase: p, loadedSrc: s }),
    [cycleKey, setState],
  );
  const handleError = useCallback(() => callbacksRef.current.onImageError?.(), [callbacksRef]);
  return { handleRefine, handleDone, handlePhase, handleError };
};

const useImageRevealController = (
  boxRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  input: RevealControllerInput,
) => {
  const size = useRevealBoxSize(boxRef);
  const [runId, setRunId] = useState(0);
  const [state, setState] = useState<{
    key: string;
    phase: AiImageRevealPhase;
    loadedSrc: string | null;
  }>({ key: "", phase: "idle", loadedSrc: null });

  const waiting = input.generating ?? !input.src;
  const cycleKey = `${waiting ? "wait" : (input.src ?? "")}:${runId}`;
  const phase: AiImageRevealPhase = !waiting && state.key === cycleKey ? state.phase : "idle";
  const loadedSrc = !waiting && state.key === cycleKey ? state.loadedSrc : null;
  const { durationRef, callbacksRef } = useLatestRevealRefs(input);
  const engineRef = useRef<RevealEngineState>({
    field: null,
    mode: "idle",
    gatherStart: -1,
    refined: false,
    kick: () => {},
  });

  const replay = useCallback(() => setRunId((n) => n + 1), []);
  const { handleRefine, handleDone, handlePhase, handleError } = useRevealPhaseActions(
    cycleKey,
    callbacksRef,
    setState,
  );

  useCanvasLoopEffect(canvasRef, engineRef, size, input, durationRef, handleRefine);
  useImageLoaderEffect(engineRef, {
    ...input,
    waiting,
    runId,
    w: size.w,
    h: size.h,
    onPhase: handlePhase,
    onError: handleError,
  });
  useRefineFinishEffect(phase, (input.reduce ? 0.3 : input.duration * 0.4) * 1000, handleDone);

  return { phase, loadedSrc, replay };
};
interface ParticleField {
  readonly count: number;
  readonly cols: number;
  readonly rows: number;
  readonly cell: number;
  stepIdle: (dt: number, t: number) => void;
  setTargets: (rgb: ArrayLike<number> | null) => void;
  draw: (out: Uint32Array, t: number, elapsed: number | null, duration: number) => boolean;
}

const TAU = Math.PI * 2;
const clampVal = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);
const easeCubic = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);

const createPrng = (initialSeed: number) => {
  let seed = initialSeed;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const parseHexRgb = (hex: string): [number, number, number] => {
  const n = Number.parseInt(hex.replace("#", "").slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const packRgba = (r: number, g: number, b: number, a: number) =>
  ((a & 255) << 24) | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255);

const paintBlock = (
  out: Uint32Array,
  w: number,
  h: number,
  x: number,
  y: number,
  s: number,
  color: number,
) => {
  const ps = s < 1.5 ? 1 : Math.round(s);
  const x0 = Math.round(x - ps / 2);
  const y0 = Math.round(y - ps / 2);
  const xa = Math.max(0, x0);
  const ya = Math.max(0, y0);
  const xb = Math.min(w, x0 + ps);
  const yb = Math.min(h, y0 + ps);
  for (let yy = ya; yy < yb; yy++) {
    const row = yy * w;
    for (let xx = xa; xx < xb; xx++) out[row + xx] = color;
  }
};

interface FieldBuffers {
  px: Float32Array;
  py: Float32Array;
  sx: Float32Array;
  sy: Float32Array;
  tx: Float32Array;
  ty: Float32Array;
  delay: Float32Array;
  arc: Float32Array;
  nz: Float32Array;
  ph: Float32Array;
  size: Float32Array;
  ir: Uint8Array;
  ig: Uint8Array;
  ib: Uint8Array;
  tr: Uint8Array;
  tg: Uint8Array;
  tb: Uint8Array;
  perm: Uint32Array;
}

const allocateBuffers = (n: number): FieldBuffers => ({
  px: new Float32Array(n),
  py: new Float32Array(n),
  sx: new Float32Array(n),
  sy: new Float32Array(n),
  tx: new Float32Array(n),
  ty: new Float32Array(n),
  delay: new Float32Array(n),
  arc: new Float32Array(n),
  nz: new Float32Array(n),
  ph: new Float32Array(n),
  size: new Float32Array(n),
  ir: new Uint8Array(n),
  ig: new Uint8Array(n),
  ib: new Uint8Array(n),
  tr: new Uint8Array(n),
  tg: new Uint8Array(n),
  tb: new Uint8Array(n),
  perm: new Uint32Array(n),
});

const initBuffers = (
  n: number,
  w: number,
  h: number,
  palette: [number, number, number][],
  rnd: () => number,
): FieldBuffers => {
  const b = allocateBuffers(n);
  const sigma = Math.min(w, h) * 0.2;
  const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.min(0.9999, rnd()))) * Math.cos(TAU * rnd());
  for (let i = 0; i < n; i++) {
    b.perm[i] = i;
    b.px[i] = w / 2 + gauss() * sigma * 1.15;
    b.py[i] = h / 2 + gauss() * sigma;
    b.ph[i] = rnd() * TAU;
    b.size[i] = 1 + rnd() * 1.6;
    b.delay[i] = rnd();
    b.arc[i] = rnd() * 2 - 1;
    b.nz[i] = rnd() * 2 - 1;
    const c = palette[Math.floor(rnd() * palette.length)]!;
    b.ir[i] = c[0];
    b.ig[i] = c[1];
    b.ib[i] = c[2];
  }
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = b.perm[i]!;
    b.perm[i] = b.perm[j]!;
    b.perm[j] = tmp;
  }
  return b;
};

const lerpByte = (a: number, bVal: number, e: number, noise: number) =>
  clampVal(a + (bVal - a) * e + noise, 0, 255) | 0;

const paintSingleGather = (
  b: FieldBuffers,
  out: Uint32Array,
  i: number,
  u: number,
  dims: { w: number; h: number; cell: number },
) => {
  const e = easeCubic(u);
  const dx = b.tx[i]! - b.sx[i]!;
  const dy = b.ty[i]! - b.sy[i]!;
  const len = Math.hypot(dx, dy) || 1;
  const bow = b.arc[i]! * Math.sin(Math.PI * e) * len * 0.2;
  const x = e >= 1 ? b.tx[i]! : b.sx[i]! + dx * e + (-dy / len) * bow;
  const y = e >= 1 ? b.ty[i]! : b.sy[i]! + dy * e + (dx / len) * bow;
  const s = b.size[i]! + (dims.cell - b.size[i]!) * e * e;
  const noise = b.nz[i]! * 76 * (1 - e);
  const color = packRgba(
    lerpByte(b.ir[i]!, b.tr[i]!, e, noise),
    lerpByte(b.ig[i]!, b.tg[i]!, e, noise),
    lerpByte(b.ib[i]!, b.tb[i]!, e, noise),
    150 + 105 * e,
  );
  paintBlock(out, dims.w, dims.h, x, y, s, color);
};

const drawGatherParticles = (
  b: FieldBuffers,
  out: Uint32Array,
  opts: { n: number; w: number; h: number; cell: number; elapsed: number; duration: number },
) => {
  const travel = Math.max(0.01, opts.duration * 0.72);
  const maxDelay = opts.duration * 0.28;
  let done = true;
  for (let i = 0; i < opts.n; i++) {
    const u = clampVal((opts.elapsed - b.delay[i]! * maxDelay) / travel, 0, 1);
    if (u < 1) done = false;
    paintSingleGather(b, out, i, u, opts);
  }
  return done;
};

const stepIdleBuffer = (
  b: FieldBuffers,
  n: number,
  cx: number,
  cy: number,
  dt: number,
  t: number,
) => {
  for (let i = 0; i < n; i++) {
    const dx = b.px[i]! - cx;
    const dy = b.py[i]! - cy;
    const ph = b.ph[i]!;
    b.px[i] =
      b.px[i]! + (-dy * 0.16 + Math.sin(b.py[i]! * 0.021 + t * 0.55 + ph) * 28 - dx * 0.2) * dt;
    b.py[i] =
      b.py[i]! + (dx * 0.16 + Math.cos(b.px[i]! * 0.018 - t * 0.47 + ph) * 28 - dy * 0.2) * dt;
  }
};

const assignBufferTargets = (
  b: FieldBuffers,
  opts: { n: number; cols: number; cell: number; palette: [number, number, number][] },
  rgb: ArrayLike<number> | null,
) => {
  for (let i = 0; i < opts.n; i++) {
    const c = b.perm[i]!;
    const col = c % opts.cols;
    const row = (c / opts.cols) | 0;
    b.tx[i] = (col + 0.5) * opts.cell;
    b.ty[i] = (row + 0.5) * opts.cell;
    b.sx[i] = b.px[i]!;
    b.sy[i] = b.py[i]!;
    const fb = opts.palette[(col + row) % opts.palette.length]!;
    b.tr[i] = rgb ? (rgb[c * 3] ?? fb[0]) : fb[0];
    b.tg[i] = rgb ? (rgb[c * 3 + 1] ?? fb[1]) : fb[1];
    b.tb[i] = rgb ? (rgb[c * 3 + 2] ?? fb[2]) : fb[2];
  }
};

const drawIdleBuffer = (
  b: FieldBuffers,
  out: Uint32Array,
  n: number,
  w: number,
  h: number,
  t: number,
) => {
  for (let i = 0; i < n; i++) {
    const tw = 0.5 + 0.5 * Math.sin(t * 1.4 + b.ph[i]! * 3);
    paintBlock(
      out,
      w,
      h,
      b.px[i]!,
      b.py[i]!,
      b.size[i]!,
      packRgba(b.ir[i]!, b.ig[i]!, b.ib[i]!, 90 + 150 * tw),
    );
  }
};

const createParticleField = (opts: {
  width: number;
  height: number;
  cell: number;
  colors: string[];
  seed?: number;
}): ParticleField => {
  const { width: w, height: h, cell } = opts;
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const n = cols * rows;
  const palette = (opts.colors.length ? opts.colors : ["#888888"]).map(parseHexRgb);
  const b = initBuffers(n, w, h, palette, createPrng(opts.seed ?? 7));

  return {
    count: n,
    cols,
    rows,
    cell,
    stepIdle: (dt, t) => stepIdleBuffer(b, n, w / 2, h / 2, dt, t),
    setTargets: (rgb) => assignBufferTargets(b, { n, cols, cell, palette }, rgb),
    draw(out, t, elapsed, duration) {
      out.fill(0);
      if (elapsed === null) {
        drawIdleBuffer(b, out, n, w, h, t);
        return false;
      }
      return drawGatherParticles(b, out, { n, w, h, cell, elapsed, duration });
    },
  };
};

const sampleSingleCell = (
  data: ArrayLike<number>,
  w: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  step: number,
): [number, number, number] => {
  let r = 0;
  let g = 0;
  let bl = 0;
  let count = 0;
  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const o = (y * w + x) * 4;
      r += data[o] ?? 0;
      g += data[o + 1] ?? 0;
      bl += data[o + 2] ?? 0;
      count++;
    }
  }
  const denom = count || 1;
  return [r / denom, g / denom, bl / denom];
};

/** 计算目标 RGBA 像素数组每个 cell×cell 网格的平均 RGB */
const averageCells = (data: ArrayLike<number>, w: number, h: number, cell: number): Uint8Array => {
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const out = new Uint8Array(cols * rows * 3);
  const step = Math.max(1, Math.floor(cell / 4));
  for (let cy = 0; cy < rows; cy++) {
    const y0 = cy * cell;
    const y1 = Math.min(h, y0 + cell);
    for (let cx = 0; cx < cols; cx++) {
      const x0 = cx * cell;
      const [r, g, bl] = sampleSingleCell(data, w, x0, y0, Math.min(w, x0 + cell), y1, step);
      const k = (cy * cols + cx) * 3;
      out[k] = r;
      out[k + 1] = g;
      out[k + 2] = bl;
    }
  }
  return out;
};
const RevealImageLayer = ({
  loadedSrc,
  alt,
  shown,
  reduce,
  refineSec,
}: {
  loadedSrc: string | null;
  alt: string;
  shown: boolean;
  reduce: boolean;
  refineSec: number;
}) => {
  if (!loadedSrc) return null;
  const hidden = {
    opacity: 0,
    filter: reduce ? "blur(0px)" : "blur(20px)",
    scale: reduce ? 1 : 1.04,
  };
  return (
    <motion.img
      src={loadedSrc}
      alt={shown ? alt : ""}
      draggable={false}
      className="absolute inset-0 size-full object-cover"
      initial={false}
      animate={shown ? { opacity: 1, filter: "blur(0px)", scale: 1 } : hidden}
      transition={{ duration: shown ? refineSec : 0.25, ease: REVEAL_EASE_OUT }}
    />
  );
};

interface RevealStageBodyProps {
  loadedSrc: string | null;
  alt: string;
  phase: AiImageRevealPhase;
  reduce: boolean;
  refineSec: number;
  generatingLabel: string;
  badge?: string;
  showReplayButton: boolean;
  actions?: ReactNode;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onRetry: () => void;
}

const RevealStageBody = ({ canvasRef, ...p }: RevealStageBodyProps) => {
  const shown = p.phase === "refine" || p.phase === "done";
  return (
    <>
      <RevealImageLayer
        loadedSrc={p.loadedSrc}
        alt={p.alt}
        shown={shown}
        reduce={p.reduce}
        refineSec={p.refineSec}
      />
      <motion.canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          imageRendering: "pixelated",
          visibility: p.phase === "done" || p.reduce ? "hidden" : "visible",
        }}
        initial={false}
        animate={{ opacity: shown ? 0 : 1 }}
        transition={{ duration: shown ? p.refineSec * 0.85 : 0.25, ease: "easeOut" }}
        className="absolute inset-0 size-full"
      />
      <RevealOverlays
        phase={p.phase}
        reduce={p.reduce}
        generatingLabel={p.generatingLabel}
        badge={p.badge}
        showReplayButton={p.showReplayButton}
        actions={p.actions}
        onRetry={p.onRetry}
      />
    </>
  );
};

const extractRevealOptions = (props: AiImageRevealProps) => {
  const {
    src,
    alt,
    generating,
    variant = "default",
    radius = "lg",
    badge,
    showReplayButton = false,
    actions,
    aspectRatio = 1,
    prompt,
    generatingLabel = "正在生成图像…",
    colors,
    density = 1,
    duration = 2.8,
    crossOrigin = "anonymous",
    onReveal,
    onImageError,
    className,
    ...rest
  } = props;
  return {
    ctrlInput: { src, generating, colors, density, duration, crossOrigin, onReveal, onImageError },
    view: {
      alt,
      variant,
      radius,
      badge,
      showReplayButton,
      actions,
      aspectRatio,
      prompt,
      generatingLabel,
      duration,
      className,
      rest,
    },
  };
};

type RevealViewOptions = ReturnType<typeof extractRevealOptions>["view"];

const RevealCaption = ({
  prompt,
  phase,
  alt,
  generatingLabel,
}: {
  prompt?: string;
  phase: AiImageRevealPhase;
  alt: string;
  generatingLabel: string;
}) => (
  <>
    {prompt && (
      <figcaption className="mt-2.5 px-1.5 pb-0.5 text-xs leading-snug text-muted-foreground">
        {prompt}
      </figcaption>
    )}
    <output className="sr-only" aria-live="polite">
      {phase === "done" ? `图像已生成：${alt}` : generatingLabel}
    </output>
  </>
);

const buildStageClass = (radius: RevealViewOptions["radius"]) =>
  cn(
    "relative w-full overflow-hidden border border-solid border-border/75 bg-secondary/45 dark:border-white/10",
    REVEAL_STAGE_RADIUS[radius],
  );

export const AiImageReveal = forwardRef<AiImageRevealHandle, AiImageRevealProps>(
  function AiImageReveal(props, ref) {
    const reduce = Boolean(useReducedMotion());
    const boxRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { ctrlInput, view } = extractRevealOptions(props);
    const { phase, loadedSrc, replay } = useImageRevealController(boxRef, canvasRef, {
      ...ctrlInput,
      reduce,
    });
    useImperativeHandle(ref, () => ({ replay }), [replay]);

    return (
      <figure
        {...view.rest}
        data-slot="ai-image-reveal"
        data-phase={phase}
        data-variant={view.variant}
        aria-busy={phase === "idle" || phase === "gather"}
        className={cn("m-0 w-full", REVEAL_SHELL_VARIANT[view.variant], view.className)}
      >
        <div
          ref={boxRef}
          style={{ aspectRatio: String(view.aspectRatio) }}
          className={buildStageClass(view.radius)}
        >
          <RevealStageBody
            loadedSrc={loadedSrc}
            alt={view.alt}
            phase={phase}
            reduce={reduce}
            refineSec={reduce ? 0.3 : view.duration * 0.4}
            generatingLabel={view.generatingLabel}
            badge={view.badge}
            showReplayButton={view.showReplayButton}
            actions={view.actions}
            canvasRef={canvasRef}
            onRetry={replay}
          />
        </div>
        <RevealCaption
          prompt={view.prompt}
          phase={phase}
          alt={view.alt}
          generatingLabel={view.generatingLabel}
        />
      </figure>
    );
  },
);
