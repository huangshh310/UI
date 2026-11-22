"use client";

/**
 * AudioWaves：C 端 AI 语音声波律动条与听写胶囊（参考 aicss.dev Audio Waves 与 ChatGPT Voice）。
 */
import { cn } from "@matt-ui/utils";
import { Mic, Pause } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { AudioWavesProps } from "./audio-waves.types.js";

const BAR_ENVELOPE = [
  0.28, 0.5, 0.78, 0.62, 0.95, 0.72, 1, 0.88, 0.95, 0.64, 0.8, 0.52, 0.36, 0.25,
];

const WaveBars = ({
  count,
  isActive,
  variant,
  reduced,
}: {
  count: number;
  isActive: boolean;
  variant: "bars" | "mirror";
  reduced: boolean | null;
}) => (
  <div
    aria-hidden="true"
    className={cn(
      "flex h-8 gap-[3px] px-1",
      variant === "mirror" ? "items-center" : "items-end pb-1",
    )}
  >
    {Array.from({ length: count }, (_, idx) => {
      const peak = BAR_ENVELOPE[idx % BAR_ENVELOPE.length] ?? 0.6;
      const maxPx = Math.round(peak * 26);
      return (
        <motion.span
          key={idx}
          animate={
            reduced || !isActive
              ? { height: 5, opacity: 0.4 }
              : {
                  height: [5, maxPx, 8, Math.round(maxPx * 0.72), 5],
                  opacity: [0.65, 1, 0.78, 1, 0.65],
                }
          }
          transition={{
            duration: 1.0,
            repeat: Number.POSITIVE_INFINITY,
            delay: idx * 0.05,
            ease: "easeInOut",
          }}
          className={cn(
            "w-1 rounded-full",
            isActive
              ? "bg-gradient-to-t from-signal via-indigo-500 to-cyan-400"
              : "bg-muted-foreground/45",
          )}
        />
      );
    })}
  </div>
);

const MicTrigger = ({ isActive, onToggle }: { isActive: boolean; onToggle: () => void }) => (
  <button
    type="button"
    aria-label={isActive ? "暂停语音输入" : "开始语音输入"}
    aria-pressed={isActive}
    onClick={onToggle}
    className={cn(
      "relative inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring",
      isActive
        ? "border-signal bg-signal text-signal-foreground shadow-[0_0_0_4px_color-mix(in_oklab,var(--ui-signal)_16%,transparent),0_4px_12px_-2px_color-mix(in_oklab,var(--ui-signal)_50%,transparent)]"
        : "border-border bg-secondary text-foreground hover:bg-accent",
    )}
  >
    {isActive ? (
      <Pause aria-hidden="true" className="size-3.5" />
    ) : (
      <Mic aria-hidden="true" className="size-3.5" />
    )}
  </button>
);

const WaveStatusMeta = ({
  isActive,
  label,
  locale,
  durationLabel,
}: {
  isActive: boolean;
  label?: string;
  locale?: string;
  durationLabel: string;
}) => (
  <div className="flex items-center gap-2 text-xs whitespace-nowrap">
    <span className="font-semibold text-foreground">
      {label ?? (isActive ? "正在聆听语音…" : "语音已暂停")}
    </span>
    {locale && (
      <span className="rounded-full border border-solid border-border bg-secondary/70 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
        {locale}
      </span>
    )}
    <span className="rounded-full bg-secondary/80 px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
      {durationLabel}
    </span>
  </div>
);

export const AudioWaves = ({
  active: controlledActive,
  defaultActive = true,
  onActiveChange,
  variant = "mirror",
  bars = 14,
  label,
  durationLabel = "00:14",
  transcript,
  locale,
  className,
}: AudioWavesProps) => {
  const reduced = useReducedMotion();
  const [internalActive, setInternalActive] = useState(defaultActive);
  const isActive = controlledActive ?? internalActive;

  const toggle = () => {
    const next = !isActive;
    if (controlledActive === undefined) setInternalActive(next);
    onActiveChange?.(next);
  };

  return (
    <div
      data-slot="audio-waves"
      data-active={isActive ? "true" : "false"}
      data-variant={variant}
      className={cn(
        "inline-flex flex-col gap-2 rounded-[22px] border border-solid border-border/90 bg-card p-2.5 text-card-foreground shadow-md",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-3 pr-2">
        <MicTrigger isActive={isActive} onToggle={toggle} />
        <WaveBars count={bars} isActive={isActive} variant={variant} reduced={reduced} />
        <WaveStatusMeta
          isActive={isActive}
          label={label}
          locale={locale}
          durationLabel={durationLabel}
        />
      </div>
      {transcript && (
        <p className="m-0 rounded-xl bg-secondary/45 px-3 py-1.5 text-xs text-muted-foreground">
          “{transcript}”
        </p>
      )}
    </div>
  );
};
