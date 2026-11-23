/**
 * LiquidRippleButton 的类型定义。
 */
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import type { liquidRippleButtonVariants } from "./liquid-ripple-button.variants.js";

type LiquidRippleVariantProps = VariantProps<typeof liquidRippleButtonVariants>;

/** 视觉变体 */
export type LiquidRippleButtonVariant = NonNullable<LiquidRippleVariantProps["variant"]>;

/** 尺寸 */
export type LiquidRippleButtonSize = NonNullable<LiquidRippleVariantProps["size"]>;

/** 圆角风格 */
export type LiquidRippleButtonRadius = NonNullable<LiquidRippleVariantProps["radius"]>;

export interface LiquidRippleButtonProps extends ComponentProps<"button"> {
  /** 视觉变体，默认 primary */
  variant?: LiquidRippleButtonVariant;
  /** 尺寸，默认 md */
  size?: LiquidRippleButtonSize;
  /** 圆角风格，默认 pill */
  radius?: LiquidRippleButtonRadius;
  /** 自定义波纹颜色（CSS 颜色值），未提供时随变体自动匹配 */
  rippleColor?: string;
}

/** 一道正在扩散的波纹：起点坐标与直径，单位为像素，相对于按钮左上角 */
export interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}
