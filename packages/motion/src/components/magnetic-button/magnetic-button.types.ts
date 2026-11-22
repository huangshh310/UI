/**
 * MagneticButton 的类型定义。
 */
import type { ComponentProps } from "react";

export interface MagneticButtonProps extends ComponentProps<"button"> {
  /** 按钮被指针吸过去的程度，0 到 1，默认 0.35 */
  strength?: number;
}
