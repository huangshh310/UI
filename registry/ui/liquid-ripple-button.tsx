// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * LiquidRippleButton：按下时从指针位置扩散出一道波纹的按钮。
 *
 * 波纹用 Web Animations API 驱动，不需要额外的 CSS 关键帧。
 * 波纹是纯装饰，对辅助技术隐藏；用户要求减少动态效果时不生成波纹。
 */

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, type PointerEvent, useRef, useState } from "react";

const BASE_CLASSES = [
  "relative isolate m-0 box-border inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden",
  "appearance-none border border-solid border-transparent",
  "font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none",
  "transition-[background-color,border-color,color,transform,box-shadow] duration-(--ui-duration-fast) ease-out active:scale-[0.985] motion-reduce:active:scale-100",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
].join(" ");

export const liquidRippleButtonVariants = cva(BASE_CLASSES, {
  variants: {
    variant: {
      primary:
        "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.08)] hover:bg-primary/92 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(0,0,0,0.3)]",
      signal:
        "bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(101,71,212,0.28)] hover:bg-signal/92",
      secondary:
        "border-border/60 bg-secondary text-secondary-foreground shadow-xs hover:border-border hover:bg-accent",
      outline:
        "border-border bg-card text-foreground shadow-xs hover:border-foreground/22 hover:bg-accent/70 dark:bg-card/85 dark:hover:bg-accent",
      destructive:
        "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.08)] hover:bg-destructive/92",
    },
    size: {
      sm: "h-8 px-3.5 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-11 px-6 text-[15px]",
    },
    radius: {
      pill: "rounded-full",
      default: "rounded-lg",
    },
  },
  compoundVariants: [{ size: "lg", radius: "default", class: "rounded-xl" }],
  defaultVariants: {
    variant: "primary",
    size: "md",
    radius: "pill",
  },
});

/** 各变体对应的默认波纹色，确保浅底与深底都清晰可辨 */
export const RIPPLE_TONE_CLASSES = {
  primary: "bg-primary-foreground",
  signal: "bg-signal-foreground",
  secondary: "bg-foreground/25",
  outline: "bg-foreground/20",
  destructive: "bg-destructive-foreground",
} as const;
type LiquidRippleVariantProps = VariantProps<typeof liquidRippleButtonVariants>;

/** 视觉变体 */
export type LiquidRippleButtonVariant = NonNullable<LiquidRippleVariantProps["variant"]>;

/** 尺寸 */
export type LiquidRippleButtonSize = NonNullable<LiquidRippleVariantProps["size"]>;

/** 圆角风格 */
export type LiquidRippleButtonRadius = NonNullable<LiquidRippleVariantProps["radius"]>;

export interface LiquidRippleButtonProps extends ComponentProps<"button"> {
  /** 视觉变体，默认 primary */
  variant?: LiquidRippleButtonVariant;
  /** 尺寸，默认 md */
  size?: LiquidRippleButtonSize;
  /** 圆角风格，默认 pill */
  radius?: LiquidRippleButtonRadius;
  /** 自定义波纹颜色（CSS 颜色值），未提供时随变体自动匹配 */
  rippleColor?: string;
}

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
