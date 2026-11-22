/**
 * Button 的类型定义。
 */
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import type { buttonVariants } from "./button.variants.js";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/** 视觉变体，决定按钮的强调程度 */
export type ButtonVariant = NonNullable<ButtonVariantProps["variant"]>;

/** 尺寸；icon 用于只含图标的方形按钮 */
export type ButtonSize = NonNullable<ButtonVariantProps["size"]>;

/**
 * Button 的 Props：原生 <button> 的全部属性，加上以下扩展。
 * ref 直接作为普通属性传入（React 19）。
 */
export interface ButtonProps extends ComponentProps<"button"> {
  /** 视觉变体，默认 primary */
  variant?: ButtonVariant;
  /** 尺寸，默认 md。使用 icon 时必须提供 aria-label */
  size?: ButtonSize;
  /**
   * 是否处于加载中。为真时显示旋转指示器，并忽略点击与键盘激活，
   * 防止同一个操作被重复触发。按钮仍可聚焦。
   */
  loading?: boolean;
}
