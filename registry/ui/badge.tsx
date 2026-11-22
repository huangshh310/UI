// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type HTMLAttributes, type ReactNode } from "react";

export const badgeVariants = cva(
  "inline-flex h-5.5 items-center gap-1.5 border border-solid px-2 font-sans text-[11px] font-medium leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground",
        secondary: "border-border/60 bg-secondary text-secondary-foreground",
        outline: "border-border bg-background text-muted-foreground dark:bg-card",
        signal: "border-signal bg-signal text-signal-foreground",
        success: "border-emerald-600/25 bg-emerald-600/10 text-emerald-800 dark:text-emerald-300",
        warning: "border-amber-600/25 bg-amber-500/12 text-amber-800 dark:text-amber-300",
        destructive: "border-rose-600/25 bg-rose-600/10 text-rose-800 dark:text-rose-300",
      },
      shape: {
        pill: "rounded-full",
        tag: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "secondary",
      shape: "pill",
    },
  },
);
export type BadgeVariant =
  "default" | "secondary" | "outline" | "signal" | "success" | "warning" | "destructive";

export type BadgeShape = "pill" | "tag";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 语义色调变体 */
  variant?: BadgeVariant;
  /** 圆角形态：胶囊（pill）或轻量标签（tag） */
  shape?: BadgeShape;
  /** 是否在左侧显示 6px 状态圆点 */
  dot?: boolean;
  /** 左侧图标插槽 */
  icon?: ReactNode;
}
export const Badge = ({
  variant = "secondary",
  shape = "pill",
  dot = false,
  icon,
  children,
  className,
  ...props
}: BadgeProps) => (
  <span
    data-slot="badge"
    data-variant={variant}
    className={cn(badgeVariants({ variant, shape }), className)}
    {...props}
  >
    {dot && (
      <span
        data-slot="badge-dot"
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full bg-current"
      />
    )}
    {icon && (
      <span aria-hidden="true" className="shrink-0">
        {icon}
      </span>
    )}
    {children}
  </span>
);
