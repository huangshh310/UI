export type AiChatThreadVariant = "card" | "seamless" | "compact";

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** 助手消息可选多版本分支内容 */
  variants?: string[];
  model?: string;
  timestamp?: string;
  /** 可选回复耗时或 Token 元信息（如 "1.1s · 280 tok"） */
  meta?: string;
  /** 是否处于流式输出中 */
  streaming?: boolean;
}

export interface AiChatThreadProps {
  /** 容器视觉变体：标准卡片（card）、无框画布（seamless）或紧凑侧栏（compact） */
  variant?: AiChatThreadVariant;
  /** 是否显示消息时间戳 */
  showTimestamps?: boolean;
  /** 初始对话消息流 */
  initialMessages?: AiChatMessage[];
  /** 底部快捷追问建议词 */
  followUps?: string[];
  /** 复制消息回调 */
  onCopy?: (content: string) => void;
  /** 点赞或点踩反馈回调 */
  onFeedback?: (messageId: string, vote: "up" | "down") => void;
  /** 点击追问建议回调 */
  onFollowUp?: (prompt: string) => void;
  /** 自定义类名 */
  className?: string;
}
