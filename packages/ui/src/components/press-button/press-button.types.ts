/**
 * PressButton 的类型定义。
 */
import type { ButtonProps } from "../button/index.js";

/** 按键的立体层级：raised 带微浮立体触感，flat 为平面按压 */
export type PressButtonElevation = "raised" | "flat";

export interface PressButtonProps extends ButtonProps {
  /** 按下时缩小的比例，取值会被限制在 0.01 到 0.06 之间，默认 0.04 */
  pressStrength?: number;
  /** 是否撑满父容器的宽度 */
  fullWidth?: boolean;
  /** 按键的立体层级，默认 raised */
  elevation?: PressButtonElevation;
}
