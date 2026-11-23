/**
 * MorphingButton 的类型定义。
 */
import type { ComponentProps, ReactNode } from "react";

/** 按钮所处的阶段 */
export type MorphingButtonStatus = "idle" | "loading" | "success" | "error";

/** 待操作与处理中阶段的视觉变体 */
export type MorphingButtonVariant = "primary" | "signal" | "outline";

/** 成功阶段的语义色调 */
export type MorphingButtonSuccessTone = "signal" | "emerald";

/** 按钮尺寸 */
export type MorphingButtonSize = "sm" | "md" | "lg";

/** 圆角风格 */
export type MorphingButtonRadius = "pill" | "default";

/** 动画库会接管这些事件属性，不能透传给 motion.button */
type MotionOwnedProps = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "children";

export interface MorphingButtonProps extends Omit<ComponentProps<"button">, MotionOwnedProps> {
  /** 当前阶段，由调用方控制 */
  status: MorphingButtonStatus;
  /** 各阶段显示的文字，未提供的沿用默认值 */
  labels?: Partial<Record<MorphingButtonStatus, string>>;
  /** 待操作与处理中阶段的视觉变体，默认 primary */
  variant?: MorphingButtonVariant;
  /** 成功阶段色调，默认 signal */
  successTone?: MorphingButtonSuccessTone;
  /** 按钮尺寸，默认 md */
  size?: MorphingButtonSize;
  /** 圆角风格，默认 pill */
  radius?: MorphingButtonRadius;
  /** 待操作阶段可选的前置图标 */
  idleIcon?: ReactNode;
}
