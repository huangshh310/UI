"use client";

/**
 * AiImageReveal：AI 图像生成显影组件，呈现粒子云呼吸等待、聚拢降噪马赛克到高清柔焦显影的完整过程。
 */
import { cn } from "@matt-ui/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useImageRevealController } from "./ai-image-reveal-state.js";
import type {
  AiImageRevealHandle,
  AiImageRevealPhase,
  AiImageRevealProps,
} from "./ai-image-reveal.types.js";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const RevealStatusPill = ({ label }: { label: string }) => (
  <motion.div
    key="reveal-status"
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 4, transition: { duration: 0.2 } }}
    transition={{ duration: 0.28, ease: EASE_OUT }}
    className="absolute bottom-3 left-3 inline-flex h-8 items-center gap-2 rounded-full border border-solid border-border/80 bg-card/85 px-3 text-xs font-medium text-foreground shadow-xs backdrop-blur-md"
  >
    <span className="relative flex size-2">
      <span className="absolute inset-0 animate-ping rounded-full bg-foreground/45 motion-reduce:hidden" />
      <span className="relative size-2 rounded-full bg-foreground" />
    </span>
    <span>{label}</span>
  </motion.div>
);

const RevealErrorOverlay = ({ onRetry }: { onRetry: () => void }) => (
  <div
    role="alert"
    className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
  >
    <p className="m-0 text-xs text-muted-foreground">图像加载失败，请重试。</p>
    <button
      type="button"
      onClick={onRetry}
      className="h-8.5 cursor-pointer rounded-full border-0 bg-primary px-4 font-sans text-xs font-medium text-primary-foreground transition-transform active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      重新生成
    </button>
  </div>
);

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
      transition={{ duration: shown ? refineSec : 0.25, ease: EASE_OUT }}
    />
  );
};

const RevealOverlays = ({
  phase,
  reduce,
  generatingLabel,
  onRetry,
}: {
  phase: AiImageRevealPhase;
  reduce: boolean;
  generatingLabel: string;
  onRetry: () => void;
}) => {
  const pending = phase === "idle" || phase === "gather";
  return (
    <>
      {reduce && pending && (
        <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-foreground/[0.06]" />
      )}
      <AnimatePresence>{pending && <RevealStatusPill label={generatingLabel} />}</AnimatePresence>
      {phase === "error" && <RevealErrorOverlay onRetry={onRetry} />}
    </>
  );
};

const RevealStageBody = ({
  loadedSrc,
  alt,
  phase,
  reduce,
  refineSec,
  generatingLabel,
  canvasRef,
  onRetry,
}: {
  loadedSrc: string | null;
  alt: string;
  phase: AiImageRevealPhase;
  reduce: boolean;
  refineSec: number;
  generatingLabel: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onRetry: () => void;
}) => {
  const shown = phase === "refine" || phase === "done";
  return (
    <>
      <RevealImageLayer
        loadedSrc={loadedSrc}
        alt={alt}
        shown={shown}
        reduce={reduce}
        refineSec={refineSec}
      />
      <motion.canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          imageRendering: "pixelated",
          visibility: phase === "done" || reduce ? "hidden" : "visible",
        }}
        initial={false}
        animate={{ opacity: shown ? 0 : 1 }}
        transition={{ duration: shown ? refineSec * 0.85 : 0.25, ease: "easeOut" }}
        className="absolute inset-0 size-full"
      />
      <RevealOverlays
        phase={phase}
        reduce={reduce}
        generatingLabel={generatingLabel}
        onRetry={onRetry}
      />
    </>
  );
};

const extractRevealOptions = (props: AiImageRevealProps) => {
  const {
    src,
    alt,
    generating,
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
    view: { alt, aspectRatio, prompt, generatingLabel, duration, className, rest },
  };
};

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
        aria-busy={phase === "idle" || phase === "gather"}
        className={cn("m-0 w-full", view.className)}
      >
        <div
          ref={boxRef}
          style={{ aspectRatio: String(view.aspectRatio) }}
          className="relative w-full overflow-hidden rounded-[20px] border border-solid border-border/75 bg-secondary/45"
        >
          <RevealStageBody
            loadedSrc={loadedSrc}
            alt={view.alt}
            phase={phase}
            reduce={reduce}
            refineSec={reduce ? 0.3 : view.duration * 0.4}
            generatingLabel={view.generatingLabel}
            canvasRef={canvasRef}
            onRetry={replay}
          />
        </div>
        {view.prompt && (
          <figcaption className="mt-2.5 px-1 text-xs leading-snug text-muted-foreground">
            {view.prompt}
          </figcaption>
        )}
        <output className="sr-only" aria-live="polite">
          {phase === "done" ? `图像已生成：${view.alt}` : view.generatingLabel}
        </output>
      </figure>
    );
  },
);
