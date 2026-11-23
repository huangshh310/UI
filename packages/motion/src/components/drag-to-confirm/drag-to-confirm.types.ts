/**
 * DragToConfirm 的类型定义。
 */
import type { ReactNode } from "react";

/** 语义色调 */
export type DragToConfirmTone = "signal" | "destructive" | "emerald";

/** 滑轨材质变体 */
export type DragToConfirmVariant = "subtle" | "glass";

/** 滑轨尺寸 */
export type DragToConfirmSize = "sm" | "md" | "lg";

export interface DragToConfirmProps {
  /** 轨道上的提示文字，也是滑块的可访问名称，默认「Slide to confirm」 */
  label?: string;
  /** 确认后显示的文字，默认「Confirmed」 */
  confirmedLabel?: string;
  /** 语义色调，默认 signal */
  tone?: DragToConfirmTone;
  /** 滑轨材质变体，默认 subtle */
  variant?: DragToConfirmVariant;
  /** 滑轨尺寸，默认 md */
  size?: DragToConfirmSize;
  /** 自定义滑块未确认时的图标，默认为右箭头 */
  icon?: ReactNode;
  /** 确认时调用 */
  onConfirm?: () => void;
  /** 自动复位时调用 */
  onReset?: () => void;
  /** 确认后多久自动复位，单位毫秒；0 表示不复位。默认 2500 */
  autoResetDelay?: number;
  /** 跨过确认阈值与确认时是否触发设备震动反馈，默认是 */
  haptics?: boolean;
  disabled?: boolean;
  className?: string;
}
