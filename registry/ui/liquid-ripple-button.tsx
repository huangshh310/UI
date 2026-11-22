// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * LiquidRippleButton：按下时从指针位置扩散出一道波纹的按钮。
 *
 * 波纹用 Web Animations API 驱动，不需要额外的 CSS 关键帧。
 * 波纹是纯装饰，对辅助技术隐藏；用户要求减少动态效果时不生成波纹。
 */

import { cn } from "@/lib/utils";
import { type ComponentProps, type PointerEvent, useRef, useState } from "react";

export type LiquidRippleButtonProps = ComponentProps<"button">;

/** 一道正在扩散的波纹：起点坐标与直径，单位为像素，相对于按钮左上角 */
export interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}
/** 波纹从起点扩散到覆盖整个按钮所需的时间 */
const RIPPLE_DURATION_MS = 650;

const prefersReducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const useRipples = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  /** 在指针位置生成一道波纹；直径取按钮对角线的两倍，保证从任何位置出发都能盖满 */
  const spawn = (event: PointerEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.hypot(rect.width, rect.height) * 2;
    const ripple = {
      id: nextId.current++,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      size,
    };
    setRipples((current) => [...current, ripple]);
  };

  /** 波纹元素挂载时启动动画，结束后把它从列表中移除 */
  const animate = (id: number) => (element: HTMLSpanElement | null) => {
    if (!element || typeof element.animate !== "function") return;
    const animation = element.animate(
      [
        { transform: "translate(-50%, -50%) scale(0)", opacity: 0.45 },
        { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
      ],
      { duration: RIPPLE_DURATION_MS, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
    animation.onfinish = () =>
      setRipples((current) => current.filter((ripple) => ripple.id !== id));
  };

  return { ripples, spawn, animate };
};
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
