// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiVoiceStage：C 端全模态实时语音交互舞台（参考 ChatGPT Advanced Voice / Gemini Live），
 * 复用流体极光 AiOrb、实时字幕与触感圆形通话控制栏。
 */

import { AiOrb, type AiOrbState, type AiOrbVariant } from "@/components/ui/ai-orb";
import { cn } from "@/lib/utils";
import { Captions, Mic, MicOff, PhoneOff, RotateCcw, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useState } from "react";

export const VOICE_STATE_CYCLE: AiOrbState[] = ["listening", "thinking", "speaking"];

export const VOICE_STATUS_COPY: Record<AiOrbState, string> = {
  idle: "语音通话已暂停",
  listening: "正在聆听你的声音…",
  thinking: "正在组织回应思路…",
  speaking: "语音回复播放中…",
};

export const VOICE_STAGE_SURFACE: Record<AiVoiceStageVariant, string> = {
  card: "rounded-[24px] border-border/85 bg-card text-card-foreground shadow-sm",
  obsidian: "[color-scheme:dark] rounded-[24px] border-zinc-800 bg-zinc-950 text-zinc-50 shadow-lg",
  compact: "rounded-2xl border-border/85 bg-card text-card-foreground shadow-xs",
};

export const VOICE_HALO_BY_STATE: Record<AiOrbState, string> = {
  idle: "bg-muted-foreground/10",
  listening: "bg-sky-500/15",
  thinking: "bg-signal/15",
  speaking: "bg-emerald-500/15",
};

export const VOICE_DOCK_BTN =
  "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring";

export const VOICE_EQ_BARS = [0.45, 0.9, 0.65, 1, 0.5] as const;
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
  wrap: obsidian ? "border-zinc-800 bg-zinc-900/90" : "border-border/80 bg-secondary/75",
  neutral: obsidian
    ? "border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
    : "border-transparent bg-card text-foreground shadow-xs hover:bg-accent",
  muted: obsidian
    ? "border-zinc-200 bg-zinc-100 text-zinc-950"
    : "border-transparent bg-primary text-primary-foreground shadow-xs",
  captionOff: obsidian
    ? "border-transparent bg-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
    : "border-transparent bg-transparent text-muted-foreground hover:bg-card/70 hover:text-foreground",
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
        "inline-flex items-center justify-center gap-2 rounded-full border border-solid p-1.5",
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
      <CircleAction
        label="结束语音会话"
        toneClass="border-transparent bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90"
        onClick={p.onEnd}
      >
        <PhoneOff className="size-4" />
      </CircleAction>
    </div>
  );
};

const MiniVoiceBars = ({ state, obsidian }: { state: AiOrbState; obsidian: boolean }) => {
  const reduced = useReducedMotion();
  const active = state === "listening" || state === "speaking";
  const barColor =
    state === "speaking"
      ? "bg-emerald-500"
      : state === "listening"
        ? "bg-sky-500"
        : obsidian
          ? "bg-zinc-600"
          : "bg-muted-foreground/35";

  return (
    <div aria-hidden="true" className="flex h-3.5 items-center justify-center gap-1">
      {VOICE_EQ_BARS.map((peak, idx) => (
        <motion.span
          key={idx}
          animate={
            reduced || !active
              ? { height: 4, opacity: 0.45 }
              : { height: [4, Math.round(peak * 14), 4], opacity: [0.65, 1, 0.65] }
          }
          transition={{
            duration: state === "speaking" ? 0.65 : 1.0,
            repeat: Number.POSITIVE_INFINITY,
            delay: idx * 0.08,
            ease: "easeInOut",
          }}
          className={cn("w-0.5 rounded-full", barColor)}
        />
      ))}
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
  const sub = obsidian ? "text-zinc-400" : "text-muted-foreground";
  return (
    <div className="flex w-full items-center justify-between gap-2 text-xs">
      <div className="flex min-w-0 flex-col items-start">
        <span
          className={cn(
            "truncate font-semibold tracking-tight",
            obsidian ? "text-zinc-50" : "text-foreground",
          )}
        >
          {assistantName}
        </span>
        {modelLabel && <span className={cn("font-mono text-[10px]", sub)}>{modelLabel}</span>}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {durationLabel && (
          <span className={cn("font-mono text-[11px] tabular-nums", sub)}>{durationLabel}</span>
        )}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-solid px-2.5 py-0.5 font-mono text-[10px] font-medium",
            obsidian
              ? "border-zinc-800 bg-zinc-900 text-zinc-300"
              : "border-border/70 bg-secondary/80 text-muted-foreground",
          )}
        >
          <span
            aria-hidden="true"
            className={cn("size-1.5 rounded-full", paused ? "bg-amber-500" : "bg-emerald-500")}
          />
          {paused ? "PAUSED" : "LIVE"}
        </span>
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
      "flex w-full max-w-sm flex-col items-center justify-center gap-3 border border-solid p-7 text-center",
      obsidian ? VOICE_STAGE_SURFACE.obsidian : VOICE_STAGE_SURFACE.card,
      className,
    )}
  >
    <p
      className={cn(
        "m-0 text-[15px] font-semibold tracking-tight",
        obsidian ? "text-zinc-50" : "text-foreground",
      )}
    >
      语音会话已结束
    </p>
    <p
      className={cn(
        "m-0 text-xs leading-relaxed",
        obsidian ? "text-zinc-400" : "text-muted-foreground",
      )}
    >
      本次通话记录已自动保存，随时可继续对话。
    </p>
    <button
      type="button"
      onClick={onReconnect}
      className={cn(
        "mt-1 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border-0 px-4 font-sans text-xs font-medium shadow-xs transition-opacity hover:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        obsidian ? "bg-zinc-100 text-zinc-950" : "bg-primary text-primary-foreground",
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
      "flex w-full items-start gap-2 rounded-2xl border border-solid px-3.5 py-2.5 text-left text-xs leading-relaxed",
      obsidian
        ? "border-zinc-800/90 bg-zinc-900/85 text-zinc-300"
        : "border-border/70 bg-secondary/60 text-muted-foreground",
    )}
  >
    <span
      className={cn(
        "mt-0.5 shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-medium",
        obsidian ? "bg-zinc-800 text-zinc-300" : "bg-card text-foreground",
      )}
    >
      {speaker === "user" ? "你" : "AI"}
    </span>
    <p className="m-0 flex-1">{caption}</p>
  </div>
);

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
}) => (
  <div
    className={cn(
      "relative flex items-center justify-center",
      compact ? "w-full justify-between gap-4 py-1" : "flex-col gap-3 py-3",
    )}
  >
    <div className="relative flex items-center justify-center">
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-4 rounded-full blur-2xl transition-colors duration-500",
          VOICE_HALO_BY_STATE[state],
        )}
      />
      <AiOrb state={state} variant={orbVariant} size={compact ? "md" : "lg"} />
    </div>
    <div
      className={cn(
        "flex flex-col gap-1.5",
        compact ? "flex-1 items-start text-left" : "items-center",
      )}
    >
      <p
        className={cn(
          "m-0 text-[13px] font-medium tracking-tight",
          obsidian ? "text-zinc-100" : "text-foreground",
        )}
      >
        {VOICE_STATUS_COPY[state]}
      </p>
      <MiniVoiceBars state={state} obsidian={obsidian} />
    </div>
  </div>
);
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
  return (
    <div
      data-slot="ai-voice-stage"
      data-state={p.state}
      data-variant={p.variant}
      className={cn(
        "relative flex w-full flex-col items-center overflow-hidden border border-solid text-center",
        compact ? "max-w-md gap-3.5 p-4" : "max-w-sm gap-5 p-6",
        VOICE_STAGE_SURFACE[p.variant],
        p.className,
      )}
    >
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
      <div>{p.controls}</div>
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
