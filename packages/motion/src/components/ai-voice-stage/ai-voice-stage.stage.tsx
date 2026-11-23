"use client";

/**
 * AiVoiceStage 视觉中心部件：1px 同心声纹涟漪环、5 根微声波指示条与中心 AiOrb 舞台。
 */
import { cn } from "@matt-ui/utils";
import { motion, useReducedMotion } from "motion/react";
import { AiOrb, type AiOrbState, type AiOrbVariant } from "../ai-orb/index.js";
import { VOICE_RIPPLE_BORDER, VOICE_STATUS_COPY } from "./ai-voice-stage.variants.js";

const WAVE_BAR_PEAKS = [0.42, 0.95, 0.65, 1, 0.48] as const;

const AcousticRipples = ({ state, reduced }: { state: AiOrbState; reduced: boolean | null }) => {
  const radiating = !reduced && (state === "listening" || state === "speaking");
  const period = state === "speaking" ? 2.1 : 2.8;
  const ringBorder = VOICE_RIPPLE_BORDER[state];

  return (
    <>
      {[0, 1].map((idx) => (
        <motion.span
          key={idx}
          aria-hidden="true"
          animate={
            radiating
              ? { scale: [1, 1.72], opacity: [0.42, 0] }
              : { scale: idx === 0 ? 1.22 : 1.44, opacity: idx === 0 ? 0.24 : 0.12 }
          }
          transition={
            radiating
              ? {
                  duration: period,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: idx * (period / 2),
                  ease: "easeOut",
                }
              : { duration: 0.5 }
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full border border-solid",
            ringBorder,
          )}
        />
      ))}
    </>
  );
};

const MicroWaveBars = ({
  state,
  obsidian,
  reduced,
}: {
  state: AiOrbState;
  obsidian: boolean;
  reduced: boolean | null;
}) => {
  const active = !reduced && (state === "listening" || state === "speaking");
  const speed = state === "speaking" ? 0.72 : 1.05;

  return (
    <span aria-hidden="true" className="inline-flex h-3 items-center gap-[2.5px]">
      {WAVE_BAR_PEAKS.map((peak, idx) => (
        <motion.span
          key={idx}
          animate={
            active
              ? { scaleY: [0.28, peak, 0.34, Math.max(0.45, peak * 0.75), 0.28] }
              : { scaleY: state === "thinking" ? [0.3, 0.55, 0.3] : 0.28 }
          }
          transition={{
            duration: active ? speed : 1.8,
            repeat: Number.POSITIVE_INFINITY,
            delay: idx * 0.1,
            ease: "easeInOut",
          }}
          className={cn(
            "h-3 w-[2px] origin-center rounded-full",
            obsidian ? "bg-neutral-300/80" : "bg-foreground/55",
          )}
        />
      ))}
    </span>
  );
};

export const OrbStageCenter = ({
  state,
  orbVariant,
  compact,
  obsidian,
}: {
  state: AiOrbState;
  orbVariant: AiOrbVariant;
  compact: boolean;
  obsidian: boolean;
}) => {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        compact ? "w-full justify-between gap-4 py-1" : "flex-col gap-6 pt-6 pb-2",
      )}
    >
      <div className="relative flex items-center justify-center">
        {!compact && <AcousticRipples state={state} reduced={reduced} />}
        <AiOrb state={state} variant={orbVariant} size={compact ? "md" : "xl"} />
      </div>
      <div className={cn("flex items-center gap-2.5", compact && "flex-1 justify-start")}>
        <MicroWaveBars state={state} obsidian={obsidian} reduced={reduced} />
        <p
          className={cn(
            "m-0 text-[13px] font-medium tracking-tight",
            obsidian ? "text-neutral-100" : "text-foreground",
          )}
        >
          {VOICE_STATUS_COPY[state]}
        </p>
      </div>
    </div>
  );
};
