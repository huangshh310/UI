/**
 * AiVoiceStage 视觉变体、声场氛围光与状态映射表。
 */
import type { AiOrbState } from "../ai-orb/index.js";
import type { AiVoiceStageVariant } from "./ai-voice-stage.types.js";

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
  thinking: "radial-gradient(ellipse 68% 54% at 50% 0%, rgba(122,94,228,0.12), transparent 72%)",
  speaking: "radial-gradient(ellipse 68% 54% at 50% 0%, rgba(16,185,129,0.1), transparent 72%)",
};

/** 黑曜石剧院舞台中心低饱和环境径向微光 */
export const VOICE_AMBIENT_OBSIDIAN: Record<AiOrbState, string> = {
  idle: "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.055), transparent 62%)",
  listening: "radial-gradient(circle at 50% 42%, rgba(34,211,238,0.14), transparent 62%)",
  thinking: "radial-gradient(circle at 50% 42%, rgba(139,115,242,0.16), transparent 62%)",
  speaking: "radial-gradient(circle at 50% 42%, rgba(52,211,153,0.14), transparent 62%)",
};

/** 1px 发丝同心声纹涟漪环的色调 */
export const VOICE_RIPPLE_BORDER: Record<AiOrbState, string> = {
  idle: "border-foreground/15 dark:border-white/15",
  listening: "border-sky-500/35 dark:border-cyan-400/35",
  thinking: "border-signal/35 dark:border-info/35",
  speaking: "border-emerald-600/35 dark:border-emerald-400/35",
};

export const VOICE_LIVE_DOT: Record<AiOrbState, string> = {
  idle: "bg-muted-foreground/50",
  listening: "bg-sky-500 dark:bg-cyan-400",
  thinking: "bg-signal dark:bg-info",
  speaking: "bg-emerald-600 dark:bg-emerald-400",
};

export const VOICE_DOCK_BTN =
  "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid transition-all active:scale-95 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";
