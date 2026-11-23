export type AiToolCallStatus = "running" | "completed" | "error" | "pending";
export type AiToolCallVariant = "card" | "compact" | "obsidian";

export interface AiToolCallProps {
  /** 工具名称（如 search_registry / run_e2e） */
  toolName: string;
  /** 执行状态 */
  status?: AiToolCallStatus;
  /** 容器视觉变体：标准卡片（card）、紧凑行内（compact）或曜石暗色（obsidian） */
  variant?: AiToolCallVariant;
  /** 工具提供方或 MCP 服务标识 */
  provider?: string;
  /** 执行耗时 */
  durationLabel?: string;
  /** 可选载荷大小或 Token 读数 */
  tokensLabel?: string;
  /** 简短结果摘要 */
  summary?: string;
  /** 请求入参 JSON 文本 */
  inputJson?: string;
  /** 返回结果 JSON 文本 */
  outputJson?: string;
  /** 受控展开状态 */
  expanded?: boolean;
  /** 初始是否展开载荷明细 */
  defaultExpanded?: boolean;
  /** 展开状态变化回调 */
  onExpandedChange?: (expanded: boolean) => void;
  /** 失败态重试回调 */
  onRetry?: () => void;
  /** 自定义类名 */
  className?: string;
}
