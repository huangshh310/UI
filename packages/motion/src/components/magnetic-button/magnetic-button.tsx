"use client";

/**
 * MagneticButton：指针靠近时被弹簧拉向指针，离开时弹回原位。
 *
 * 位移加在外层的包裹元素上，按钮本身仍是原生 <button>，键盘与焦点行为不受影响。
 * 位移由 motion 的弹簧驱动，不经过 React 渲染；用户要求减少动态效果时不移动。
 */
import { cn } from "@matt-ui/utils";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";
import type { MagneticButtonProps } from "./magnetic-button.types.js";

/** 弹簧参数：略欠阻尼，松开时会轻微回摆 */
const SPRING = { stiffness: 260, damping: 18, mass: 0.6 };

export const MagneticButton = ({
  strength = 0.35,
  className,
  type = "button",
  ...props
}: MagneticButtonProps) => {
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);
  const pull = Math.min(1, Math.max(0, strength));

  /** 按指针相对按钮中心的偏移，按比例设置目标位移 */
  const follow = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * pull);
    y.set((event.clientY - rect.top - rect.height / 2) * pull);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      data-slot="magnetic-button"
      style={{ x, y }}
      className="inline-block"
      onPointerMove={follow}
      onPointerLeave={release}
    >
      <button
        type={type}
        className={cn(
          "m-0 box-border inline-flex h-11 cursor-pointer appearance-none items-center justify-center gap-2 rounded-full border-0 bg-primary px-6",
          "font-sans text-sm font-medium whitespace-nowrap text-primary-foreground select-none",
          "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
          "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
          className,
        )}
        {...props}
      />
    </motion.span>
  );
};
