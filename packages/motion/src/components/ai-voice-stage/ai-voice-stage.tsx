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
  <div className="inline-flex items-center justify-center gap-2 rounded-full border border-solid border-border/80 bg-secondary/75 p-1.5">
    <CircleAction
      label={p.muted ? "取消静音" : "静音麦克风"}
      pressed={p.muted}
      toneClass={
        p.muted
          ? "border-transparent bg-primary text-primary-foreground shadow-xs"
          : "border-transparent bg-card text-foreground shadow-xs hover:bg-accent"
      }
      onClick={p.onToggleMute}
    >
      {p.muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
    </CircleAction>
    <CircleAction
      label="切换语音状态"
      toneClass="border-transparent bg-card text-foreground shadow-xs hover:bg-accent"
      onClick={p.onCycleState}
    >
      <Sparkles className="size-4" />
    </CircleAction>
    <CircleAction
      label={p.showCaption ? "隐藏实时字幕" : "显示实时字幕"}
      pressed={p.showCaption}
      toneClass={
        p.showCaption
          ? "border-transparent bg-card text-foreground shadow-xs hover:bg-accent"
          : "border-transparent bg-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground"
      }
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

const EndedCard = ({ onReconnect, className }: { onReconnect: () => void; className?: string }) => (
  <div
    data-slot="ai-voice-stage"
    className={cn(
      "flex w-full max-w-sm flex-col items-center justify-center gap-3 rounded-[28px] border border-solid border-border/90 bg-card p-7 text-center shadow-md",
      className,
    )}
  >
    <p className="m-0 text-[15px] font-semibold tracking-tight text-foreground">语音会话已结束</p>
    <p className="m-0 text-xs leading-relaxed text-muted-foreground">
      本次通话记录已自动保存，随时可继续对话。
    </p>
    <button
      type="button"
      onClick={onReconnect}
      className="mt-1 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-primary px-4 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:bg-primary/90 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
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
      "relative flex w-full max-w-sm flex-col items-center gap-5 overflow-hidden rounded-[28px] border border-solid border-border/90 bg-card p-6 text-center text-card-foreground shadow-md",
      p.className,
    )}
  >
    <div className="flex w-full items-center justify-between text-xs">
      <span className="font-semibold tracking-tight text-foreground">{p.assistantName}</span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
        LIVE
      </span>
    </div>
    <div className="flex flex-col items-center gap-3 py-3">
      <AiOrb state={p.state} variant="aurora" size="lg" />
      <p className="m-0 text-[13px] font-medium tracking-tight text-foreground">
        {STATUS_COPY[p.state]}
      </p>
    </div>
    {p.showCaption && (
      <p className="m-0 w-full rounded-2xl bg-secondary/75 px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
        {p.caption}
      </p>
    )}
    <div>{p.controls}</div>
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
  assistantName = "实时语音助手",
  caption = "“明天东京多云转晴，21°C，很适合上午去代官山散步，要我帮你记进日程吗？”",
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
