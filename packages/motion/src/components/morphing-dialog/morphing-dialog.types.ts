import type { ReactNode } from "react";

export type MorphingDialogSize = "sm" | "md" | "lg";
export type MorphingDialogTagTone = "neutral" | "signal" | "success" | "warning";

export interface MorphingDialogProps {
  /** 受控开关状态 */
  open?: boolean;
  /** 非受控初始状态 */
  defaultOpen?: boolean;
  /** 开关状态变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 卡片与弹窗共享的标题 */
  title: string;
  /** 卡片与弹窗共享的副标题 */
  subtitle?: string;
  /** 顶部小标签 */
  tag?: string;
  /** 顶部标签语义色调 */
  tagTone?: MorphingDialogTagTone;
  /** 可选徽章图标（在卡片与弹窗头部共享展示） */
  icon?: ReactNode;
  /** 触发卡片底部的紧凑元信息摘要 */
  meta?: string;
  /** 展开后弹窗的最大宽度预设 */
  size?: MorphingDialogSize;
  /** 展开后展示的详细正文 */
  children?: ReactNode;
  /** 展开后的底部操作区 */
  footer?: ReactNode;
  /** 触发卡片自定义类名 */
  triggerClassName?: string;
  /** 弹窗面板自定义类名 */
  className?: string;
}
