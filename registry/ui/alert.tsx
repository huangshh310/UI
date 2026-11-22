// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { type ReactNode, useState } from "react";

export const alertVariants = cva(
  "relative flex items-start gap-3 rounded-xl border border-solid px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        neutral: "border-border bg-card text-foreground",
        info: "border-signal/25 bg-signal/6 text-foreground [&_[data-slot=alert-icon]]:text-signal",
        success:
          "border-emerald-600/25 bg-emerald-600/6 text-foreground [&_[data-slot=alert-icon]]:text-emerald-600 dark:[&_[data-slot=alert-icon]]:text-emerald-400",
        warning:
          "border-amber-600/25 bg-amber-500/8 text-foreground [&_[data-slot=alert-icon]]:text-amber-700 dark:[&_[data-slot=alert-icon]]:text-amber-400",
        destructive:
          "border-destructive/25 bg-destructive/6 text-foreground [&_[data-slot=alert-icon]]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);
export type AlertVariant = "neutral" | "info" | "success" | "warning" | "destructive";

export interface AlertProps {
  /** 语义级别 */
  variant?: AlertVariant;
  /** 提示标题 */
  title: string;
  /** 详细说明 */
  description?: ReactNode;
  /** 自定义左侧图标，省略时按 variant 匹配默认图标 */
  icon?: ReactNode;
  /** 右侧操作按钮槽 */
  action?: ReactNode;
  /** 是否允许关闭 */
  dismissible?: boolean;
  /** 关闭回调 */
  onDismiss?: () => void;
  /** 自定义容器类名 */
  className?: string;
}
const DEFAULT_ICON: Record<AlertVariant, typeof Info> = {
  neutral: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: AlertCircle,
};

export const Alert = (props: AlertProps) => {
  const { variant = "info", dismissible = false } = props;
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const Icon = DEFAULT_ICON[variant];
  const isUrgent = variant === "destructive" || variant === "warning";

  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role={isUrgent ? "alert" : undefined}
      className={cn(alertVariants({ variant }), props.className)}
    >
      <span
        data-slot="alert-icon"
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-muted-foreground"
      >
        {props.icon ?? <Icon className="size-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="m-0 font-sans text-sm font-medium leading-snug text-foreground">
          {props.title}
        </p>
        {props.description && (
          <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {props.description}
          </div>
        )}
      </div>
      {props.action && <div className="shrink-0 self-center">{props.action}</div>}
      {dismissible && (
        <button
          type="button"
          aria-label="关闭提示"
          onClick={() => {
            setDismissed(true);
            props.onDismiss?.();
          }}
          className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X aria-hidden="true" className="size-3.5" />
        </button>
      )}
    </div>
  );
};
