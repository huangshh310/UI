"use client";

/**
 * MagneticButton：指针靠近时被弹簧拉向指针，离开时弹回原位。
 *
 * 位移加在外层的包裹元素上，按钮本身仍是原生 <button>，键盘与焦点行为不受影响。
 * 内部内容带有轻微二级视差位移，呈现细腻的物理磁吸层次；用户要求减少动态效果时不移动。
 */
import { cn } from "@matt-ui/utils";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import {
  MAGNETIC_BASE_CLASSES,
  MAGNETIC_RADIUS_CLASSES,
  MAGNETIC_SIZE_CLASSES,
  MAGNETIC_VARIANT_CLASSES,
} from "./magnetic-button.styles.js";
import type { MagneticButtonProps } from "./magnetic-button.types.js";

/** 弹簧参数：略欠阻尼，松开时会轻微回摆 */
const SPRING = { stiffness: 260, damping: 18, mass: 0.6 };

/** 磁吸弹簧与二级视差位移控制 */
const useMagneticPull = (strength: number, disabled: boolean) => {
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);
  const innerX = useTransform(x, (v) => v * 0.25);
  const innerY = useTransform(y, (v) => v * 0.25);
  const pull = Math.min(1, Math.max(0, strength));

  const follow = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduceMotion || disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * pull);
    y.set((event.clientY - rect.top - rect.height / 2) * pull);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return { x, y, innerX, innerY, reduceMotion, follow, release };
};

export const MagneticButton = ({
  variant = "primary",
  size = "md",
  radius = "pill",
  strength = 0.35,
  disabled = false,
  className,
  children,
  type = "button",
  ...props
}: MagneticButtonProps) => {
  const { x, y, innerX, innerY, reduceMotion, follow, release } = useMagneticPull(
    strength,
    disabled,
  );

  return (
    <motion.span
      data-slot="magnetic-button"
      data-variant={variant}
      data-size={size}
      data-radius={radius}
      style={{ x, y }}
      className="inline-block"
      onPointerMove={follow}
      onPointerLeave={release}
    >
      <button
        type={type}
        disabled={disabled}
        className={cn(
          MAGNETIC_BASE_CLASSES,
          MAGNETIC_VARIANT_CLASSES[variant],
          MAGNETIC_SIZE_CLASSES[size],
          MAGNETIC_RADIUS_CLASSES[radius],
          className,
        )}
        {...props}
      >
        <motion.span
          style={reduceMotion ? undefined : { x: innerX, y: innerY }}
          className="inline-flex items-center justify-center gap-2"
        >
          {children}
        </motion.span>
      </button>
    </motion.span>
  );
};
