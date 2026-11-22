"use client";

import { cn } from "@matt-ui/utils";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
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
