import type { AiOrbState, AiOrbVariant } from "../ai-orb/index.js";

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
