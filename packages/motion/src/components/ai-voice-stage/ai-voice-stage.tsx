"use client";

/**
 * AiVoiceStage：C 端全模态实时语音交互舞台（参考 ChatGPT Advanced Voice / Gemini Live），
 * 复用流体极光 AiOrb、实时字幕与触感圆形通话控制栏。
 */
import { cn } from "@matt-ui/utils";
import { useState, type ReactNode } from "react";
import type { AiOrbState, AiOrbVariant } from "../ai-orb/index.js";
import {
  EndedCard,
  OrbStageCenter,
  StageCaption,
  StageHeader,
  VoiceControls,
} from "./ai-voice-stage.parts.js";
import type { AiVoiceStageProps, AiVoiceStageVariant } from "./ai-voice-stage.types.js";
import { VOICE_STAGE_SURFACE, VOICE_STATE_CYCLE } from "./ai-voice-stage.variants.js";

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
