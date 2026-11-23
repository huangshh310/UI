export type AiCockpitMode = "chat" | "voice" | "research";

export type AiCockpitVariant = "default" | "elevated" | "studio";

export interface AiAgentCockpitBlockProps {
  /** 初始智能体模式 */
  defaultMode?: AiCockpitMode;
  /** 视觉呈现变体 */
  variant?: AiCockpitVariant;
  /** 驾驶舱标题 */
  title?: string;
  /** 驾驶舱副标题 */
  subtitle?: string;
  /** 初始已消耗 Token 数 */
  initialTokens?: number;
  /** 是否启用紧凑内边距 */
  compact?: boolean;
  /** 点击快捷提示词或发送指令回调 */
  onRunPrompt?: (prompt: string, mode: AiCockpitMode) => void;
  /** 自定义类名 */
  className?: string;
}
