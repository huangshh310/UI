/**
 * Conversation 的类型定义：流式对话滚动视口、智能贴底锚定、空状态与回到底部悬浮触发器。
 */
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type ConversationVariant = "minimal" | "surface" | "glass";
export type ConversationContentSize = "sm" | "md" | "lg";
export type ConversationEmptyStateSize = "sm" | "md" | "lg";
export type ConversationScrollButtonVariant = "pill" | "icon";

export interface ConversationContextValue {
  isAtBottom: boolean;
  unreadCount: number;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

export interface ConversationProps extends HTMLAttributes<HTMLDivElement> {
  /** 外观风格：minimal 无框容器、surface 发丝边框画布、glass 毛玻璃容器，默认 minimal */
  variant?: ConversationVariant;
  /** 是否在视口顶部与底部叠加柔和渐变遮罩，默认 false */
  fadeEdges?: boolean;
  /** 判定贴底的像素阈值，默认 36 */
  bottomThreshold?: number;
  /** 用户上滚离开底部期间新增的未读回合数，默认 0 */
  unreadCount?: number;
  /** 贴底状态变化回调 */
  onAtBottomChange?: (atBottom: boolean) => void;
}

export interface ConversationContentProps extends HTMLAttributes<HTMLDivElement> {
  /** 内容区阅读宽度与排版间距密度，默认 md */
  size?: ConversationContentSize;
}

export interface ConversationEmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** 顶部视觉锚点图标或状态球 */
  icon?: ReactNode;
  /** 可选顶部细小标签（如当前模型或工作区版本） */
  badge?: ReactNode;
  /** 欢迎主标题 */
  title?: ReactNode;
  /** 辅助引导说明 */
  description?: ReactNode;
  /** 留白与标题尺度，默认 md */
  size?: ConversationEmptyStateSize;
}

export interface ConversationScrollButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮外观：pill 胶囊文案按钮、icon 极简圆形悬浮按钮，默认 pill */
  variant?: ConversationScrollButtonVariant;
  /** 按钮文案，默认「回到底部」 */
  label?: string;
  /** 强制展示开关（用于受控预览），未传时仅在离开底部后显示 */
  forceVisible?: boolean;
}
