/**
 * NeonEdgeButton 的类型定义。
 */
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import type { neonEdgeInnerVariants, neonEdgeShellVariants } from "./neon-edge-button.variants.js";

type ShellProps = VariantProps<typeof neonEdgeShellVariants>;
type InnerProps = VariantProps<typeof neonEdgeInnerVariants>;

/** 内层表面视觉变体 */
export type NeonEdgeButtonVariant = NonNullable<InnerProps["variant"]>;

/** 边缘流光的色调 */
export type NeonEdgeButtonTone = NonNullable<ShellProps["tone"]>;

/** 按钮尺寸 */
export type NeonEdgeButtonSize = NonNullable<InnerProps["size"]>;

/** 圆角风格 */
export type NeonEdgeButtonRadius = NonNullable<ShellProps["radius"]>;

export interface NeonEdgeButtonProps extends ComponentProps<"button"> {
  /** 内层表面变体，默认 primary */
  variant?: NeonEdgeButtonVariant;
  /** 边缘光色调，默认 signal */
  tone?: NeonEdgeButtonTone;
  /** 按钮尺寸，默认 md */
  size?: NeonEdgeButtonSize;
  /** 圆角风格，默认 pill */
  radius?: NeonEdgeButtonRadius;
  /** 边缘光绕行速度的倍数，默认 1（约 3 秒一圈） */
  speed?: number;
  /** 是否带一圈静态的微光，默认开启 */
  glow?: boolean;
}
