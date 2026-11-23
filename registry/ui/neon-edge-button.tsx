// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
/**
 * NeonEdgeButton：一束信号色的光沿着边框绕行的按钮，文字始终是主角。
 *
 * 做法：按钮留出一像素内边距作为「边框」，背后放一层旋转的锥形渐变，
 * 内层用实底盖住中间，只露出边缘的那一圈光。
 * 光是纯装饰；用户要求减少动态效果时停止旋转。
 */

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps } from "react";

const SHELL_BASE = [
  "group relative isolate m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none overflow-hidden border-0 bg-border/80 p-px",
  "font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none",
  "transition-[transform,box-shadow] duration-(--ui-duration-fast) ease-out active:scale-[0.98] motion-reduce:active:scale-100",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
].join(" ");

export const neonEdgeShellVariants = cva(SHELL_BASE, {
  variants: {
    radius: {
      pill: "rounded-full",
      default: "rounded-xl",
    },
    tone: {
      signal: "",
      emerald: "",
      amber: "",
      violet: "",
    },
    glow: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      tone: "signal",
      glow: true,
      class:
        "shadow-[0_4px_16px_-4px_color-mix(in_oklab,var(--ui-signal)_34%,transparent)] hover:shadow-[0_6px_22px_-4px_color-mix(in_oklab,var(--ui-signal)_46%,transparent)] dark:shadow-[0_0_24px_-6px_var(--ui-signal)]",
    },
    {
      tone: "emerald",
      glow: true,
      class:
        "shadow-[0_4px_16px_-4px_rgba(16,185,129,0.34)] hover:shadow-[0_6px_22px_-4px_rgba(16,185,129,0.46)] dark:shadow-[0_0_24px_-6px_rgba(16,185,129,0.85)]",
    },
    {
      tone: "amber",
      glow: true,
      class:
        "shadow-[0_4px_16px_-4px_rgba(245,158,11,0.34)] hover:shadow-[0_6px_22px_-4px_rgba(245,158,11,0.46)] dark:shadow-[0_0_24px_-6px_rgba(245,158,11,0.85)]",
    },
    {
      tone: "violet",
      glow: true,
      class:
        "shadow-[0_4px_16px_-4px_rgba(139,92,246,0.34)] hover:shadow-[0_6px_22px_-4px_rgba(139,92,246,0.46)] dark:shadow-[0_0_24px_-6px_rgba(139,92,246,0.85)]",
    },
  ],
  defaultVariants: {
    radius: "pill",
    tone: "signal",
    glow: true,
  },
});

export const neonEdgeInnerVariants = cva(
  "inline-flex w-full items-center justify-center gap-2 transition-colors duration-(--ui-duration-fast) [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground group-hover:bg-primary/92",
        surface: "bg-card text-foreground group-hover:bg-accent/70 dark:bg-card",
        signal: "bg-signal text-signal-foreground group-hover:bg-signal/92",
      },
      size: {
        sm: "h-8 px-3.5 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-11 px-6 text-[15px]",
      },
      radius: {
        pill: "rounded-full",
        default: "rounded-[calc(var(--ui-radius-xl)-1px)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      radius: "pill",
    },
  },
);

/** 边缘旋转光束的色调类名 */
export const NEON_BEAM_CLASSES = {
  signal: "to-signal",
  emerald: "to-emerald-500",
  amber: "to-amber-500",
  violet: "to-violet-500",
} as const;
type ShellProps = VariantProps<typeof neonEdgeShellVariants>;
type InnerProps = VariantProps<typeof neonEdgeInnerVariants>;

/** 内层表面视觉变体 */
export type NeonEdgeButtonVariant = NonNullable<InnerProps["variant"]>;

/** 边缘流光的色调 */
export type NeonEdgeButtonTone = NonNullable<ShellProps["tone"]>;

/** 按钮尺寸 */
export type NeonEdgeButtonSize = NonNullable<InnerProps["size"]>;

/** 圆角风格 */
export type NeonEdgeButtonRadius = NonNullable<ShellProps["radius"]>;

export interface NeonEdgeButtonProps extends ComponentProps<"button"> {
  /** 内层表面变体，默认 primary */
  variant?: NeonEdgeButtonVariant;
  /** 边缘光色调，默认 signal */
  tone?: NeonEdgeButtonTone;
  /** 按钮尺寸，默认 md */
  size?: NeonEdgeButtonSize;
  /** 圆角风格，默认 pill */
  radius?: NeonEdgeButtonRadius;
  /** 边缘光绕行速度的倍数，默认 1（约 3 秒一圈） */
  speed?: number;
  /** 是否带一圈静态的微光，默认开启 */
  glow?: boolean;
}
/** 速度倍数为 1 时绕行一圈的秒数 */
const BASE_DURATION_S = 3;

export const NeonEdgeButton = ({
  variant = "primary",
  tone = "signal",
  size = "md",
  radius = "pill",
  speed = 1,
  glow = true,
  className,
  children,
  type = "button",
  ...props
}: NeonEdgeButtonProps) => (
  <button
    type={type}
    data-slot="neon-edge-button"
    data-variant={variant}
    data-tone={tone}
    data-size={size}
    data-radius={radius}
    className={cn(neonEdgeShellVariants({ radius, tone, glow }), className)}
    {...props}
  >
    <span
      aria-hidden="true"
      data-slot="neon-edge-light"
      style={{ animationDuration: `${BASE_DURATION_S / Math.max(speed, 0.1)}s` }}
      className={cn(
        "absolute inset-[-150%] -z-10 animate-spin bg-conic from-transparent from-76% motion-reduce:animate-none",
        NEON_BEAM_CLASSES[tone],
      )}
    />
    <span className={neonEdgeInnerVariants({ variant, size, radius })}>{children}</span>
  </button>
);
