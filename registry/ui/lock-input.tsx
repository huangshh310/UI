// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * LockInput：聚焦时聚焦环由中心收拢「锁定」到边框上的输入框。
 * 交互行为来自原生 <input>，通过 id / aria-describedby / aria-invalid 提供完整无障碍语义，
 * 并扩展多套视觉变体、尺寸、圆角、可切换锁定态、一键清空、一键复制、密码显隐与字数统计。
 */

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, Check, Copy, Eye, EyeOff, Lock, LockOpen, X } from "lucide-react";
import {
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
  type Ref,
  type RefCallback,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const SHELL_BASE = [
  "relative flex items-center border border-solid text-foreground",
  "transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast)",
  "data-invalid:border-destructive",
].join(" ");

export const lockInputShellVariants = cva(SHELL_BASE, {
  variants: {
    variant: {
      default:
        "border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-foreground/22 group-focus-within/lock:shadow-none data-locked:border-border/80 data-locked:bg-muted/75 data-locked:shadow-none",
      filled:
        "border-transparent bg-secondary hover:bg-accent/75 group-focus-within/lock:bg-card data-locked:border-border/60 data-locked:bg-muted",
      ghost:
        "border-transparent bg-transparent hover:bg-secondary/65 group-focus-within/lock:bg-card data-locked:border-dashed data-locked:border-border data-locked:bg-muted/45",
      underline:
        "rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0.5 shadow-none hover:border-foreground/30 data-locked:border-dashed data-locked:border-border",
    },
    size: {
      sm: "h-9 gap-1.5 px-3 text-xs",
      md: "h-10.5 gap-2 px-3.5 text-sm",
      lg: "h-12 gap-2.5 px-4 text-[15px]",
    },
    radius: {
      md: "rounded-lg",
      lg: "rounded-xl",
      full: "rounded-full",
    },
    ringTone: {
      signal: "",
      neutral: "",
    },
  },
  compoundVariants: [
    { variant: "underline", radius: "md", class: "rounded-none" },
    { variant: "underline", radius: "lg", class: "rounded-none" },
    { variant: "underline", radius: "full", class: "rounded-none" },
    { variant: "underline", size: "sm", class: "px-0.5" },
    { variant: "underline", size: "md", class: "px-0.5" },
    { variant: "underline", size: "lg", class: "px-0.5" },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    radius: "lg",
    ringTone: "signal",
  },
});

const RING_BASE = [
  "pointer-events-none absolute opacity-0",
  "transition-[transform,opacity] duration-(--ui-duration-normal) ease-[cubic-bezier(0.22,1,0.36,1)]",
  "motion-reduce:transition-opacity",
].join(" ");

export const lockInputRingVariants = cva(RING_BASE, {
  variants: {
    variant: {
      default:
        "-inset-px border-2 border-solid scale-x-[1.02] scale-y-[1.08] group-focus-within/lock:scale-100 group-focus-within/lock:opacity-100",
      filled:
        "-inset-px border-2 border-solid scale-x-[1.02] scale-y-[1.08] group-focus-within/lock:scale-100 group-focus-within/lock:opacity-100",
      ghost:
        "-inset-px border-2 border-solid scale-x-[1.02] scale-y-[1.08] group-focus-within/lock:scale-100 group-focus-within/lock:opacity-100",
      underline:
        "inset-x-0 -bottom-px top-auto h-0.5 border-0 scale-x-0 group-focus-within/lock:scale-x-100 group-focus-within/lock:opacity-100",
    },
    radius: {
      md: "rounded-lg",
      lg: "rounded-xl",
      full: "rounded-full",
    },
    ringTone: {
      signal:
        "border-ring group-data-locked/lock:border-foreground/45 group-data-invalid/lock:border-destructive",
      neutral:
        "border-foreground/85 group-data-locked/lock:border-foreground/45 group-data-invalid/lock:border-destructive",
    },
  },
  compoundVariants: [
    { variant: "underline", radius: "md", class: "rounded-full" },
    { variant: "underline", radius: "lg", class: "rounded-full" },
    { variant: "underline", radius: "full", class: "rounded-full" },
    {
      variant: "underline",
      ringTone: "signal",
      class:
        "bg-ring group-data-locked/lock:bg-muted-foreground/45 group-data-invalid/lock:bg-destructive",
    },
    {
      variant: "underline",
      ringTone: "neutral",
      class:
        "bg-foreground group-data-locked/lock:bg-muted-foreground/45 group-data-invalid/lock:bg-destructive",
    },
  ],
  defaultVariants: {
    variant: "default",
    radius: "lg",
    ringTone: "signal",
  },
});

export const lockInputActionVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer items-center justify-center text-muted-foreground",
    "transition-[background-color,color,transform] duration-(--ui-duration-fast)",
    "hover:bg-accent hover:text-foreground active:scale-95 motion-reduce:active:scale-100",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-45",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-6",
        md: "size-6.5",
        lg: "size-7.5",
      },
      radius: {
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      radius: "lg",
    },
  },
);
type ShellVariantProps = VariantProps<typeof lockInputShellVariants>;

export type LockInputVariant = NonNullable<ShellVariantProps["variant"]>;
export type LockInputSize = NonNullable<ShellVariantProps["size"]>;
export type LockInputRadius = NonNullable<ShellVariantProps["radius"]>;
export type LockInputRingTone = NonNullable<ShellVariantProps["ringTone"]>;

export interface LockInputProps extends Omit<
  ComponentProps<"input">,
  "prefix" | "size" | "onCopy"
> {
  /** 输入框视觉风格：卡片描边、柔灰填充、极简透明或底部基线 */
  variant?: LockInputVariant;
  /** 输入框尺寸规格 */
  size?: LockInputSize;
  /** 外框圆角规格（underline 变体始终为直角底线） */
  radius?: LockInputRadius;
  /** 聚焦锁定环配色倾向：品牌信号色或纯中性单色 */
  ringTone?: LockInputRingTone;
  /** 是否使用等宽字体（适合项目 ID、API Key、Token 等内容） */
  mono?: boolean;
  /** 输入框上方标签，自动与输入框通过 htmlFor / id 关联 */
  label?: string;
  /** 标签右侧补充信息（如「必填」「已锁定」或辅助操作） */
  labelExtra?: ReactNode;
  /** 输入框下方辅助说明，无错误时通过 aria-describedby 关联 */
  hint?: string;
  /** 错误提示，传入后声明 aria-invalid 并优先作为描述信息 */
  error?: string;
  /** 锁定态（受控）：转为只读并显示锁图标 */
  locked?: boolean;
  /** 初始锁定态（配合 lockable 使用的非受控初始值） */
  defaultLocked?: boolean;
  /** 允许用户点击右侧锁图标切换锁定与可编辑状态 */
  lockable?: boolean;
  /** 锁定状态变化时的回调 */
  onLockedChange?: (locked: boolean) => void;
  /** 可编辑且存在内容时显示一键清空按钮 */
  clearable?: boolean;
  /** 点击清空按钮后的回调 */
  onClear?: () => void;
  /** 显示一键复制按钮（尤其适用于锁定态密钥或项目标识） */
  copyable?: boolean;
  /** 复制成功后的回调，参数为当前文本值 */
  onCopy?: (value: string) => void;
  /** 当 type="password" 时，显示明文/密文切换按钮 */
  revealable?: boolean;
  /** 在底部展示字数统计；传入 maxLength 时自动显示「当前 / 上限」 */
  showCount?: boolean;
  /** 右侧快捷键提示角标（如 "⌘K" 或 "/"） */
  shortcut?: string;
  /** 输入框左侧前缀内容（图标、协议头或单位等） */
  prefix?: ReactNode;
  /** 输入框右侧后缀内容 */
  suffix?: ReactNode;
  /** 外层容器自定义类名 */
  containerClassName?: string;
}
const SHORTCUT_CLASSES =
  "pointer-events-none inline-flex shrink-0 items-center rounded-md border border-border bg-muted/85 px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium text-muted-foreground";

const FieldHeading = ({
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

const FieldFooter = ({
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

interface TrailingActionsProps {
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

const TrailingActions = (props: TrailingActionsProps) => {
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
const assignInputRef = (
  target: Ref<HTMLInputElement> | undefined,
  value: HTMLInputElement | null,
) => {
  if (typeof target === "function") {
    target(value);
  } else if (target && typeof target === "object") {
    target.current = value;
  }
};

/** 合并内部 ref 与外部透传的 ref */
const useMergedInputRef = (forwardedRef?: Ref<HTMLInputElement>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const bindInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignInputRef(forwardedRef, node);
    },
    [forwardedRef],
  );
  return { inputRef, bindInputRef };
};

/** 追踪一键复制后的短暂确认态，卸载时清理定时器 */
const useCopyFeedback = (onCopy?: (value: string) => void) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const triggerCopy = (text: string) => {
    void navigator.clipboard?.writeText(text);
    onCopy?.(text);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1600);
  };

  return { copied, triggerCopy };
};

const useLockInputState = (props: LockInputProps, inputRef: RefObject<HTMLInputElement | null>) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    String(props.defaultValue ?? ""),
  );
  const [internalLocked, setInternalLocked] = useState(props.defaultLocked ?? false);
  const [revealed, setRevealed] = useState(false);

  const isLocked = props.locked ?? internalLocked;
  const currentValue = props.value !== undefined ? String(props.value) : uncontrolledValue;
  const inputType = props.type ?? "text";
  const resolvedType =
    props.revealable && inputType === "password" && revealed ? "text" : inputType;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.value === undefined) setUncontrolledValue(event.target.value);
    props.onChange?.(event);
  };

  const handleClear = () => {
    if (props.value === undefined) {
      setUncontrolledValue("");
      if (inputRef.current) inputRef.current.value = "";
    }
    props.onClear?.();
    inputRef.current?.focus();
  };

  const handleToggleLock = () => {
    const next = !isLocked;
    if (props.locked === undefined) setInternalLocked(next);
    props.onLockedChange?.(next);
    if (!next) requestAnimationFrame(() => inputRef.current?.focus());
  };

  const toggleReveal = () => setRevealed((prev) => !prev);

  return {
    isLocked,
    currentValue,
    revealed,
    resolvedType,
    toggleReveal,
    handleChange,
    handleClear,
    handleToggleLock,
  };
};
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
