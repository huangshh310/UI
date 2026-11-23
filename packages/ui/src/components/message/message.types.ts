/**
 * Message 的类型定义：单回合对话复合原语，支持无框助手响应、多版本分支切换、原位编辑与异常重试。
 */
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type MessageRole = "user" | "assistant" | "system";
export type MessageStatus = "ready" | "streaming" | "stopped" | "error";

export interface MessageContextValue {
  from: MessageRole;
  status: MessageStatus;
  errorMessage?: string;
  onRetry?: () => void;
}

export interface MessageProps extends HTMLAttributes<HTMLElement> {
  /** 消息发送方角色（对齐 shadcn AI Elements 的 from 属性，避免与原生 ARIA role 冲突） */
  from: MessageRole;
  /** 生成状态，默认 ready */
  status?: MessageStatus;
  /** status="error" 时展示的错误说明 */
  errorMessage?: string;
  /** status="error" 时点击重试的回调 */
  onRetry?: () => void;
}

export interface MessageContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface MessageActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** 是否默认弱化并在消息悬停或键盘聚焦时显现，默认 false */
  revealOnHover?: boolean;
}

export interface MessageActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 无障碍操作说明（必填以确保图标按钮可访问） */
  label: string;
  /** 是否处于激活态（如已点赞/已点踩） */
  active?: boolean;
  /** 传入后点击自动写入剪贴板并在短时间内切换已复制视觉反馈 */
  copyText?: string;
}

export interface MessageBranchProps extends HTMLAttributes<HTMLDivElement> {
  /** 非受控初始分支索引，默认 0 */
  defaultBranch?: number;
  /** 受控当前分支索引 */
  branch?: number;
  /** 分支切换回调 */
  onBranchChange?: (branch: number) => void;
}

export interface MessageBranchContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface MessageBranchSelectorProps extends HTMLAttributes<HTMLDivElement> {}

export interface MessageEditFormProps {
  /** 初始待编辑文本 */
  defaultValue: string;
  /** 保存并重新生成回调 */
  onSave: (nextText: string) => void;
  /** 取消编辑回调 */
  onCancel: () => void;
  /** 提交按钮文案，默认「保存并重发」 */
  submitLabel?: string;
  className?: string;
}
