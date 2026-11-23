/**
 * AiResponse 的公开类型定义。
 */
import type { ReactNode } from "react";

export type AiResponseStatus = "idle" | "generating" | "streaming" | "complete" | "error";

export interface AiResponseSource {
  id: string;
  title: string;
  url: string;
  snippet?: string;
}

export interface AiResponseTool {
  id: string;
  name: string;
  status: "running" | "complete" | "error";
  duration?: string;
  detail?: string;
}

export interface AiResponseProps {
  /** 流式或完整 Markdown 回复内容 */
  content: string;
  /** 当前生成状态 */
  status?: AiResponseStatus;
  /** 显示在顶部的模型或助手名称 */
  model?: string;
  /** 生成过程中的状态提示文案 */
  statusLabel?: string;
  /** 本次回复用到的工具列表 */
  tools?: AiResponseTool[];
  /** 本次回复引用的参考来源 */
  sources?: AiResponseSource[];
  /** 错误态时的报错文案 */
  errorMessage?: string;
  /** 触发重新生成 */
  onRegenerate?: () => void;
  /** 触发反馈（点赞 / 点踩） */
  onFeedback?: (type: "up" | "down") => void;
  /** 复制正文后的回调 */
  onCopy?: (content: string) => void;
  /** 自定义容器样式 */
  className?: string;
  /** 自定义子部件组合；留空时渲染标准完整版式 */
  children?: ReactNode;
}

export interface AiResponseHeaderProps {
  /** 覆盖模型名称 */
  model?: string;
  /** 自定义状态提示 */
  statusLabel?: string;
  className?: string;
}

export interface AiResponseContentProps {
  className?: string;
}

export interface AiResponseToolsSummaryProps {
  className?: string;
}

export interface AiResponseSourcesProps {
  className?: string;
}

export interface AiResponseActionsProps {
  className?: string;
}
