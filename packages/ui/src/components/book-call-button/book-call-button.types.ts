/**
 * BookCallButton 的类型定义。
 */
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import type {
  bookCallButtonVariants,
  bookCallCapsuleVariants,
} from "./book-call-button.variants.js";

type ButtonVariantProps = VariantProps<typeof bookCallButtonVariants>;
type CapsuleVariantProps = VariantProps<typeof bookCallCapsuleVariants>;

/** 按钮底面视觉变体 */
export type BookCallButtonVariant = NonNullable<ButtonVariantProps["variant"]>;

/** 展开胶囊的色调 */
export type BookCallButtonTone = NonNullable<CapsuleVariantProps["tone"]>;

/** 按钮尺寸 */
export type BookCallButtonSize = NonNullable<ButtonVariantProps["size"]>;

export interface BookCallButtonProps extends Omit<ComponentProps<"button">, "children"> {
  /** 按钮上的文字，默认「Book a call」 */
  label?: string;
  /** 悬停展开时显示在图标旁的辅助文案（纯视觉装饰，不改变可访问名称） */
  hoverLabel?: string;
  /** 按钮底面变体，默认 primary */
  variant?: BookCallButtonVariant;
  /** 展开胶囊的色调，默认 signal */
  tone?: BookCallButtonTone;
  /** 按钮尺寸，默认 md */
  size?: BookCallButtonSize;
  /** 静置时左侧胶囊内的图标，默认为右上箭头 */
  leadingIcon?: ReactNode;
  /** 悬停展开后居中的图标，默认为电话图标 */
  icon?: ReactNode;
}
