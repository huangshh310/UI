// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
/**
 * PressButton：按下时轻微压缩、松开后带一点回弹的按钮，给出实体按键的触感。
 *
 * 在 Button 之上增加弹性缩放与立体按压层级；变体、尺寸、圆角、加载状态等全部沿用 Button。
 * 用户要求减少动态效果时不做缩放。
 */

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type CSSProperties } from "react";

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
/** 把按压强度限制在可用范围内，过大的形变会显得失真 */
const clampStrength = (strength: number) => Math.min(0.06, Math.max(0.01, strength));

const RAISED_CLASSES =
  "shadow-[0_2px_6px_-1px_rgba(0,0,0,0.12),inset_0_-1.5px_0_rgba(0,0,0,0.14)] hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.16),inset_0_-1.5px_0_rgba(0,0,0,0.14)] active:shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.5),inset_0_-1.5px_0_rgba(0,0,0,0.26)]";

export const PressButton = ({
  pressStrength = 0.04,
  fullWidth = false,
  elevation = "raised",
  className,
  style,
  ...props
}: PressButtonProps) => (
  <Button
    data-slot="press-button"
    data-elevation={elevation}
    style={{ "--press-scale": 1 - clampStrength(pressStrength), ...style } as CSSProperties}
    className={cn(
      // 回弹曲线的第二个控制点大于 1，松开时会略微冲过原始大小再回落
      "transition-[scale,background-color,border-color,box-shadow] duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)]",
      "active:translate-y-0 active:scale-(--press-scale) motion-reduce:active:scale-100",
      elevation === "raised" && RAISED_CLASSES,
      fullWidth && "w-full",
      className,
    )}
    {...props}
  />
);
