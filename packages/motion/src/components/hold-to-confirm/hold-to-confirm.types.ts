/**
 * HoldToConfirm 的类型定义。
 */
import type { ReactNode } from "react";

/** 蓄力进度与确认后的语义色调 */
export type HoldToConfirmTone = "signal" | "destructive" | "emerald";

/** 按钮底面视觉变体 */
export type HoldToConfirmVariant = "surface" | "solid" | "outline";

/** 按钮尺寸 */
export type HoldToConfirmSize = "sm" | "md" | "lg";

/** 圆角风格 */
export type HoldToConfirmRadius = "pill" | "default";

export interface HoldToConfirmProps {
  /** 默认按住提示文案 */
  label?: string;
  /** 完成确认后的文案 */
  confirmedLabel?: string;
  /** 需要持续按住的毫秒数（默认 900ms） */
  holdDurationMs?: number;
  /** 语义色调，默认 signal */
  tone?: HoldToConfirmTone;
  /** 底面视觉变体，默认 surface */
  variant?: HoldToConfirmVariant;
  /** 按钮尺寸，默认 md */
  size?: HoldToConfirmSize;
  /** 圆角风格，默认 pill */
  radius?: HoldToConfirmRadius;
  /** 未确认状态的可选前置图标 */
  icon?: ReactNode;
  /** 确认后是否显示重置按钮，默认显示 */
  showReset?: boolean;
  /** 完成确认回调 */
  onConfirm?: () => void;
  /** 点击重置按钮后的回调 */
  onReset?: () => void;
  /** 禁用状态 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}
