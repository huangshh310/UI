"use client";

/**
 * LockInput：聚焦时聚焦环由中心收拢「锁定」到边框上的输入框。
 * 交互行为来自原生 <input>，通过 id / aria-describedby / aria-invalid 提供完整无障碍语义。
 */
import { cn } from "@matt-ui/utils";
import { Lock } from "lucide-react";
import { useId, type ReactNode } from "react";
import type { LockInputProps } from "./lock-input.types.js";

const SHELL_CLASSES =
  "relative flex h-10.5 items-center gap-2 rounded-xl border border-solid border-border bg-card px-3.5 text-foreground shadow-xs transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) hover:border-foreground/20 group-focus-within/lock:border-ring group-focus-within/lock:shadow-none data-invalid:border-destructive data-locked:bg-secondary/80";

const RING_CLASSES =
  "pointer-events-none absolute -inset-[3px] rounded-[14px] border-2 border-solid border-ring/25 opacity-0 scale-x-[1.03] scale-y-[1.1] transition-[transform,opacity] duration-(--ui-duration-normal) ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within/lock:scale-100 group-focus-within/lock:opacity-100 group-data-invalid/lock:border-destructive/35";

const INPUT_CLASSES =
  "h-full w-full min-w-0 appearance-none border-0 bg-transparent p-0 font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground/80 disabled:cursor-not-allowed disabled:opacity-50";

const InputFeedback = ({ id, error, hint }: { id: string; error?: string; hint?: string }) => {
  if (error) {
    return (
      <p id={id} role="alert" className="m-0 text-xs text-destructive">
        {error}
      </p>
    );
  }
  if (!hint) return null;
  return (
    <p id={id} className="m-0 text-xs text-muted-foreground">
      {hint}
    </p>
  );
};

const TrailingSlot = ({ locked, suffix }: { locked: boolean; suffix?: ReactNode }) => {
  if (locked) return <Lock aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />;
  if (!suffix) return null;
  return <span className="shrink-0 text-muted-foreground">{suffix}</span>;
};

const joinDescribedBy = (custom: string | undefined, messageId: string, hasMessage: boolean) =>
  [custom, hasMessage ? messageId : undefined].filter(Boolean).join(" ") || undefined;

const InputShell = ({
  locked,
  invalid,
  disabled,
  prefix,
  suffix,
  children,
}: {
  locked: boolean;
  invalid: boolean;
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  children: ReactNode;
}) => (
  <div
    data-invalid={invalid ? "" : undefined}
    data-locked={locked ? "" : undefined}
    className={cn(SHELL_CLASSES, disabled && "pointer-events-none opacity-50")}
  >
    <span aria-hidden="true" data-slot="lock-input-ring" className={RING_CLASSES} />
    {prefix && <span className="shrink-0 text-muted-foreground">{prefix}</span>}
    {children}
    <TrailingSlot locked={locked} suffix={suffix} />
  </div>
);

const FieldHeading = ({ htmlFor, label }: { htmlFor: string; label?: string }) =>
  label ? (
    <label htmlFor={htmlFor} className="text-[13px] font-medium tracking-tight text-foreground">
      {label}
    </label>
  ) : null;

const WRAPPER_CLASSES = "group/lock flex w-full max-w-sm flex-col gap-1.5 font-sans";

export const LockInput = ({
  id,
  label,
  hint,
  error,
  locked = false,
  prefix,
  suffix,
  readOnly,
  disabled,
  className,
  containerClassName,
  "aria-describedby": describedByProp,
  ...props
}: LockInputProps) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const invalid = Boolean(error);

  return (
    <div
      data-slot="lock-input"
      data-locked={locked ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      className={cn(WRAPPER_CLASSES, containerClassName)}
    >
      <FieldHeading htmlFor={inputId} label={label} />
      <InputShell
        locked={locked}
        invalid={invalid}
        disabled={disabled}
        prefix={prefix}
        suffix={suffix}
      >
        <input
          id={inputId}
          readOnly={locked || readOnly}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={joinDescribedBy(describedByProp, messageId, Boolean(error || hint))}
          className={cn(INPUT_CLASSES, className)}
          {...props}
        />
      </InputShell>
      <InputFeedback id={messageId} error={error} hint={hint} />
    </div>
  );
};
