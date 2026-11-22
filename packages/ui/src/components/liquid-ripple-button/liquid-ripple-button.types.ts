/**
 * LiquidRippleButton 的类型定义。
 */
import type { ComponentProps } from "react";

export type LiquidRippleButtonProps = ComponentProps<"button">;

/** 一道正在扩散的波纹：起点坐标与直径，单位为像素，相对于按钮左上角 */
export interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}
