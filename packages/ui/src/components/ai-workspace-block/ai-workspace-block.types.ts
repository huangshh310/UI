export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AiThread {
  id: string;
  title: string;
  updatedAt: string;
  messages: AiMessage[];
}

export interface AiWorkspaceBlockProps {
  /** 初始会话列表 */
  initialThreads?: AiThread[];
  /** 发送消息回调 */
  onSend?: (text: string, model: string) => void;
  /** 自定义类名 */
  className?: string;
}
