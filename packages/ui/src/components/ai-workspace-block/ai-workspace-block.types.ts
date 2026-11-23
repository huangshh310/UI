export type AiWorkspaceVariant = "split" | "compact";

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
  /** 助手名称 */
  title?: string;
  /** 布局变体：分栏侧边栏或紧凑顶部会话条 */
  variant?: AiWorkspaceVariant;
  /** 默认选中的模型标识 */
  defaultModel?: string;
  /** 是否显示消息时间戳 */
  showTimestamps?: boolean;
  /** 发送消息回调 */
  onSend?: (text: string, model: string) => void;
  /** 自定义类名 */
  className?: string;
}
