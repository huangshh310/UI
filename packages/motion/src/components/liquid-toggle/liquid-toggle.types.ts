/**
 * LiquidToggle 的类型定义。
 */
import type { ComponentProps } from "react";

export interface LiquidToggleProps extends Omit<ComponentProps<"button">, "children" | "onChange"> {
  /** 受控的开关状态 */
  checked?: boolean;
  /** 非受控时的初始状态，默认关 */
  defaultChecked?: boolean;
  /** 状态变化时调用，参数是新状态 */
  onCheckedChange?: (checked: boolean) => void;
}
