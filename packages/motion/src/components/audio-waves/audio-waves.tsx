"use client";

/**
 * AudioWaves：极简实时语音声波听写条与悬浮胶囊。
 * 声波律动全部采用 GPU 合成 transform（scaleY / scale），零 layout 重排。
 */
import { cn } from "@matt-ui/utils";
import { Mic, Pause } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type {
  AudioWavesProps,
  AudioWavesSize,
  AudioWavesTone,
  AudioWavesVariant,
} from "./audio-waves.types.js";
import {
  WAVE_BAR_ACTIVE_COLOR,
  WAVE_BAR_ENVELOPE,
  WAVE_BAR_IDLE_COLOR,
  WAVE_DOT_INDICATOR,
  WAVE_FOCUS_RING,
  WAVE_SHELL_TONE,
  WAVE_SIZE_CLASS,
} from "./audio-waves.variants.js";

interface WaveBarsProps {
  count: number;
  isActive: boolean;
  variant: AudioWavesVariant;
  size: AudioWavesSize;
  tone: AudioWavesTone;
  reduced: boolean | null;
}

const barAnimation = (isDots: boolean, peak: number, active: boolean) => {
  if (!active) return isDots ? { scale: 0.72, opacity: 0.35 } : { scaleY: 0.18, opacity: 0.35 };
  if (isDots) {
    return { scale: [0.7, 1.24, 0.8, 1.08, 0.7], opacity: [0.45, 0.95, 0.6, 0.9, 0.45] };
  }
  const midLow = Math.max(0.24, Number((peak * 0.42).toFixed(2)));
  const midHigh = Math.max(0.32, Number((peak * 0.78).toFixed(2)));
  return { scaleY: [0.18, peak, midLow, midHigh, 0.18], opacity: [0.55, 1, 0.72, 0.92, 0.55] };
};

const WaveBars = ({ count, isActive, variant, size, tone, reduced }: WaveBarsProps) => {
  const cfg = WAVE_SIZE_CLASS[size];
  const color = isActive ? WAVE_BAR_ACTIVE_COLOR[tone] : WAVE_BAR_IDLE_COLOR[tone];
  const isDots = variant === "dots";
  const animateNow = isActive && !reduced;
  const originClass = variant === "bars" ? "origin-bottom" : "origin-center";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 px-0.5",
        cfg.box,
        variant === "bars" ? "items-end" : "items-center",
      )}
    >
      {Array.from({ length: count }, (_, idx) => {
        const peak = WAVE_BAR_ENVELOPE[idx % WAVE_BAR_ENVELOPE.length] ?? 0.6;
        return (
          <motion.span
            key={idx}
            animate={barAnimation(isDots, peak, animateNow)}
            transition={{
              duration: 0.88 + (idx % 3) * 0.12,
              repeat: Number.POSITIVE_INFINITY,
              delay: idx * 0.045,
              ease: "easeInOut",
            }}
            className={cn(
              "rounded-full will-change-transform",
              isDots ? "size-1.5" : cn("w-[2.5px]", cfg.barHeight, originClass),
              color,
            )}
          />
        );
      })}
    </div>
  );
};

interface MicTriggerProps {
  isActive: boolean;
  obsidian: boolean;
  compact: boolean;
  onToggle: () => void;
}

const MicTrigger = ({ isActive, obsidian, compact, onToggle }: MicTriggerProps) => {
  const activeStyle = obsidian
    ? "border-white/20 bg-white text-neutral-950 hover:bg-neutral-200"
    : "border-primary bg-primary text-primary-foreground hover:opacity-92";
  const idleStyle = obsidian
    ? "border-white/12 bg-white/[0.06] text-neutral-200 hover:bg-white/[0.12]"
    : "border-border bg-muted/70 text-foreground hover:bg-accent/70 dark:border-white/12 dark:bg-white/[0.05]";

  return (
    <button
      type="button"
      aria-label={isActive ? "暂停语音输入" : "开始语音输入"}
      aria-pressed={isActive}
      onClick={onToggle}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid transition-colors active:scale-95",
        compact ? "size-7" : "size-8",
        isActive ? activeStyle : idleStyle,
        WAVE_FOCUS_RING,
      )}
    >
      {isActive ? (
        <Pause aria-hidden="true" className="size-3.5" />
      ) : (
        <Mic aria-hidden="true" className="size-3.5" />
      )}
    </button>
  );
};

interface MetaProps {
  isActive: boolean;
  tone: AudioWavesTone;
  label?: string;
  locale?: string;
  durationLabel: string;
}

const WaveStatusMeta = ({ isActive, tone, label, locale, durationLabel }: MetaProps) => {
  const obsidian = tone === "obsidian";
  const sub = obsidian ? "text-neutral-400" : "text-muted-foreground";
  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
      <span className="inline-flex min-w-0 items-center gap-1.5 font-medium">
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 shrink-0 rounded-full transition-colors",
            isActive ? WAVE_DOT_INDICATOR[tone] : "bg-muted-foreground/40",
          )}
        />
        <span
          className={cn("whitespace-nowrap", obsidian ? "text-neutral-100" : "text-foreground")}
        >
          {label ?? (isActive ? "正在聆听语音…" : "语音已暂停")}
        </span>
      </span>
      <span
        className={cn("flex shrink-0 items-center gap-1.5 font-mono text-[11px] tabular-nums", sub)}
      >
        {locale && <span>{locale}</span>}
        {locale && (
          <span aria-hidden="true" className="opacity-45">
            ·
          </span>
        )}
        <span>{durationLabel}</span>
      </span>
    </div>
  );
};

const TranscriptBox = ({ text, obsidian }: { text: string; obsidian: boolean }) => (
  <p
    className={cn(
      "m-0 rounded-lg px-3 py-2 text-xs leading-relaxed",
      obsidian
        ? "bg-white/[0.04] text-neutral-300"
        : "bg-muted/45 text-muted-foreground dark:bg-white/[0.04]",
    )}
  >
    “{text}”
  </p>
);

const resolveWaveConfig = (props: AudioWavesProps) => ({
  variant: props.variant ?? "mirror",
  size: props.size ?? "md",
  tone: props.tone ?? "default",
  compact: props.compact ?? false,
  bars: props.bars ?? 14,
  durationLabel: props.durationLabel ?? "00:14",
});

interface WaveShellProps {
  cfg: ReturnType<typeof resolveWaveConfig>;
  isActive: boolean;
  reduced: boolean | null;
  label?: string;
  locale?: string;
  transcript?: string;
  className?: string;
  onToggle: () => void;
}

const WaveShell = (p: WaveShellProps) => {
  const obsidian = p.cfg.tone === "obsidian";
  return (
    <div
      data-slot="audio-waves"
      data-active={p.isActive ? "true" : "false"}
      data-variant={p.cfg.variant}
      data-tone={p.cfg.tone}
      className={cn(
        "inline-flex flex-col border border-solid",
        p.cfg.compact ? "gap-1.5 rounded-full px-2.5 py-1.5" : "gap-2.5 rounded-xl px-3.5 py-3",
        WAVE_SHELL_TONE[p.cfg.tone],
        p.className,
      )}
    >
      <div className="flex w-full items-center gap-3">
        <MicTrigger
          isActive={p.isActive}
          obsidian={obsidian}
          compact={p.cfg.compact}
          onToggle={p.onToggle}
        />
        <WaveBars
          count={p.cfg.bars}
          isActive={p.isActive}
          variant={p.cfg.variant}
          size={p.cfg.compact ? "sm" : p.cfg.size}
          tone={p.cfg.tone}
          reduced={p.reduced}
        />
        <WaveStatusMeta
          isActive={p.isActive}
          tone={p.cfg.tone}
          label={p.label}
          locale={p.locale}
          durationLabel={p.cfg.durationLabel}
        />
      </div>
      {p.transcript && !p.cfg.compact && <TranscriptBox text={p.transcript} obsidian={obsidian} />}
    </div>
  );
};

export const AudioWaves = (props: AudioWavesProps) => {
  const cfg = resolveWaveConfig(props);
  const reduced = useReducedMotion();
  const [internalActive, setInternalActive] = useState(props.defaultActive ?? true);
  const isActive = props.active ?? internalActive;

  const toggle = () => {
    const next = !isActive;
    if (props.active === undefined) setInternalActive(next);
    props.onActiveChange?.(next);
  };

  return (
    <WaveShell
      cfg={cfg}
      isActive={isActive}
      reduced={reduced}
      label={props.label}
      locale={props.locale}
      transcript={props.transcript}
      className={props.className}
      onToggle={toggle}
    />
  );
};
