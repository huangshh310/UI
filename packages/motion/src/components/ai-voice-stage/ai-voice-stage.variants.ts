/**
 * AiVoiceStage 视觉变体与状态映射表。
 */
import type { AiOrbState } from "../ai-orb/index.js";
import type { AiVoiceStageVariant } from "./ai-voice-stage.types.js";

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
