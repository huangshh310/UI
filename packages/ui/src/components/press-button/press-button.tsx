/**
 * PressButton：按下时轻微压缩、松开后带一点回弹的按钮，给出实体按键的触感。
 *
 * 在 Button 之上只增加按压动效；变体、尺寸、加载状态等全部沿用 Button。
 * 用户要求减少动态效果时不做缩放。
 */
import { cn } from "@matt-ui/utils";
import type { CSSProperties } from "react";
import { Button } from "../button/index.js";
import type { PressButtonProps } from "./press-button.types.js";

/** 把按压强度限制在可用范围内，过大的形变会显得失真 */
const clampStrength = (strength: number) => Math.min(0.06, Math.max(0.01, strength));

export const PressButton = ({
  pressStrength = 0.04,
  fullWidth = false,
  className,
  style,
  ...props
}: PressButtonProps) => (
  <Button
    data-slot="press-button"
    style={{ "--press-scale": 1 - clampStrength(pressStrength), ...style } as CSSProperties}
    className={cn(
      // 回弹曲线的第二个控制点大于 1，松开时会略微冲过原始大小再回落
      "transition-[scale,background-color] duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)]",
      "active:translate-y-0 active:scale-(--press-scale) motion-reduce:active:scale-100",
      fullWidth && "w-full",
      className,
    )}
    {...props}
  />
);
