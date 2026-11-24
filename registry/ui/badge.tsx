// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type HTMLAttributes, type ReactNode } from "react";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border border-solid font-sans font-medium leading-none tracking-[-0.005em] whitespace-nowrap transition-colors duration-(--ui-duration-fast) [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        soft: "border-transparent bg-signal/12 text-info dark:bg-signal/22",
        outline: "border-input bg-card text-foreground",
        signal:
          "border-transparent bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]",
        success:
          "border-transparent bg-emerald-500/12 text-emerald-800 dark:bg-emerald-500/16 dark:text-emerald-300",
        warning:
          "border-transparent bg-amber-500/14 text-amber-900 dark:bg-amber-500/16 dark:text-amber-200",
        destructive:
          "border-transparent bg-rose-500/12 text-rose-800 dark:bg-rose-500/16 dark:text-rose-300",
      },
      shape: {
        pill: "rounded-full",
        tag: "rounded-md",
      },
      size: {
        sm: "h-5 px-2 text-[10px]",
        md: "h-6 px-2.5 text-[11px]",
      },
    },
    defaultVariants: {
      variant: "secondary",
      shape: "pill",
      size: "md",
    },
  },
);
export type BadgeVariant =
  "default" | "secondary" | "soft" | "outline" | "signal" | "success" | "warning" | "destructive";

export type BadgeShape = "pill" | "tag";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 语义色调变体 */
  variant?: BadgeVariant;
  /** 圆角形态：胶囊（pill）或轻量标签（tag） */
  shape?: BadgeShape;
  /** 尺寸规格 */
  size?: BadgeSize;
  /** 是否在左侧显示 6px 状态圆点 */
  dot?: boolean;
  /** 状态圆点是否附带呼吸脉冲光环（仅 dot 为 true 时生效） */
  pulse?: boolean;
  /** 左侧图标插槽 */
  icon?: ReactNode;
}
const BadgeDot = ({ pulse }: { pulse: boolean }) => (
  <span
    data-slot="badge-dot"
    aria-hidden="true"
    className="relative inline-flex size-1.5 shrink-0 items-center justify-center"
  >
    {pulse && (
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />
    )}
    <span className="relative inline-flex size-1.5 rounded-full bg-current" />
  </span>
);

export const Badge = ({
  variant = "secondary",
  shape = "pill",
  size = "md",
  dot = false,
  pulse = false,
  icon,
  children,
  className,
  ...props
}: BadgeProps) => (
  <span
    data-slot="badge"
    data-variant={variant}
    data-size={size}
    className={cn(badgeVariants({ variant, shape, size }), className)}
    {...props}
  >
    {dot && <BadgeDot pulse={pulse} />}
    {icon && (
      <span aria-hidden="true" className="inline-flex shrink-0 items-center">
        {icon}
      </span>
    )}
    {children}
  </span>
);
