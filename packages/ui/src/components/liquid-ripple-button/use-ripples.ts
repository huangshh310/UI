/**
 * 波纹的状态逻辑：在指针按下的位置生成波纹，动画结束后移除。
 */
import { useRef, useState, type PointerEvent } from "react";
import type { Ripple } from "./liquid-ripple-button.types.js";

/** 波纹从起点扩散到覆盖整个按钮所需的时间 */
const RIPPLE_DURATION_MS = 650;

const prefersReducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useRipples = () => {
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
