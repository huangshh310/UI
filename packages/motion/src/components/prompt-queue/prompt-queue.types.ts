/**
 * PromptQueue 的类型定义：流式生成期间待发送消息队列胶囊栈，支持立即插队、暂停续发、编辑回填与移除。
 */
export type PromptQueueVariant = "default" | "glass" | "elevated";
export type PromptQueueSize = "sm" | "md";
export type QueuedPromptPriority = "normal" | "high";

export interface QueuedPromptItem {
  id: string;
  /** 待发送的指令文本 */
  content: string;
  /** 可选附加说明（如附带文件数或 @ 上下文） */
  meta?: string;
  /** 优先级标识：high 将以高对比 signal 标点突出提示 */
  priority?: QueuedPromptPriority;
}

export interface PromptQueueProps {
  /** 队列中的待发送消息列表 */
  items: QueuedPromptItem[];
  /** 容器外观风格：default 次级停靠栏、glass 毛玻璃浮层、elevated 悬浮卡片，默认 default */
  variant?: PromptQueueVariant;
  /** 行高与间距密度，默认 md */
  size?: PromptQueueSize;
  /** 自定义页头辅助提示文案 */
  statusLabel?: string;
  /** 是否暂停自动依次发出队列消息，默认 false */
  paused?: boolean;
  /** 切换暂停/恢复自动发出的回调（传入时页头显示对应按钮） */
  onTogglePause?: () => void;
  /** 点击「立即发送」插队打断当前生成并发送该消息 */
  onSendNow?: (item: QueuedPromptItem) => void;
  /** 点击「编辑」将消息取回输入器重新修改 */
  onEdit?: (item: QueuedPromptItem) => void;
  /** 从队列移除某条待发消息 */
  onRemove?: (id: string) => void;
  /** 清空全部待发队列 */
  onClearAll?: () => void;
  /** 初始是否展开队列明细，默认 true */
  defaultExpanded?: boolean;
  className?: string;
}
