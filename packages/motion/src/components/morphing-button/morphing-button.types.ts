/**
 * MorphingButton 的类型定义。
 */
import type { ComponentProps } from "react";

/** 按钮所处的阶段 */
export type MorphingButtonStatus = "idle" | "loading" | "success" | "error";

/** 动画库会接管这些事件属性，不能透传给 motion.button */
type MotionOwnedProps = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "children";

export interface MorphingButtonProps extends Omit<ComponentProps<"button">, MotionOwnedProps> {
  /** 当前阶段，由调用方控制 */
  status: MorphingButtonStatus;
  /** 各阶段显示的文字，未提供的沿用默认值 */
  labels?: Partial<Record<MorphingButtonStatus, string>>;
}
