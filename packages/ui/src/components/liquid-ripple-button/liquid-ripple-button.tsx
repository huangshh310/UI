"use client";

/**
 * LiquidRippleButton：按下时从指针位置扩散出一道波纹的按钮。
 *
 * 波纹用 Web Animations API 驱动，不需要额外的 CSS 关键帧。
 * 波纹是纯装饰，对辅助技术隐藏；用户要求减少动态效果时不生成波纹。
 */
import { cn } from "@matt-ui/utils";
import type { PointerEvent } from "react";
import type { LiquidRippleButtonProps } from "./liquid-ripple-button.types.js";
import {
  liquidRippleButtonVariants,
  RIPPLE_TONE_CLASSES,
} from "./liquid-ripple-button.variants.js";
import { useRipples } from "./use-ripples.js";

export const LiquidRippleButton = ({
  variant = "primary",
  size = "md",
  radius = "pill",
  rippleColor,
  className,
  children,
  type = "button",
  onPointerDown,
  ...props
}: LiquidRippleButtonProps) => {
  const { ripples, spawn, animate } = useRipples();

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    spawn(event);
    onPointerDown?.(event);
  };

  return (
    <button
      type={type}
      data-slot="liquid-ripple-button"
      data-variant={variant}
      data-size={size}
      data-radius={radius}
      className={cn(liquidRippleButtonVariants({ variant, size, radius }), className)}
      onPointerDown={handlePointerDown}
      {...props}
    >
      {ripples.map(({ id, x, y, size: diameter }) => (
        <span
          key={id}
          ref={animate(id)}
          aria-hidden="true"
          data-slot="ripple"
          className={cn(
            "pointer-events-none absolute -z-10 rounded-full opacity-0",
            !rippleColor && RIPPLE_TONE_CLASSES[variant],
          )}
          style={{
            left: x,
            top: y,
            width: diameter,
            height: diameter,
            backgroundColor: rippleColor,
          }}
        />
      ))}
      {children}
    </button>
  );
};
