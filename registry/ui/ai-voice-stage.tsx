// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiVoiceStage：全模态实时语音交互舞台（对标 ChatGPT Advanced Voice / ElevenLabs / Apple Intelligence），
 * 融合光学流体状态球、1px 发丝声纹涟漪、微声波指示条、居中实时字幕流与悬浮通话控制岛。
 */

import { AiOrb, type AiOrbState, type AiOrbVariant } from "@/components/ui/ai-orb";
import { cn } from "@/lib/utils";
import { Captions, Mic, MicOff, PhoneOff, RotateCcw, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useState } from "react";

export const VOICE_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const VOICE_STATE_CYCLE: AiOrbState[] = ["listening", "thinking", "speaking"];

export const VOICE_STATUS_COPY: Record<AiOrbState, string> = {
  idle: "语音通话已暂停",
  listening: "正在聆听你的声音…",
  thinking: "正在组织回应思路…",
  speaking: "语音回复播放中…",
};

export const VOICE_STAGE_SURFACE: Record<AiVoiceStageVariant, string> = {
  card: "rounded-2xl border-border/85 bg-card text-card-foreground shadow-[0_14px_38px_-18px_rgba(15,23,42,0.16),0_1px_3px_rgba(15,23,42,0.06)] dark:border-white/10 dark:shadow-[0_18px_42px_-20px_rgba(0,0,0,0.65)]",
  obsidian:
    "[color-scheme:dark] rounded-2xl border-white/10 bg-neutral-950 text-neutral-50 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)]",
  compact:
    "rounded-2xl border-border/85 bg-card text-card-foreground shadow-xs dark:border-white/10",
};

/** 浅色/瓷白画布顶部极克制环境漫射光：随状态微调色温，营造空间纵深 */
export const VOICE_AMBIENT_CARD: Record<AiOrbState, string> = {
  idle: "radial-gradient(ellipse 68% 54% at 50% 0%, rgba(148,163,184,0.08), transparent 72%)",
  listening: "radial-gradient(ellipse 68% 54% at 50% 0%, rgba(14,165,233,0.1), transparent 72%)",
  thinking: "radial-gradient(ellipse 68% 54% at 50% 0%, rgba(21,93,252,0.1), transparent 72%)",
  speaking: "radial-gradient(ellipse 68% 54% at 50% 0%, rgba(16,185,129,0.1), transparent 72%)",
};

/** 黑曜石剧院舞台中心低饱和环境径向微光 */
export const VOICE_AMBIENT_OBSIDIAN: Record<AiOrbState, string> = {
  idle: "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.055), transparent 62%)",
  listening: "radial-gradient(circle at 50% 42%, rgba(34,211,238,0.14), transparent 62%)",
  thinking: "radial-gradient(circle at 50% 42%, rgba(56,189,248,0.14), transparent 62%)",
  speaking: "radial-gradient(circle at 50% 42%, rgba(52,211,153,0.14), transparent 62%)",
};

/** 1px 发丝同心声纹涟漪环的色调 */
export const VOICE_RIPPLE_BORDER: Record<AiOrbState, string> = {
  idle: "border-foreground/15 dark:border-white/15",
  listening: "border-sky-500/35 dark:border-cyan-400/35",
  thinking: "border-signal/35 dark:border-sky-400/35",
  speaking: "border-emerald-600/35 dark:border-emerald-400/35",
};

export const VOICE_LIVE_DOT: Record<AiOrbState, string> = {
  idle: "bg-muted-foreground/50",
  listening: "bg-sky-500 dark:bg-cyan-400",
  thinking: "bg-signal dark:bg-sky-400",
  speaking: "bg-emerald-600 dark:bg-emerald-400",
};

export const VOICE_DOCK_BTN =
  "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid transition-all active:scale-95 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";
export type AiVoiceStageVariant = "card" | "obsidian" | "compact";

export interface AiVoiceStageProps {
  /** 受控语音交互状态 */
  state?: AiOrbState;
  /** 初始语音交互状态 */
  defaultState?: AiOrbState;
  /** 舞台表面风格：标准卡片（card）、沉浸曜石暗色（obsidian）或紧凑横排（compact） */
  variant?: AiVoiceStageVariant;
  /** 内部状态球形态 */
  orbVariant?: AiOrbVariant;
  /** 助手名称或场景标题 */
  assistantName?: string;
  /** 副标题或模型标识（如 "Realtime · 16kHz"） */
  modelLabel?: string;
  /** 通话时长读数 */
  durationLabel?: string;
  /** 默认字幕文案 */
  caption?: string;
  /** 当前字幕发言者 */
  speaker?: "assistant" | "user";
  /** 状态切换回调 */
  onStateChange?: (state: AiOrbState) => void;
  /** 结束会话回调 */
  onEndSession?: () => void;
  /** 自定义类名 */
  className?: string;
}
interface CircleActionProps {
  label: string;
  pressed?: boolean;
  toneClass: string;
  onClick: () => void;
  children: ReactNode;
}

const CircleAction = ({ label, pressed, toneClass, onClick, children }: CircleActionProps) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={pressed}
    onClick={onClick}
    className={cn(VOICE_DOCK_BTN, toneClass)}
  >
    {children}
  </button>
);

const dockTones = (obsidian: boolean) => ({
  wrap: obsidian
    ? "border-white/12 bg-white/[0.06] shadow-[0_12px_28px_-12px_rgba(0,0,0,0.75)]"
    : "border-border/85 bg-background/85 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] dark:border-white/12 dark:bg-neutral-900/80",
  neutral: obsidian
    ? "border-white/12 bg-white/[0.06] text-neutral-100 hover:bg-white/[0.14]"
    : "border-border/85 bg-card text-foreground shadow-2xs hover:bg-accent/70 dark:border-white/12 dark:bg-white/[0.06] dark:hover:bg-white/[0.12]",
  muted: obsidian
    ? "border-white/30 bg-neutral-100 text-neutral-950 hover:bg-white"
    : "border-primary bg-primary text-primary-foreground hover:opacity-92",
  captionOff: obsidian
    ? "border-white/8 bg-transparent text-neutral-400 hover:bg-white/[0.08] hover:text-neutral-100"
    : "border-border/60 bg-transparent text-muted-foreground hover:bg-card hover:text-foreground dark:border-white/10",
  end: obsidian
    ? "border-red-400/25 bg-red-500/18 text-red-400 hover:border-red-500 hover:bg-red-500 hover:text-white"
    : "border-red-500/25 bg-red-500/12 text-red-700 hover:border-red-600 hover:bg-red-600 hover:text-white dark:border-red-400/25 dark:bg-red-500/18 dark:text-red-400 dark:hover:border-red-500 dark:hover:bg-red-500 dark:hover:text-white",
});

interface VoiceControlsProps {
  muted: boolean;
  showCaption: boolean;
  obsidian: boolean;
  onToggleMute: () => void;
  onCycleState: () => void;
  onToggleCaption: () => void;
  onEnd: () => void;
}

const VoiceControls = (p: VoiceControlsProps) => {
  const t = dockTones(p.obsidian);
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-solid p-1.5 backdrop-blur-md",
        t.wrap,
      )}
    >
      <CircleAction
        label={p.muted ? "取消静音" : "静音麦克风"}
        pressed={p.muted}
        toneClass={p.muted ? t.muted : t.neutral}
        onClick={p.onToggleMute}
      >
        {p.muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
      </CircleAction>
      <CircleAction label="切换语音状态" toneClass={t.neutral} onClick={p.onCycleState}>
        <Sparkles className="size-4" />
      </CircleAction>
      <CircleAction
        label={p.showCaption ? "隐藏实时字幕" : "显示实时字幕"}
        pressed={p.showCaption}
        toneClass={p.showCaption ? t.neutral : t.captionOff}
        onClick={p.onToggleCaption}
      >
        <Captions className="size-4" />
      </CircleAction>
      <CircleAction label="结束语音会话" toneClass={t.end} onClick={p.onEnd}>
        <PhoneOff className="size-4" />
      </CircleAction>
    </div>
  );
};

interface StageHeaderProps {
  assistantName: string;
  modelLabel?: string;
  durationLabel?: string;
  state: AiOrbState;
  obsidian: boolean;
}

const StageHeader = ({
  assistantName,
  modelLabel,
  durationLabel,
  state,
  obsidian,
}: StageHeaderProps) => {
  const paused = state === "idle";
  const sub = obsidian ? "text-neutral-300" : "text-muted-foreground";
  return (
    <div className="relative flex w-full items-center justify-between gap-3 text-xs">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "truncate text-[13px] font-semibold tracking-tight",
            obsidian ? "text-neutral-100" : "text-foreground",
          )}
        >
          {assistantName}
        </span>
        {modelLabel && (
          <span
            className={cn(
              "truncate rounded-full border border-solid px-2 py-0.5 font-mono text-[10px]",
              obsidian
                ? "border-white/10 bg-white/[0.05] text-neutral-300"
                : "border-border/75 bg-muted/55 text-muted-foreground dark:border-white/10 dark:bg-white/[0.04]",
            )}
          >
            {modelLabel}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <span
          className={cn("inline-flex items-center gap-1.5 font-mono text-[11px] font-medium", sub)}
        >
          <span aria-hidden="true" className={cn("size-1.5 rounded-full", VOICE_LIVE_DOT[state])} />
          <span>{paused ? "PAUSED" : "LIVE"}</span>
        </span>
        {durationLabel && (
          <span className={cn("font-mono text-[11px] tabular-nums", sub)}>{durationLabel}</span>
        )}
      </div>
    </div>
  );
};

const EndedCard = ({
  obsidian,
  onReconnect,
  className,
}: {
  obsidian: boolean;
  onReconnect: () => void;
  className?: string;
}) => (
  <div
    data-slot="ai-voice-stage"
    data-state="ended"
    className={cn(
      "flex w-full max-w-xl flex-col items-center justify-center gap-3 border border-solid px-8 py-12 text-center",
      obsidian ? VOICE_STAGE_SURFACE.obsidian : VOICE_STAGE_SURFACE.card,
      className,
    )}
  >
    <p
      className={cn(
        "m-0 text-sm font-semibold tracking-tight",
        obsidian ? "text-neutral-100" : "text-foreground",
      )}
    >
      语音会话已结束
    </p>
    <p
      className={cn(
        "m-0 text-xs leading-relaxed",
        obsidian ? "text-neutral-300" : "text-muted-foreground",
      )}
    >
      本次通话记录已自动保存，随时可继续对话。
    </p>
    <button
      type="button"
      onClick={onReconnect}
      className={cn(
        "mt-1.5 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-transparent px-4 font-sans text-xs font-medium transition-opacity hover:opacity-90",
        obsidian ? "bg-neutral-100 text-neutral-950" : "bg-primary text-primary-foreground",
        VOICE_FOCUS_RING,
      )}
    >
      <RotateCcw aria-hidden="true" className="size-3.5" />
      <span>重新连线</span>
    </button>
  </div>
);

const StageCaption = ({
  caption,
  speaker,
  obsidian,
}: {
  caption: string;
  speaker: "assistant" | "user";
  obsidian: boolean;
}) => (
  <div
    className={cn(
      "relative flex w-full max-w-md flex-col items-center gap-2 border-t border-solid px-2 pt-4 pb-1 text-center",
      obsidian ? "border-white/10" : "border-border/65 dark:border-white/10",
    )}
  >
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-solid px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide",
        obsidian
          ? "border-white/12 bg-white/[0.08] text-neutral-100"
          : "border-border/80 bg-muted/75 text-foreground dark:border-white/12 dark:bg-white/[0.06]",
      )}
    >
      {speaker === "user" ? "你" : "AI"}
    </span>
    <p
      className={cn(
        "m-0 text-sm leading-relaxed font-normal",
        obsidian ? "text-neutral-200" : "text-foreground/90",
      )}
    >
      {caption}
    </p>
  </div>
);
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

const OrbStageCenter = ({
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
const VOICE_DEFAULT_CAPTION =
  "“明天东京多云转晴，21°C，很适合上午去代官山散步，要我帮你记进日程吗？”";

const useVoiceStage = (
  controlledState: AiOrbState | undefined,
  defaultState: AiOrbState,
  onStateChange?: (s: AiOrbState) => void,
) => {
  const [internalState, setInternalState] = useState<AiOrbState>(defaultState);
  const [muted, setMuted] = useState(false);
  const [showCaption, setShowCaption] = useState(true);
  const [ended, setEnded] = useState(false);
  const state = controlledState ?? internalState;

  const updateState = (next: AiOrbState) => {
    if (controlledState === undefined) setInternalState(next);
    onStateChange?.(next);
  };
  const cycleState = () => {
    const next =
      VOICE_STATE_CYCLE[(VOICE_STATE_CYCLE.indexOf(state) + 1) % VOICE_STATE_CYCLE.length] ??
      "listening";
    setMuted(false);
    updateState(next);
  };
  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    updateState(nextMuted ? "idle" : "listening");
  };
  const reconnect = () => {
    setEnded(false);
    setMuted(false);
    updateState("listening");
  };

  return {
    state,
    muted,
    showCaption,
    ended,
    setShowCaption,
    setEnded,
    cycleState,
    toggleMute,
    reconnect,
  };
};

interface StageBodyProps {
  variant: AiVoiceStageVariant;
  orbVariant: AiOrbVariant;
  assistantName: string;
  modelLabel?: string;
  durationLabel?: string;
  state: AiOrbState;
  caption: string;
  speaker: "assistant" | "user";
  showCaption: boolean;
  controls: ReactNode;
  className?: string;
}

const StageBody = (p: StageBodyProps) => {
  const obsidian = p.variant === "obsidian";
  const compact = p.variant === "compact";
  const ambient = obsidian ? VOICE_AMBIENT_OBSIDIAN[p.state] : VOICE_AMBIENT_CARD[p.state];

  return (
    <div
      data-slot="ai-voice-stage"
      data-state={p.state}
      data-variant={p.variant}
      className={cn(
        "relative flex w-full max-w-xl flex-col items-center overflow-hidden border border-solid text-center",
        compact ? "gap-4 p-5" : "gap-6 px-7 py-6 sm:px-9 sm:py-7",
        VOICE_STAGE_SURFACE[p.variant],
        p.className,
      )}
    >
      {!compact && (
        <span
          aria-hidden="true"
          style={{ background: ambient }}
          className="pointer-events-none absolute inset-0"
        />
      )}
      <StageHeader
        assistantName={p.assistantName}
        modelLabel={p.modelLabel}
        durationLabel={p.durationLabel}
        state={p.state}
        obsidian={obsidian}
      />
      <OrbStageCenter
        state={p.state}
        orbVariant={p.orbVariant}
        compact={compact}
        obsidian={obsidian}
      />
      {p.showCaption && (
        <StageCaption caption={p.caption} speaker={p.speaker} obsidian={obsidian} />
      )}
      <div className="relative pt-1">{p.controls}</div>
    </div>
  );
};

export const AiVoiceStage = (props: AiVoiceStageProps) => {
  const variant = props.variant ?? "card";
  const obsidian = variant === "obsidian";
  const v = useVoiceStage(props.state, props.defaultState ?? "listening", props.onStateChange);

  if (v.ended) {
    return <EndedCard obsidian={obsidian} className={props.className} onReconnect={v.reconnect} />;
  }
  return (
    <StageBody
      variant={variant}
      orbVariant={props.orbVariant ?? "aurora"}
      assistantName={props.assistantName ?? "实时语音助手"}
      modelLabel={props.modelLabel}
      durationLabel={props.durationLabel}
      state={v.state}
      caption={props.caption ?? VOICE_DEFAULT_CAPTION}
      speaker={props.speaker ?? "assistant"}
      showCaption={v.showCaption}
      className={props.className}
      controls={
        <VoiceControls
          muted={v.muted}
          showCaption={v.showCaption}
          obsidian={obsidian}
          onToggleMute={v.toggleMute}
          onCycleState={v.cycleState}
          onToggleCaption={() => v.setShowCaption((prev) => !prev)}
          onEnd={() => {
            v.setEnded(true);
            props.onEndSession?.();
          }}
        />
      }
    />
  );
};
