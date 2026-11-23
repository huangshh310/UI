"use client";

import { cn } from "@matt-ui/utils";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import type { AlertProps, AlertVariant } from "./alert.types.js";
import { alertVariants } from "./alert.variants.js";

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
