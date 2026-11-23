/**
 * LiquidToggle 的类型定义。
 */
import type { ComponentProps } from "react";

/** 开关尺寸 */
export type LiquidToggleSize = "sm" | "md" | "lg";

/** 开启状态的语义色调 */
export type LiquidToggleTone = "signal" | "primary" | "emerald" | "destructive";

/** 轨道外观变体 */
export type LiquidToggleVariant = "filled" | "subtle";

export interface LiquidToggleProps extends Omit<ComponentProps<"button">, "children" | "onChange"> {
  /** 受控的开关状态 */
  checked?: boolean;
  /** 非受控时的初始状态，默认关 */
  defaultChecked?: boolean;
  /** 状态变化时调用，参数是新状态 */
  onCheckedChange?: (checked: boolean) => void;
  /** 开关尺寸，默认 md */
  size?: LiquidToggleSize;
  /** 开启状态的语义色调，默认 signal */
  tone?: LiquidToggleTone;
  /** 轨道外观变体，默认 filled */
  variant?: LiquidToggleVariant;
}
