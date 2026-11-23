"use client";

/**
 * LockInput：聚焦时聚焦环由中心收拢「锁定」到边框上的输入框。
 * 交互行为来自原生 <input>，通过 id / aria-describedby / aria-invalid 提供完整无障碍语义，
 * 并扩展多套视觉变体、尺寸、圆角、可切换锁定态、一键清空、一键复制、密码显隐与字数统计。
 */
import { cn } from "@matt-ui/utils";
import { useId, type ReactNode, type RefCallback } from "react";
import { FieldFooter, FieldHeading, TrailingActions } from "./lock-input-controls.js";
import type {
  LockInputProps,
  LockInputRadius,
  LockInputRingTone,
  LockInputSize,
  LockInputVariant,
} from "./lock-input.types.js";
import { lockInputRingVariants, lockInputShellVariants } from "./lock-input.variants.js";
import { useCopyFeedback, useLockInputState, useMergedInputRef } from "./use-lock-input.js";

const WRAPPER_CLASSES = "group/lock flex w-full max-w-sm flex-col gap-1.5 font-sans";

const INPUT_CLASSES =
  "h-full w-full min-w-0 appearance-none border-0 bg-transparent p-0 font-sans text-foreground outline-none placeholder:text-muted-foreground/75 disabled:cursor-not-allowed disabled:opacity-50";

const joinDescribedBy = (custom: string | undefined, messageId: string, hasMessage: boolean) =>
  [custom, hasMessage ? messageId : undefined].filter(Boolean).join(" ") || undefined;

const resolveAppearance = (props: LockInputProps) => ({
  type: props.type ?? "text",
  variant: (props.variant ?? "default") as LockInputVariant,
  size: (props.size ?? "md") as LockInputSize,
  radius: (props.radius ?? "lg") as LockInputRadius,
  ringTone: (props.ringTone ?? "signal") as LockInputRingTone,
});

const stripCustomProps = (props: LockInputProps) => {
  const {
    id: _id,
    ref: _ref,
    type: _type,
    variant: _variant,
    size: _size,
    radius: _radius,
    ringTone: _ringTone,
    mono: _mono,
    label: _label,
    labelExtra: _labelExtra,
    hint: _hint,
    error: _error,
    locked: _locked,
    defaultLocked: _defaultLocked,
    lockable: _lockable,
    onLockedChange: _onLockedChange,
    clearable: _clearable,
    onClear: _onClear,
    copyable: _copyable,
    onCopy: _onCopy,
    revealable: _revealable,
    showCount: _showCount,
    shortcut: _shortcut,
    prefix: _prefix,
    suffix: _suffix,
    readOnly: _readOnly,
    onChange: _onChange,
    className: _className,
    containerClassName: _containerClassName,
    "aria-describedby": _describedBy,
    ...nativeProps
  } = props;
  return nativeProps;
};

interface InputShellProps {
  variant: LockInputVariant;
  size: LockInputSize;
  radius: LockInputRadius;
  ringTone: LockInputRingTone;
  isLocked: boolean;
  invalid: boolean;
  disabled?: boolean;
  prefix?: ReactNode;
  trailing: ReactNode;
  children: ReactNode;
}

const InputShell = ({
  variant,
  size,
  radius,
  ringTone,
  isLocked,
  invalid,
  disabled,
  prefix,
  trailing,
  children,
}: InputShellProps) => (
  <div
    data-invalid={invalid ? "" : undefined}
    data-locked={isLocked ? "" : undefined}
    className={cn(
      lockInputShellVariants({ variant, size, radius, ringTone }),
      disabled && "pointer-events-none opacity-50",
    )}
  >
    <span
      aria-hidden="true"
      data-slot="lock-input-ring"
      className={lockInputRingVariants({ variant, radius, ringTone })}
    />
    {prefix && (
      <span className="inline-flex shrink-0 items-center text-muted-foreground">{prefix}</span>
    )}
    {children}
    {trailing}
  </div>
);

interface InputFrameProps {
  props: LockInputProps;
  inputId: string;
  bindInputRef: RefCallback<HTMLInputElement>;
  describedBy?: string;
  invalid: boolean;
  copied: boolean;
  onCopy: () => void;
  state: ReturnType<typeof useLockInputState>;
}

const renderTrailing = (
  props: LockInputProps,
  copied: boolean,
  onCopy: () => void,
  state: ReturnType<typeof useLockInputState>,
) => {
  const { type, size, radius } = resolveAppearance(props);
  const showClear =
    Boolean(props.clearable) && !state.isLocked && !props.disabled && state.currentValue.length > 0;
  return (
    <TrailingActions
      size={size}
      radius={radius}
      disabled={props.disabled}
      isLocked={state.isLocked}
      lockable={Boolean(props.lockable)}
      showClear={showClear}
      showReveal={Boolean(props.revealable) && type === "password"}
      revealed={state.revealed}
      copyable={Boolean(props.copyable)}
      copied={copied}
      shortcut={props.shortcut}
      suffix={props.suffix}
      onClear={state.handleClear}
      onToggleReveal={state.toggleReveal}
      onCopy={onCopy}
      onToggleLock={state.handleToggleLock}
    />
  );
};

const InputFrame = (frame: InputFrameProps) => {
  const { props, inputId, bindInputRef, describedBy, invalid, copied, onCopy, state } = frame;
  const { variant, size, radius, ringTone } = resolveAppearance(props);

  return (
    <InputShell
      variant={variant}
      size={size}
      radius={radius}
      ringTone={ringTone}
      isLocked={state.isLocked}
      invalid={invalid}
      disabled={props.disabled}
      prefix={props.prefix}
      trailing={renderTrailing(props, copied, onCopy, state)}
    >
      <input
        {...stripCustomProps(props)}
        ref={bindInputRef}
        id={inputId}
        type={state.resolvedType}
        readOnly={state.isLocked || props.readOnly}
        onChange={state.handleChange}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(
          INPUT_CLASSES,
          props.mono && "font-mono tracking-[-0.01em] tabular-nums",
          props.className,
        )}
      />
    </InputShell>
  );
};

export const LockInput = ({ ref, ...props }: LockInputProps) => {
  const autoId = useId();
  const inputId = props.id ?? autoId;
  const messageId = `${inputId}-message`;
  const invalid = Boolean(props.error);
  const { variant, size } = resolveAppearance(props);
  const { inputRef, bindInputRef } = useMergedInputRef(ref);
  const { copied, triggerCopy } = useCopyFeedback(props.onCopy);
  const state = useLockInputState(props, inputRef);
  const describedBy = joinDescribedBy(
    props["aria-describedby"],
    messageId,
    Boolean(props.error || props.hint),
  );

  return (
    <div
      data-slot="lock-input"
      data-variant={variant}
      data-size={size}
      data-locked={state.isLocked ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      className={cn(WRAPPER_CLASSES, props.containerClassName)}
    >
      <FieldHeading htmlFor={inputId} label={props.label} labelExtra={props.labelExtra} />
      <InputFrame
        props={props}
        inputId={inputId}
        bindInputRef={bindInputRef}
        describedBy={describedBy}
        invalid={invalid}
        copied={copied}
        onCopy={() => triggerCopy(state.currentValue)}
        state={state}
      />
      <FieldFooter
        id={messageId}
        error={props.error}
        hint={props.hint}
        showCount={Boolean(props.showCount)}
        length={state.currentValue.length}
        maxLength={props.maxLength}
      />
    </div>
  );
};
