/**
 * MagneticButton 的类型定义。
 */
import type { ComponentProps } from "react";

/** 视觉变体 */
export type MagneticButtonVariant = "primary" | "signal" | "secondary" | "outline" | "ghost";

/** 尺寸 */
export type MagneticButtonSize = "sm" | "md" | "lg";

/** 圆角风格 */
export type MagneticButtonRadius = "pill" | "default";

export interface MagneticButtonProps extends ComponentProps<"button"> {
  /** 视觉变体，默认 primary */
  variant?: MagneticButtonVariant;
  /** 按钮尺寸，默认 md */
  size?: MagneticButtonSize;
  /** 圆角风格，默认 pill */
  radius?: MagneticButtonRadius;
  /** 按钮被指针吸过去的程度，0 到 1，默认 0.35 */
  strength?: number;
}
