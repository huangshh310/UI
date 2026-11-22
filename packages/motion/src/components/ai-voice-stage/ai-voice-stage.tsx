"use client";

/**
 * AiVoiceStage：C 端全模态实时语音交互舞台（参考 ChatGPT Advanced Voice / Gemini Live），
 * 复用流体极光 AiOrb、字幕条与触感圆形通话控制栏。
 */
import { cn } from "@matt-ui/utils";
import { Captions, Mic, MicOff, PhoneOff, RotateCcw, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AiOrb, type AiOrbState } from "../ai-orb/index.js";
import type { AiVoiceStageProps } from "./ai-voice-stage.types.js";

const CYCLE: AiOrbState[] = ["listening", "thinking", "speaking"];
const STATUS_COPY: Record<AiOrbState, string> = {
  idle: "语音通话已暂停",
  listening: "正在聆听你的声音…",
  thinking: "正在组织回应思路…",
  speaking: "语音回复播放中…",
};
const PILL_BTN =
  "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring";

const CircleAction = ({
  label,
  pressed,
  toneClass,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  toneClass: string;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={pressed}
    onClick={onClick}
    className={cn(PILL_BTN, toneClass)}
  >
    {children}
  </button>
);

const VoiceControls = (p: {
  muted: boolean;
  showCaption: boolean;
  onToggleMute: () => void;
  onCycleState: () => void;
  onToggleCaption: () => void;
  onEnd: () => void;
}) => (
  <div className="flex items-center justify-center gap-2.5">
    <CircleAction
      label={p.muted ? "取消静音" : "静音麦克风"}
      pressed={p.muted}
      toneClass={
        p.muted
          ? "border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-300"
          : "border-border bg-card text-foreground shadow-sm hover:bg-accent"
      }
      onClick={p.onToggleMute}
    >
      {p.muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
    </CircleAction>
    <CircleAction
      label="切换语音状态"
      toneClass="border-signal/35 bg-signal/12 text-signal shadow-sm hover:bg-signal/20"
      onClick={p.onCycleState}
    >
      <Sparkles className="size-4" />
    </CircleAction>
    <CircleAction
      label={p.showCaption ? "隐藏实时字幕" : "显示实时字幕"}
      pressed={p.showCaption}
      toneClass={
        p.showCaption
          ? "border-signal/40 bg-card text-signal shadow-sm"
          : "border-border bg-secondary text-muted-foreground"
      }
      onClick={p.onToggleCaption}
    >
      <Captions className="size-4" />
    </CircleAction>
    <CircleAction
      label="结束语音会话"
      toneClass="border-destructive bg-destructive text-destructive-foreground shadow-sm hover:opacity-90"
      onClick={p.onEnd}
    >
      <PhoneOff className="size-4" />
    </CircleAction>
  </div>
);

const EndedCard = ({ onReconnect, className }: { onReconnect: () => void; className?: string }) => (
  <div
    data-slot="ai-voice-stage"
    className={cn(
      "flex w-full max-w-sm flex-col items-center justify-center gap-3 rounded-[24px] border border-solid border-border/90 bg-card p-6 text-center shadow-md",
      className,
    )}
  >
    <p className="m-0 text-sm font-semibold text-foreground">语音会话已结束</p>
    <p className="m-0 text-xs text-muted-foreground">本次双工通话记录已自动归档至对话线程。</p>
    <button
      type="button"
      onClick={onReconnect}
      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-signal bg-signal px-3.5 font-sans text-xs font-medium text-signal-foreground shadow-sm transition-opacity hover:opacity-92 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
    >
      <RotateCcw aria-hidden="true" className="size-3.5" />
      <span>重新连线</span>
    </button>
  </div>
);

const StageBody = (p: {
  assistantName: string;
  state: AiOrbState;
  caption: string;
  showCaption: boolean;
  controls: ReactNode;
  className?: string;
}) => (
  <div
    data-slot="ai-voice-stage"
    data-state={p.state}
    className={cn(
      "relative flex w-full max-w-sm flex-col items-center gap-4 overflow-hidden rounded-[26px] border border-solid border-border/90 bg-card p-5 text-center text-card-foreground shadow-lg",
      p.className,
    )}
  >
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-12 size-44 rounded-full bg-gradient-to-br from-signal/20 via-indigo-500/18 to-cyan-400/18 blur-3xl"
    />
    <div className="relative z-10 flex w-full items-center justify-between text-[11px]">
      <span className="font-semibold text-foreground">{p.assistantName}</span>
      <span className="rounded-full border border-solid border-emerald-600/20 bg-emerald-500/12 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
        LIVE · 48kHz
      </span>
    </div>
    <div className="relative z-10 flex flex-col items-center gap-2.5 py-1">
      <AiOrb state={p.state} variant="aurora" size="lg" />
      <p className="m-0 text-xs font-medium text-foreground">{STATUS_COPY[p.state]}</p>
    </div>
    {p.showCaption && (
      <p className="relative z-10 m-0 w-full rounded-2xl border border-solid border-border/75 bg-secondary/45 px-3.5 py-2 text-xs leading-relaxed text-muted-foreground">
        {p.caption}
      </p>
    )}
    <div className="relative z-10">{p.controls}</div>
  </div>
);

const useVoiceStage = (defaultState: AiOrbState, onStateChange?: (s: AiOrbState) => void) => {
  const [state, setState] = useState<AiOrbState>(defaultState);
  const [muted, setMuted] = useState(false);
  const [showCaption, setShowCaption] = useState(true);
  const [ended, setEnded] = useState(false);
  const cycleState = () => {
    const next = CYCLE[(CYCLE.indexOf(state) + 1) % CYCLE.length] ?? "listening";
    setMuted(false);
    setState(next);
    onStateChange?.(next);
  };
  const toggleMute = () => {
    const nextMuted = !muted;
    const nextState: AiOrbState = nextMuted ? "idle" : "listening";
    setMuted(nextMuted);
    setState(nextState);
    onStateChange?.(nextState);
  };
  const reconnect = () => (setEnded(false), setMuted(false), setState("listening"));
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

export const AiVoiceStage = ({
  defaultState = "listening",
  assistantName = "Matt Live Voice",
  caption = "“已为你把语音极光球切换到低延迟双工模式，随时可以打断我。”",
  onStateChange,
  onEndSession,
  className,
}: AiVoiceStageProps) => {
  const v = useVoiceStage(defaultState, onStateChange);
  if (v.ended) return <EndedCard className={className} onReconnect={v.reconnect} />;
  return (
    <StageBody
      assistantName={assistantName}
      state={v.state}
      caption={caption}
      showCaption={v.showCaption}
      className={className}
      controls={
        <VoiceControls
          muted={v.muted}
          showCaption={v.showCaption}
          onToggleMute={v.toggleMute}
          onCycleState={v.cycleState}
          onToggleCaption={() => v.setShowCaption((prev) => !prev)}
          onEnd={() => (v.setEnded(true), onEndSession?.())}
        />
      }
    />
  );
};
