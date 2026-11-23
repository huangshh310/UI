// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { type ReactNode, useState } from "react";

export const alertVariants = cva(
  "relative flex items-start gap-3 border border-solid px-4 py-3.5 text-sm transition-colors duration-(--ui-duration-fast)",
  {
    variants: {
      appearance: {
        soft: "rounded-xl shadow-xs",
        accent: "rounded-xl border-border/90 border-l-[3px] bg-card text-foreground shadow-xs",
        solid: "rounded-xl shadow-sm [&_[data-slot=alert-icon]]:text-current",
        banner: "rounded-none border-x-0 border-y py-3 shadow-none",
      },
      variant: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        destructive: "",
      },
    },
    compoundVariants: [
      // soft 与 banner 共用低饱和语义底色
      {
        appearance: ["soft", "banner"],
        variant: "neutral",
        class:
          "border-border bg-card text-foreground [&_[data-slot=alert-icon]]:text-muted-foreground",
      },
      {
        appearance: ["soft", "banner"],
        variant: "info",
        class:
          "border-signal/25 bg-signal/6 text-foreground [&_[data-slot=alert-icon]]:text-blue-700 dark:bg-signal/12 dark:[&_[data-slot=alert-icon]]:text-blue-400",
      },
      {
        appearance: ["soft", "banner"],
        variant: "success",
        class:
          "border-emerald-600/25 bg-emerald-500/8 text-foreground [&_[data-slot=alert-icon]]:text-emerald-700 dark:bg-emerald-500/12 dark:[&_[data-slot=alert-icon]]:text-emerald-400",
      },
      {
        appearance: ["soft", "banner"],
        variant: "warning",
        class:
          "border-amber-600/25 bg-amber-500/10 text-foreground [&_[data-slot=alert-icon]]:text-amber-700 dark:bg-amber-500/14 dark:[&_[data-slot=alert-icon]]:text-amber-400",
      },
      {
        appearance: ["soft", "banner"],
        variant: "destructive",
        class:
          "border-destructive/25 bg-destructive/6 text-foreground [&_[data-slot=alert-icon]]:text-destructive dark:bg-destructive/12",
      },
      // accent：干净卡片底配 3px 左侧语义强调条
      {
        appearance: "accent",
        variant: "neutral",
        class: "border-l-foreground/45 [&_[data-slot=alert-icon]]:text-foreground/75",
      },
      {
        appearance: "accent",
        variant: "info",
        class:
          "border-l-signal [&_[data-slot=alert-icon]]:text-blue-700 dark:[&_[data-slot=alert-icon]]:text-blue-400",
      },
      {
        appearance: "accent",
        variant: "success",
        class:
          "border-l-emerald-600 dark:border-l-emerald-400 [&_[data-slot=alert-icon]]:text-emerald-700 dark:[&_[data-slot=alert-icon]]:text-emerald-400",
      },
      {
        appearance: "accent",
        variant: "warning",
        class:
          "border-l-amber-500 dark:border-l-amber-400 [&_[data-slot=alert-icon]]:text-amber-700 dark:[&_[data-slot=alert-icon]]:text-amber-400",
      },
      {
        appearance: "accent",
        variant: "destructive",
        class: "border-l-destructive [&_[data-slot=alert-icon]]:text-destructive",
      },
      // solid：实色高强调，双主题满足 WCAG AA 对比度
      {
        appearance: "solid",
        variant: "neutral",
        class: "border-primary bg-primary text-primary-foreground",
      },
      {
        appearance: "solid",
        variant: "info",
        class: "border-signal bg-signal text-signal-foreground",
      },
      {
        appearance: "solid",
        variant: "success",
        class:
          "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-800 dark:bg-emerald-800 dark:text-emerald-50",
      },
      {
        appearance: "solid",
        variant: "warning",
        class: "border-amber-400 bg-amber-400 text-amber-950",
      },
      {
        appearance: "solid",
        variant: "destructive",
        class:
          "border-red-700 bg-red-700 text-white dark:border-red-800 dark:bg-red-800 dark:text-red-50",
      },
    ],
    defaultVariants: {
      appearance: "soft",
      variant: "info",
    },
  },
);
export type AlertVariant = "neutral" | "info" | "success" | "warning" | "destructive";
export type AlertAppearance = "soft" | "accent" | "solid" | "banner";

export interface AlertProps {
  /** 语义级别 */
  variant?: AlertVariant;
  /** 视觉呈现形态：柔和底色 / 左侧强调条 / 实色高强调 / 通栏横幅 */
  appearance?: AlertAppearance;
  /** 提示标题 */
  title: string;
  /** 详细说明 */
  description?: ReactNode;
  /** 自定义左侧图标，省略时按 variant 匹配默认图标 */
  icon?: ReactNode;
  /** 右侧操作按钮槽 */
  action?: ReactNode;
  /** 是否允许关闭（传入 onDismiss 时默认自动开启） */
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

const AlertBody = ({
  title,
  description,
  isSolid,
}: {
  title: string;
  description?: ReactNode;
  isSolid: boolean;
}) => (
  <div className="min-w-0 flex-1">
    <p
      className={cn(
        "m-0 font-sans text-sm leading-snug font-medium",
        isSolid ? "text-current" : "text-foreground",
      )}
    >
      {title}
    </p>
    {description && (
      <div
        data-slot="alert-description"
        className={cn(
          "mt-1 text-xs leading-relaxed",
          isSolid ? "text-current opacity-95" : "text-muted-foreground",
        )}
      >
        {description}
      </div>
    )}
  </div>
);

const AlertDismissButton = ({ isSolid, onClick }: { isSolid: boolean; onClick: () => void }) => (
  <button
    type="button"
    aria-label="关闭提示"
    onClick={onClick}
    className={cn(
      "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
      isSolid
        ? "text-current opacity-85 hover:bg-current/15 hover:opacity-100"
        : "text-muted-foreground hover:bg-accent hover:text-foreground",
    )}
  >
    <X aria-hidden="true" className="size-3.5" />
  </button>
);

export const Alert = (props: AlertProps) => {
  const { variant = "info", appearance = "soft" } = props;
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const Icon = DEFAULT_ICON[variant];
  const isUrgent = variant === "destructive" || variant === "warning";
  const isSolid = appearance === "solid";
  const showDismiss = props.dismissible ?? Boolean(props.onDismiss);

  return (
    <div
      data-slot="alert"
      data-variant={variant}
      data-appearance={appearance}
      role={isUrgent ? "alert" : undefined}
      className={cn(alertVariants({ appearance, variant }), props.className)}
    >
      <span
        data-slot="alert-icon"
        aria-hidden="true"
        className="mt-0.5 inline-flex shrink-0 items-center text-muted-foreground"
      >
        {props.icon ?? <Icon className="size-4" />}
      </span>
      <AlertBody title={props.title} description={props.description} isSolid={isSolid} />
      {props.action && <div className="shrink-0 self-center">{props.action}</div>}
      {showDismiss && (
        <AlertDismissButton
          isSolid={isSolid}
          onClick={() => {
            setDismissed(true);
            props.onDismiss?.();
          }}
        />
      )}
    </div>
  );
};
