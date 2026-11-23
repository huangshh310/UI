import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant =
  "default" | "secondary" | "soft" | "outline" | "signal" | "success" | "warning" | "destructive";

export type BadgeShape = "pill" | "tag";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 语义色调变体 */
  variant?: BadgeVariant;
  /** 圆角形态：胶囊（pill）或轻量标签（tag） */
  shape?: BadgeShape;
  /** 尺寸规格 */
  size?: BadgeSize;
  /** 是否在左侧显示 6px 状态圆点 */
  dot?: boolean;
  /** 状态圆点是否附带呼吸脉冲光环（仅 dot 为 true 时生效） */
  pulse?: boolean;
  /** 左侧图标插槽 */
  icon?: ReactNode;
}
