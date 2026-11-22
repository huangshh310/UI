import type { AiOrbState } from "../ai-orb/index.js";

export interface AiVoiceStageProps {
  /** 初始语音交互状态 */
  defaultState?: AiOrbState;
  /** 助手名称或场景标题 */
  assistantName?: string;
  /** 默认字幕文案 */
  caption?: string;
  /** 状态切换回调 */
  onStateChange?: (state: AiOrbState) => void;
  /** 结束会话回调 */
  onEndSession?: () => void;
  /** 自定义类名 */
  className?: string;
}
