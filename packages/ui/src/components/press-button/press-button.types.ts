/**
 * PressButton 的类型定义。
 */
import type { ButtonProps } from "../button/index.js";

export interface PressButtonProps extends ButtonProps {
  /** 按下时缩小的比例，取值会被限制在 0.01 到 0.06 之间，默认 0.04 */
  pressStrength?: number;
  /** 是否撑满父容器的宽度 */
  fullWidth?: boolean;
}
