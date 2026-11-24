"use client";

/**
 * AiImageReveal：对标 AICSS 极简单色语言的 AI 图像生成显影组件，
 * 呈现径向呼吸点阵等待、扫光状态标题、柔焦凝聚与渐进式光学显影。
 */
import { cn } from "@matt-ui/utils";
import { motion, useReducedMotion } from "motion/react";
import { forwardRef, useImperativeHandle, useRef, type ReactNode } from "react";
import {
  RevealAuroraBackdrop,
  RevealCaption,
  RevealOverlays,
  RevealScanCurtain,
} from "./ai-image-reveal-overlays.js";
import { useImageRevealController } from "./ai-image-reveal-state.js";
import type {
  AiImageRevealHandle,
  AiImageRevealPhase,
  AiImageRevealProps,
  AiImageRevealVariant,
} from "./ai-image-reveal.types.js";
import {
  REVEAL_EASE_OUT,
  REVEAL_SHELL_VARIANT,
  REVEAL_STAGE_RADIUS,
} from "./ai-image-reveal.variants.js";

const HIDDEN_SHARP_IMG = {
  opacity: 0,
  clipPath: "inset(0% 0% 100% 0%)",
  filter: "blur(16px)",
  scale: 1.03,
};

const SHOWN_SHARP_IMG = {
  opacity: 1,
  clipPath: "inset(0% 0% 0% 0%)",
  filter: "blur(0px)",
  scale: 1,
};

const RevealBlurBackdrop = ({
  src,
  shown,
  gathering,
  refineSec,
}: {
  src: string;
  shown: boolean;
  gathering: boolean;
  refineSec: number;
}) => {
  const opacity = shown ? 1 : gathering ? 0.48 : 0;
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none absolute inset-0 size-full object-cover"
      initial={{ opacity: 0, filter: "blur(24px)", scale: 1.06 }}
      animate={{
        opacity,
        filter: shown ? "blur(12px)" : "blur(24px)",
        scale: shown ? 1.015 : 1.06,
      }}
      transition={{ duration: shown ? refineSec * 0.85 : 0.4, ease: REVEAL_EASE_OUT }}
    />
  );
};

const RevealImageLayer = ({
  loadedSrc,
  alt,
  phase,
  reduce,
  refineSec,
}: {
  loadedSrc: string | null;
  alt: string;
  phase: AiImageRevealPhase;
  reduce: boolean;
  refineSec: number;
}) => {
  if (!loadedSrc) return null;
  const shown = phase === "refine" || phase === "done";
  const hiddenTarget = reduce ? { opacity: 0 } : HIDDEN_SHARP_IMG;

  return (
    <>
      {!reduce && (
        <RevealBlurBackdrop
          src={loadedSrc}
          shown={shown}
          gathering={phase === "gather"}
          refineSec={refineSec}
        />
      )}
      <motion.img
        src={loadedSrc}
        alt={shown ? alt : ""}
        draggable={false}
        className="absolute inset-0 size-full object-cover"
        initial={hiddenTarget}
        animate={shown ? SHOWN_SHARP_IMG : hiddenTarget}
        transition={{ duration: shown ? refineSec : 0.22, ease: REVEAL_EASE_OUT }}
      />
    </>
  );
};

interface RevealStageBodyProps {
  loadedSrc: string | null;
  alt: string;
  phase: AiImageRevealPhase;
  reduce: boolean;
  refineSec: number;
  badge?: string;
  showReplayButton: boolean;
  actions?: ReactNode;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onRetry: () => void;
}

const RevealStageBody = ({ canvasRef, ...p }: RevealStageBodyProps) => {
  const shown = p.phase === "refine" || p.phase === "done";
  const gathering = p.phase === "gather";

  return (
    <>
      <RevealAuroraBackdrop visible={!shown} reduce={p.reduce} />
      <RevealImageLayer
        loadedSrc={p.loadedSrc}
        alt={p.alt}
        phase={p.phase}
        reduce={p.reduce}
        refineSec={p.refineSec}
      />
      <motion.canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ visibility: p.phase === "done" || p.reduce ? "hidden" : "visible" }}
        initial={false}
        animate={{
          opacity: shown ? 0 : 1,
          filter: gathering ? "blur(8px)" : "blur(0px)",
        }}
        transition={{ duration: shown ? p.refineSec * 0.7 : 0.3, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 size-full"
      />
      <RevealScanCurtain phase={p.phase} reduce={p.reduce} refineSec={p.refineSec} />
      <RevealOverlays
        phase={p.phase}
        reduce={p.reduce}
        badge={p.badge}
        showReplayButton={p.showReplayButton}
        actions={p.actions}
        onRetry={p.onRetry}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/[0.06] dark:ring-white/[0.08]"
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
    generatingLabel = "正在生成图像",
    colors,
    density = 1,
    duration = 2.4,
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

const buildStageClass = (radius: RevealViewOptions["radius"], variant: AiImageRevealVariant) =>
  cn(
    "relative w-full overflow-hidden bg-neutral-50 dark:bg-[#161618]",
    variant === "default" && "shadow-xs",
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
          className={buildStageClass(view.radius, view.variant)}
        >
          <RevealStageBody
            loadedSrc={loadedSrc}
            alt={view.alt}
            phase={phase}
            reduce={reduce}
            refineSec={reduce ? 0.3 : view.duration * 0.5}
            badge={view.badge}
            showReplayButton={view.showReplayButton}
            actions={view.actions}
            canvasRef={canvasRef}
            onRetry={replay}
          />
        </div>
        <RevealCaption
          prompt={view.prompt}
          variant={view.variant}
          phase={phase}
          alt={view.alt}
          generatingLabel={view.generatingLabel}
          reduce={reduce}
        />
      </figure>
    );
  },
);
