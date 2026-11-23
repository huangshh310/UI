/**
 * Conversation 的类型定义：流式对话滚动视口、智能贴底锚定、空状态与回到底部悬浮触发器。
 */
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export interface ConversationContextValue {
  isAtBottom: boolean;
  unreadCount: number;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

export interface ConversationProps extends HTMLAttributes<HTMLDivElement> {
  /** 判定贴底的像素阈值，默认 36 */
  bottomThreshold?: number;
  /** 用户上滚离开底部期间新增的未读回合数，默认 0 */
  unreadCount?: number;
  /** 贴底状态变化回调 */
  onAtBottomChange?: (atBottom: boolean) => void;
}

export interface ConversationContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface ConversationEmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** 顶部视觉锚点图标或状态球 */
  icon?: ReactNode;
  /** 欢迎主标题 */
  title?: ReactNode;
  /** 辅助引导说明 */
  description?: ReactNode;
}

export interface ConversationScrollButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮文案，默认「回到底部」 */
  label?: string;
  /** 强制展示开关（用于受控预览），未传时仅在离开底部后显示 */
  forceVisible?: boolean;
}
