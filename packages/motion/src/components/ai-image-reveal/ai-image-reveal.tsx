"use client";

/**
 * AiImageReveal：AI 图像生成显影组件，呈现粒子云呼吸等待、聚拢降噪马赛克到高清柔焦显影的完整过程。
 */
import { cn } from "@matt-ui/utils";
import { motion, useReducedMotion } from "motion/react";
import { forwardRef, useImperativeHandle, useRef, type ReactNode } from "react";
import { RevealOverlays } from "./ai-image-reveal-overlays.js";
import { useImageRevealController } from "./ai-image-reveal-state.js";
import type {
  AiImageRevealHandle,
  AiImageRevealPhase,
  AiImageRevealProps,
} from "./ai-image-reveal.types.js";
import {
  REVEAL_EASE_OUT,
  REVEAL_SHELL_VARIANT,
  REVEAL_STAGE_RADIUS,
} from "./ai-image-reveal.variants.js";

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
    "relative w-full overflow-hidden border border-solid border-border/70 bg-muted/50 dark:border-white/10 dark:bg-white/[0.03]",
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
