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
import { useRipples } from "./use-ripples.js";

export const LiquidRippleButton = ({
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
      className={cn(
        "relative isolate m-0 box-border inline-flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden",
        "appearance-none rounded-full border border-solid border-transparent bg-primary px-5",
        "font-sans text-sm font-medium whitespace-nowrap text-primary-foreground select-none",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      onPointerDown={handlePointerDown}
      {...props}
    >
      {ripples.map(({ id, x, y, size }) => (
        <span
          key={id}
          ref={animate(id)}
          aria-hidden="true"
          data-slot="ripple"
          className="pointer-events-none absolute -z-10 rounded-full bg-primary-foreground opacity-0"
          style={{ left: x, top: y, width: size, height: size }}
        />
      ))}
      {children}
    </button>
  );
};
