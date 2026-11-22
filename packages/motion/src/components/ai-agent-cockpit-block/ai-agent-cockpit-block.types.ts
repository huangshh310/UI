export type AiCockpitMode = "chat" | "voice" | "research";

export interface AiAgentCockpitBlockProps {
  /** 初始智能体模式 */
  defaultMode?: AiCockpitMode;
  /** 点击快捷提示词或发送指令回调 */
  onRunPrompt?: (prompt: string, mode: AiCockpitMode) => void;
  /** 自定义类名 */
  className?: string;
}
