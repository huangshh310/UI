export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** 助手消息可选多版本分支内容 */
  variants?: string[];
  model?: string;
  timestamp?: string;
}

export interface AiChatThreadProps {
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
