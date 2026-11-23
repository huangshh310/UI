/**
 * PromptQueue 的类型定义：流式生成期间待发送消息队列胶囊栈，支持立即插队、编辑回填与移除。
 */
export interface QueuedPromptItem {
  id: string;
  /** 待发送的指令文本 */
  content: string;
  /** 可选附加说明（如附带文件数） */
  meta?: string;
}

export interface PromptQueueProps {
  /** 队列中的待发送消息列表 */
  items: QueuedPromptItem[];
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
