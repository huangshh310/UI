"use client";

/**
 * LockInput 的内部视觉与交互子部件：标签栏、反馈脚栏与右侧操作组。
 */
import { cn } from "@matt-ui/utils";
import { AlertCircle, Check, Copy, Eye, EyeOff, Lock, LockOpen, X } from "lucide-react";
import type { ReactNode } from "react";
import type { LockInputRadius, LockInputSize } from "./lock-input.types.js";
import { lockInputActionVariants } from "./lock-input.variants.js";

const SHORTCUT_CLASSES =
  "pointer-events-none inline-flex shrink-0 items-center rounded-md border border-border bg-muted/85 px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium text-muted-foreground";

export const FieldHeading = ({
  htmlFor,
  label,
  labelExtra,
}: {
  htmlFor: string;
  label?: string;
  labelExtra?: ReactNode;
}) => {
  if (!label && !labelExtra) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      {label ? (
        <label
          htmlFor={htmlFor}
          className="text-[13px] font-medium tracking-[-0.01em] text-foreground"
        >
          {label}
        </label>
      ) : (
        <span />
      )}
      {labelExtra && (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          {labelExtra}
        </span>
      )}
    </div>
  );
};

export const FieldFooter = ({
  id,
  error,
  hint,
  showCount,
  length,
  maxLength,
}: {
  id: string;
  error?: string;
  hint?: string;
  showCount: boolean;
  length: number;
  maxLength?: number;
}) => {
  if (!error && !hint && !showCount) return null;
  const overLimit = maxLength !== undefined && length >= maxLength;

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        {error ? (
          <p id={id} role="alert" className="m-0 flex items-start gap-1.5 text-xs text-destructive">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p id={id} className="m-0 text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
      {showCount && (
        <span
          className={cn(
            "shrink-0 font-mono text-[11px] tabular-nums",
            overLimit ? "font-medium text-destructive" : "text-muted-foreground",
          )}
        >
          {maxLength !== undefined ? `${length} / ${maxLength}` : length}
        </span>
      )}
    </div>
  );
};

const RevealButton = ({
  revealed,
  disabled,
  actionClass,
  onToggle,
}: {
  revealed: boolean;
  disabled?: boolean;
  actionClass: string;
  onToggle: () => void;
}) => (
  <button
    type="button"
    disabled={disabled}
    aria-label={revealed ? "隐藏内容" : "显示内容"}
    aria-pressed={revealed}
    onClick={onToggle}
    className={actionClass}
  >
    {revealed ? (
      <EyeOff aria-hidden="true" className="size-3.5" />
    ) : (
      <Eye aria-hidden="true" className="size-3.5" />
    )}
  </button>
);

const CopyButton = ({
  copied,
  disabled,
  actionClass,
  onCopy,
}: {
  copied: boolean;
  disabled?: boolean;
  actionClass: string;
  onCopy: () => void;
}) => (
  <button
    type="button"
    disabled={disabled}
    aria-label={copied ? "已复制" : "复制内容"}
    onClick={onCopy}
    className={cn(actionClass, copied && "text-foreground")}
  >
    {copied ? (
      <Check aria-hidden="true" className="size-3.5" />
    ) : (
      <Copy aria-hidden="true" className="size-3.5" />
    )}
  </button>
);

const LockControl = ({
  isLocked,
  lockable,
  disabled,
  actionClass,
  onToggle,
}: {
  isLocked: boolean;
  lockable: boolean;
  disabled?: boolean;
  actionClass: string;
  onToggle: () => void;
}) => {
  if (lockable) {
    return (
      <button
        type="button"
        disabled={disabled}
        aria-pressed={isLocked}
        aria-label={isLocked ? "解锁编辑" : "锁定为只读"}
        onClick={onToggle}
        className={cn(actionClass, isLocked && "bg-secondary text-foreground hover:bg-accent")}
      >
        {isLocked ? (
          <Lock aria-hidden="true" className="size-3.5" />
        ) : (
          <LockOpen aria-hidden="true" className="size-3.5" />
        )}
      </button>
    );
  }
  if (!isLocked) return null;
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary/90 text-muted-foreground"
    >
      <Lock className="size-3.5" />
    </span>
  );
};

export interface TrailingActionsProps {
  size: LockInputSize;
  radius: LockInputRadius;
  disabled?: boolean;
  isLocked: boolean;
  lockable: boolean;
  showClear: boolean;
  showReveal: boolean;
  revealed: boolean;
  copyable: boolean;
  copied: boolean;
  shortcut?: string;
  suffix?: ReactNode;
  onClear: () => void;
  onToggleReveal: () => void;
  onCopy: () => void;
  onToggleLock: () => void;
}

export const TrailingActions = (props: TrailingActionsProps) => {
  const actionClass = lockInputActionVariants({ size: props.size, radius: props.radius });

  return (
    <div className="flex shrink-0 items-center gap-1 empty:hidden">
      {props.showClear && (
        <button type="button" aria-label="清空输入" onClick={props.onClear} className={actionClass}>
          <X aria-hidden="true" className="size-3.5" />
        </button>
      )}
      {props.showReveal && (
        <RevealButton
          revealed={props.revealed}
          disabled={props.disabled}
          actionClass={actionClass}
          onToggle={props.onToggleReveal}
        />
      )}
      {props.copyable && (
        <CopyButton
          copied={props.copied}
          disabled={props.disabled}
          actionClass={actionClass}
          onCopy={props.onCopy}
        />
      )}
      {props.shortcut && <kbd className={SHORTCUT_CLASSES}>{props.shortcut}</kbd>}
      {props.suffix && <span className="shrink-0 text-muted-foreground">{props.suffix}</span>}
      <LockControl
        isLocked={props.isLocked}
        lockable={props.lockable}
        disabled={props.disabled}
        actionClass={actionClass}
        onToggle={props.onToggleLock}
      />
    </div>
  );
};
