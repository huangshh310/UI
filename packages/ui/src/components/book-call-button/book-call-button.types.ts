/**
 * BookCallButton 的类型定义。
 */
import type { ComponentProps } from "react";

export interface BookCallButtonProps extends Omit<ComponentProps<"button">, "children"> {
  /** 按钮上的文字，默认「Book a call」 */
  label?: string;
}
