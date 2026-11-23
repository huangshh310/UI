// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * OtpInput：自动推进、支持整段粘贴与弹簧弹出反馈的一次性验证码输入组件。
 * 自动前进、Backspace 回退、粘贴分发与表单验证由 Base UI 的 OTPField 提供；
 * 字符落位时的弹跳动效由 motion 驱动，减少动态效果时自动跳过。
 */

import { cn } from "@/lib/utils";
import { OTPField } from "@base-ui/react/otp-field";
import { animate, useReducedMotion } from "motion/react";
import { Fragment, type ReactNode, useEffect, useId, useRef, useState } from "react";

export const OTP_SLOT_BASE =
  "box-border appearance-none border border-solid text-center font-mono font-semibold text-foreground tabular-nums transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) outline-none focus-visible:z-10 data-disabled:pointer-events-none data-disabled:opacity-50";

export const OTP_SIZE_CLASSES: Record<OtpInputSize, string> = {
  sm: "h-10 w-9 text-sm",
  md: "h-12 w-10.5 text-base",
  lg: "h-14 w-12 text-lg",
};

export const OTP_VARIANT_CLASSES: Record<OtpInputVariant, string> = {
  default:
    "rounded-xl border-input/55 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/30 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-filled:border-foreground/35 dark:border-white/14 dark:hover:border-white/25",
  grouped:
    "rounded-none border-input/55 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-foreground/28 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-filled:bg-secondary/30 dark:border-white/14",
  filled:
    "rounded-xl border-transparent bg-secondary/80 hover:bg-secondary focus-visible:border-ring focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-filled:bg-secondary dark:bg-white/8 dark:hover:bg-white/12",
  underline:
    "rounded-none border-x-0 border-t-0 border-b-2 border-input/60 bg-transparent hover:border-foreground/45 focus-visible:border-ring data-filled:border-foreground",
};

export const OTP_STATUS_CLASSES: Record<OtpInputStatus, string> = {
  default: "",
  success:
    "border-emerald-500/80 bg-emerald-500/5 hover:border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 dark:border-emerald-500/80 dark:hover:border-emerald-400",
  error:
    "border-destructive bg-destructive/5 hover:border-destructive focus-visible:border-destructive focus-visible:ring-destructive dark:border-destructive dark:hover:border-destructive",
};
export type OtpValidationType = "numeric" | "alpha" | "alphanumeric" | "none";
export type OtpInputVariant = "default" | "grouped" | "filled" | "underline";
export type OtpInputSize = "sm" | "md" | "lg";
export type OtpInputStatus = "default" | "success" | "error";

export interface OtpInputProps {
  id?: string;
  name?: string;
  /** 验证码长度，默认 6 */
  length?: number;
  /** 在第几位之后插入分隔符（例如 6 位码传 3），不传则无分隔符 */
  separatorAt?: number;
  /** 自定义分隔符节点 */
  separator?: ReactNode;
  /** 视觉风格：独立描边、连体分组、柔灰填充或极简下划线 */
  variant?: OtpInputVariant;
  /** 槽位尺寸 */
  size?: OtpInputSize;
  /** 视觉反馈状态 */
  status?: OtpInputStatus;
  /** 组标签文本 */
  label?: string;
  /** 下方辅助提示文案 */
  hint?: string;
  /** 错误提示文案（传入时自动进入错误态并设置 aria-invalid） */
  error?: string;
  /** 受控值 */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  /** 字符校验类型，默认 numeric */
  validationType?: OtpValidationType;
  /** 是否掩码显示输入字符，默认否 */
  mask?: boolean;
  /** 是否处于错误态 */
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onValueChange?: (value: string) => void;
  /** 填满全部槽位时触发 */
  onComplete?: (value: string) => void;
  className?: string;
  "aria-label"?: string;
}
const groupedEdgeClass = (index: number, length: number, separatorAt?: number) => {
  const isGroupStart = index === 0 || index === separatorAt;
  const isGroupEnd =
    index === length - 1 || (separatorAt !== undefined && index === separatorAt - 1);
  return cn(
    !isGroupStart && "-ml-px",
    isGroupStart && "rounded-l-xl",
    isGroupEnd && "rounded-r-xl",
  );
};

const OtpSlot = ({
  index,
  length,
  separatorAt,
  char,
  variant,
  size,
  status,
  reduceMotion,
}: {
  index: number;
  length: number;
  separatorAt?: number;
  char: string;
  variant: OtpInputVariant;
  size: OtpInputSize;
  status: OtpInputStatus;
  reduceMotion: boolean;
}) => {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const previousRef = useRef(char);

  useEffect(() => {
    const prev = previousRef.current;
    previousRef.current = char;
    if (reduceMotion || !char || char === prev || !wrapperRef.current) return;
    animate(
      wrapperRef.current,
      { scale: [0.92, 1.07, 1] },
      { duration: 0.22, ease: [0.34, 1.56, 0.64, 1] },
    );
  }, [char, reduceMotion]);

  return (
    <span ref={wrapperRef} className="inline-flex">
      <OTPField.Input
        aria-label={index === 0 ? undefined : `第 ${index + 1} 位`}
        aria-invalid={status === "error" ? true : undefined}
        data-slot="otp-input-slot"
        className={cn(
          OTP_SLOT_BASE,
          OTP_SIZE_CLASSES[size],
          OTP_VARIANT_CLASSES[variant],
          variant === "grouped" && groupedEdgeClass(index, length, separatorAt),
          OTP_STATUS_CLASSES[status],
        )}
      />
    </span>
  );
};

const OtpSlots = ({
  length,
  separatorAt,
  separator,
  value,
  variant,
  size,
  status,
  reduceMotion,
}: {
  length: number;
  separatorAt?: number;
  separator?: ReactNode;
  value: string;
  variant: OtpInputVariant;
  size: OtpInputSize;
  status: OtpInputStatus;
  reduceMotion: boolean;
}) => (
  <>
    {Array.from({ length }, (_, index) => (
      <Fragment key={index}>
        {separatorAt === index && (
          <OTPField.Separator
            aria-hidden="true"
            className="mx-1.5 inline-flex items-center justify-center text-muted-foreground/50"
          >
            {separator ?? <span className="h-0.5 w-2.5 rounded-full bg-muted-foreground/35" />}
          </OTPField.Separator>
        )}
        <OtpSlot
          index={index}
          length={length}
          separatorAt={separatorAt}
          char={value[index] ?? ""}
          variant={variant}
          size={size}
          status={status}
          reduceMotion={reduceMotion}
        />
      </Fragment>
    ))}
  </>
);

const useOtpState = (
  value: string | undefined,
  defaultValue: string,
  onValueChange: ((value: string) => void) | undefined,
) => {
  const [internal, setInternal] = useState(defaultValue);
  const handleChange = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  return {
    current: value ?? internal,
    controlledProps: value !== undefined ? { value } : { defaultValue },
    handleChange,
  };
};

const OtpFeedback = ({ hint, error }: { hint?: string; error?: string }) => {
  if (error) {
    return (
      <p role="alert" className="m-0 text-xs text-destructive">
        {error}
      </p>
    );
  }
  if (hint) {
    return <p className="m-0 text-xs text-muted-foreground">{hint}</p>;
  }
  return null;
};

const normalizeOtpConfig = (props: OtpInputProps) => ({
  length: props.length ?? 6,
  variant: props.variant ?? "default",
  size: props.size ?? "md",
  status: (props.error || props.invalid ? "error" : (props.status ?? "default")) as OtpInputStatus,
  defaultValue: props.defaultValue ?? "",
  labelText: props.label ?? props["aria-label"] ?? "一次性验证码",
});

export const OtpInput = (props: OtpInputProps) => {
  const autoId = useId();
  const rootId = props.id ?? autoId;
  const config = normalizeOtpConfig(props);
  const reduceMotion = Boolean(useReducedMotion());
  const state = useOtpState(props.value, config.defaultValue, props.onValueChange);

  return (
    <div
      data-slot="otp-input"
      data-status={config.status}
      data-invalid={config.status === "error" ? "" : undefined}
      className={cn("inline-flex flex-col gap-2 font-sans", props.className)}
    >
      <label
        htmlFor={rootId}
        className={
          props.label ? "text-[13px] font-medium tracking-tight text-foreground" : "sr-only"
        }
      >
        {config.labelText}
      </label>
      <OTPField.Root
        id={rootId}
        name={props.name}
        length={config.length}
        validationType={props.validationType}
        mask={props.mask}
        disabled={props.disabled}
        readOnly={props.readOnly}
        required={props.required}
        {...state.controlledProps}
        onValueChange={state.handleChange}
        onValueComplete={(completed) => props.onComplete?.(completed)}
        className={cn("inline-flex items-center", config.variant === "grouped" ? "gap-0" : "gap-2")}
      >
        <OtpSlots
          length={config.length}
          separatorAt={props.separatorAt}
          separator={props.separator}
          value={state.current}
          variant={config.variant}
          size={config.size}
          status={config.status}
          reduceMotion={reduceMotion}
        />
      </OTPField.Root>
      <OtpFeedback hint={props.hint} error={props.error} />
    </div>
  );
};
