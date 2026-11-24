export type AiChatThreadVariant = "card" | "seamless" | "compact";

export interface AiChatThinkingStep {
  title: string;
  detail: string;
}

export interface AiChatThinking {
  duration: string;
  defaultOpen?: boolean;
  steps: AiChatThinkingStep[];
}

export interface AiChatWebSearch {
  query: string;
  resultsCount: number;
  duration: string;
}

export interface AiChatCitation {
  monogram: string;
  label: string;
  href?: string;
}

export interface AiChatTable {
  headers: string[];
  rows: string[][];
}

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** 消息上方居中水平分隔提示（如 "已切换至 Nova 3 Max" / "今天"） */
  divider?: string;
  /** 可折叠思考轨迹（对标 HextaUI Thought for 3s 竖向时间轴） */
  thinking?: AiChatThinking;
  /** 联网搜索摘要行 */
  webSearch?: AiChatWebSearch;
  /** 行内来源徽标胶囊（如 M MDN / C CSS-Tricks） */
  citations?: AiChatCitation[];
  /** 内嵌结构化对比表格 */
  table?: AiChatTable;
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
  /** 是否显示 HextaUI 风格的底部悬浮追问输入条，默认 true */
  showComposer?: boolean;
  /** 底部输入条占位提示，默认 "继续追问…" */
  composerPlaceholder?: string;
  /** 底栏展示的当前模型名称，默认 "Nova 3" */
  modelName?: string;
  /** 底栏展示的思考深度标签，默认 "Medium" */
  effortLabel?: string;
  /** 底栏环形上下文窗口占用百分比（0–100），默认 7 */
  contextUsage?: number;
  /** 是否在右侧边缘显示对话轮次 Checkpoints 导航刻度，默认 true */
  showCheckpoints?: boolean;
  /** 复制消息回调 */
  onCopy?: (content: string) => void;
  /** 点赞或点踩反馈回调 */
  onFeedback?: (messageId: string, vote: "up" | "down") => void;
  /** 点击追问建议或提交输入框回调 */
  onFollowUp?: (prompt: string) => void;
  /** 自定义类名 */
  className?: string;
}
