/**
 * TypewriterButton 的类型定义。
 */
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import type { typewriterButtonVariants } from "./typewriter-button.variants.js";

type TypewriterVariantProps = VariantProps<typeof typewriterButtonVariants>;

/** 视觉变体 */
export type TypewriterButtonVariant = NonNullable<TypewriterVariantProps["variant"]>;

/** 尺寸 */
export type TypewriterButtonSize = NonNullable<TypewriterVariantProps["size"]>;

/** 圆角风格 */
export type TypewriterButtonRadius = NonNullable<TypewriterVariantProps["radius"]>;

/** 光标形态：竖线或终端方块 */
export type TypewriterCursorStyle = "line" | "block";

export interface TypewriterButtonProps extends Omit<ComponentProps<"button">, "children"> {
  /** 按钮上的文字，逐字显示的就是它 */
  label: string;
  /** 视觉变体，默认 outline */
  variant?: TypewriterButtonVariant;
  /** 按钮尺寸，默认 md */
  size?: TypewriterButtonSize;
  /** 圆角风格，默认 pill */
  radius?: TypewriterButtonRadius;
  /** 可选命令提示符前缀（如 "$" 或 ">"），纯视觉装饰 */
  prefix?: string;
  /** 打字光标样式，默认 line */
  cursorStyle?: TypewriterCursorStyle;
  /** 每个字符之间的间隔，单位毫秒，默认 75 */
  charDuration?: number;
  /** 挂载后是否立即开始打字，默认否 */
  autoStart?: boolean;
  /** 逐字显示时是否播放机械按键音效，默认是 */
  sound?: boolean;
  /** 全部字符显示完后调用 */
  onComplete?: () => void;
}
