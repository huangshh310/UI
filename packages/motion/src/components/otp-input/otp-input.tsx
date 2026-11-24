"use client";

/**
 * OtpInput：自动推进、支持整段粘贴与弹簧弹出反馈的一次性验证码输入组件。
 * 内置自动前进、退格回退、整段粘贴分发与原生表单校验；
 * 字符落位时的弹跳动效由 motion 驱动，减少动态效果时自动跳过。
 */
import { OTPField } from "@base-ui/react/otp-field";
import { cn } from "@matt-ui/utils";
import { animate, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from "react";
import type {
  OtpInputProps,
  OtpInputSize,
  OtpInputStatus,
  OtpInputVariant,
} from "./otp-input.types.js";
import {
  OTP_SIZE_CLASSES,
  OTP_SLOT_BASE,
  OTP_STATUS_CLASSES,
  OTP_VARIANT_CLASSES,
} from "./otp-input.variants.js";

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
