// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * MagneticButton：指针靠近时被弹簧拉向指针，离开时弹回原位。
 *
 * 位移加在外层的包裹元素上，按钮本身仍是原生 <button>，键盘与焦点行为不受影响。
 * 内部内容带有轻微二级视差位移，呈现细腻的物理磁吸层次；用户要求减少动态效果时不移动。
 */

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { type ComponentProps, type PointerEvent } from "react";

/** 视觉变体 */
export type MagneticButtonVariant = "primary" | "signal" | "secondary" | "outline" | "ghost";

/** 尺寸 */
export type MagneticButtonSize = "sm" | "md" | "lg";

/** 圆角风格 */
export type MagneticButtonRadius = "pill" | "default";

export interface MagneticButtonProps extends ComponentProps<"button"> {
  /** 视觉变体，默认 primary */
  variant?: MagneticButtonVariant;
  /** 按钮尺寸，默认 md */
  size?: MagneticButtonSize;
  /** 圆角风格，默认 pill */
  radius?: MagneticButtonRadius;
  /** 按钮被指针吸过去的程度，0 到 1，默认 0.35 */
  strength?: number;
}
const MAGNETIC_BASE_CLASSES =
  "m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center border border-solid font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none transition-[background-color,border-color,color,transform,box-shadow] duration-(--ui-duration-fast) ease-out active:scale-[0.97] motion-reduce:active:scale-100 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const MAGNETIC_VARIANT_CLASSES: Record<MagneticButtonVariant, string> = {
  primary:
    "border-transparent bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_2px_8px_-2px_rgba(0,0,0,0.14)] hover:bg-primary/92 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_2px_10px_-2px_rgba(0,0,0,0.45)]",
  signal:
    "border-transparent bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_4px_14px_-4px_color-mix(in_oklab,var(--ui-signal)_45%,transparent)] hover:bg-signal/92",
  secondary:
    "border-border/70 bg-secondary text-secondary-foreground shadow-xs hover:border-border hover:bg-accent",
  outline:
    "border-border bg-card text-foreground shadow-xs hover:border-foreground/22 hover:bg-accent/70 dark:bg-card/85 dark:hover:bg-accent",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-accent/80",
};

const MAGNETIC_SIZE_CLASSES: Record<MagneticButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

const MAGNETIC_RADIUS_CLASSES: Record<MagneticButtonRadius, string> = {
  pill: "rounded-full",
  default: "rounded-xl",
};
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
