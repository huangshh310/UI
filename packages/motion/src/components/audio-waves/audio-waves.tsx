"use client";

/**
 * AudioWaves：C 端 AI 语音声波律动条与听写胶囊（参考 ChatGPT Voice / Superwhisper）。
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
  WAVE_HEIGHT_BY_SIZE,
  WAVE_SHELL_TONE,
} from "./audio-waves.variants.js";

interface WaveBarsProps {
  count: number;
  isActive: boolean;
  variant: AudioWavesVariant;
  size: AudioWavesSize;
  tone: AudioWavesTone;
  reduced: boolean | null;
}

const barAnimation = (isDots: boolean, maxPx: number, active: boolean) => {
  if (!active) return isDots ? { scale: 0.75, opacity: 0.4 } : { height: 4, opacity: 0.4 };
  return isDots
    ? { scale: [0.65, 1.35, 0.75, 1.15, 0.65], opacity: [0.45, 1, 0.6, 0.95, 0.45] }
    : { height: [4, maxPx, 7, Math.round(maxPx * 0.72), 4], opacity: [0.6, 1, 0.75, 1, 0.6] };
};

const WaveBars = ({ count, isActive, variant, size, tone, reduced }: WaveBarsProps) => {
  const cfg = WAVE_HEIGHT_BY_SIZE[size];
  const color = isActive ? WAVE_BAR_ACTIVE_COLOR[tone] : WAVE_BAR_IDLE_COLOR[tone];
  const isDots = variant === "dots";
  const animateNow = isActive && !reduced;

  return (
    <div
      aria-hidden="true"
      className={cn("flex px-1", cfg.box, variant === "bars" ? "items-end pb-1" : "items-center")}
    >
      {Array.from({ length: count }, (_, idx) => {
        const peak = WAVE_BAR_ENVELOPE[idx % WAVE_BAR_ENVELOPE.length] ?? 0.6;
        const maxPx = Math.round(peak * cfg.maxPx);
        return (
          <motion.span
            key={idx}
            animate={barAnimation(isDots, maxPx, animateNow)}
            transition={{
              duration: 0.95,
              repeat: Number.POSITIVE_INFINITY,
              delay: idx * 0.045,
              ease: "easeInOut",
            }}
            className={cn("rounded-full", isDots ? "size-1.5" : "w-[3px]", color)}
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
  reduced: boolean | null;
  onToggle: () => void;
}

const MicTrigger = ({ isActive, obsidian, compact, reduced, onToggle }: MicTriggerProps) => {
  const activeStyle = obsidian
    ? "border-emerald-400/50 bg-emerald-500 text-zinc-950 shadow-xs"
    : "border-primary bg-primary text-primary-foreground shadow-xs";
  const idleStyle = obsidian
    ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
    : "border-border bg-secondary text-foreground hover:bg-accent";

  return (
    <button
      type="button"
      aria-label={isActive ? "暂停语音输入" : "开始语音输入"}
      aria-pressed={isActive}
      onClick={onToggle}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        compact ? "size-8" : "size-9",
        isActive ? activeStyle : idleStyle,
      )}
    >
      {isActive && !reduced && (
        <motion.span
          aria-hidden="true"
          animate={{ scale: [1, 1.38], opacity: [0.4, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full",
            obsidian ? "bg-emerald-400/40" : "bg-primary/25",
          )}
        />
      )}
      {isActive ? (
        <Pause aria-hidden="true" className="relative size-3.5" />
      ) : (
        <Mic aria-hidden="true" className="relative size-3.5" />
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
  return (
    <div className="flex items-center gap-2 text-xs whitespace-nowrap">
      <span className="inline-flex items-center gap-1.5 font-medium">
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full transition-colors",
            isActive ? WAVE_DOT_INDICATOR[tone] : "bg-muted-foreground/40",
          )}
        />
        <span className={obsidian ? "text-zinc-100" : "text-foreground"}>
          {label ?? (isActive ? "正在聆听语音…" : "语音已暂停")}
        </span>
      </span>
      {locale && (
        <span
          className={cn(
            "rounded-full border border-solid px-2 py-0.5 font-mono text-[10px]",
            obsidian
              ? "border-zinc-800 bg-zinc-900 text-zinc-300"
              : "border-border/80 bg-secondary/70 text-muted-foreground",
          )}
        >
          {locale}
        </span>
      )}
      <span
        className={cn(
          "rounded-full px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums",
          obsidian ? "bg-zinc-900 text-zinc-300" : "bg-secondary/80 text-muted-foreground",
        )}
      >
        {durationLabel}
      </span>
    </div>
  );
};

const TranscriptBox = ({ text, obsidian }: { text: string; obsidian: boolean }) => (
  <p
    className={cn(
      "m-0 rounded-xl border border-solid px-3 py-1.5 text-xs leading-relaxed",
      obsidian
        ? "border-zinc-800/80 bg-zinc-900/90 text-zinc-300"
        : "border-border/60 bg-secondary/45 text-muted-foreground",
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
        p.cfg.compact ? "gap-1.5 rounded-full px-2.5 py-1.5" : "gap-2.5 rounded-[22px] p-3",
        WAVE_SHELL_TONE[p.cfg.tone],
        p.className,
      )}
    >
      <div className={cn("flex flex-wrap items-center gap-3", p.cfg.compact ? "pr-1" : "pr-2")}>
        <MicTrigger
          isActive={p.isActive}
          obsidian={obsidian}
          compact={p.cfg.compact}
          reduced={p.reduced}
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
