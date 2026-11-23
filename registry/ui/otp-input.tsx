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
import { Fragment, useEffect, useId, useRef, useState } from "react";

export type OtpValidationType = "numeric" | "alpha" | "alphanumeric" | "none";

export interface OtpInputProps {
  id?: string;
  name?: string;
  /** 验证码长度，默认 6 */
  length?: number;
  /** 在第几位之后插入分隔符（例如 6 位码传 3），不传则无分隔符 */
  separatorAt?: number;
  /** 组标签文本 */
  label?: string;
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
const SLOT_CLASSES = cn(
  "box-border h-12 w-10.5 appearance-none rounded-xl border border-solid border-border bg-card text-center font-mono text-base font-semibold text-foreground tabular-nums shadow-xs",
  "transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) outline-none",
  "hover:border-foreground/30 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/18",
  "data-filled:border-foreground/35 data-filled:bg-secondary/45 data-disabled:pointer-events-none data-disabled:opacity-50",
);

const OtpSlot = ({
  index,
  char,
  invalid,
  reduceMotion,
}: {
  index: number;
  char: string;
  invalid: boolean;
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
      { scale: [0.9, 1.08, 1] },
      { duration: 0.24, ease: [0.34, 1.56, 0.64, 1] },
    );
  }, [char, reduceMotion]);

  return (
    <span ref={wrapperRef} className="inline-flex">
      <OTPField.Input
        aria-label={index === 0 ? undefined : `第 ${index + 1} 位`}
        aria-invalid={invalid || undefined}
        data-slot="otp-input-slot"
        className={cn(
          SLOT_CLASSES,
          invalid && "border-destructive focus-visible:border-destructive",
        )}
      />
    </span>
  );
};

const OtpSlots = ({
  length,
  separatorAt,
  value,
  invalid,
  reduceMotion,
}: {
  length: number;
  separatorAt?: number;
  value: string;
  invalid: boolean;
  reduceMotion: boolean;
}) => (
  <>
    {Array.from({ length }, (_, index) => (
      <Fragment key={index}>
        {separatorAt === index && (
          <OTPField.Separator
            aria-hidden="true"
            className="mx-0.5 h-0.5 w-2.5 rounded-full bg-muted-foreground/35"
          />
        )}
        <OtpSlot
          index={index}
          char={value[index] ?? ""}
          invalid={invalid}
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

export const OtpInput = ({
  id,
  length = 6,
  separatorAt,
  label,
  value,
  defaultValue = "",
  invalid = false,
  onValueChange,
  onComplete,
  className,
  "aria-label": ariaLabel,
  ...rest
}: OtpInputProps) => {
  const autoId = useId();
  const rootId = id ?? autoId;
  const reduceMotion = Boolean(useReducedMotion());
  const state = useOtpState(value, defaultValue, onValueChange);

  return (
    <div
      data-slot="otp-input"
      data-invalid={invalid ? "" : undefined}
      className={cn("inline-flex flex-col gap-2 font-sans", className)}
    >
      <label
        htmlFor={rootId}
        className={label ? "text-[13px] font-medium tracking-tight text-foreground" : "sr-only"}
      >
        {label ?? ariaLabel ?? "一次性验证码"}
      </label>
      <OTPField.Root
        id={rootId}
        length={length}
        {...state.controlledProps}
        onValueChange={state.handleChange}
        onValueComplete={(completed) => onComplete?.(completed)}
        className="inline-flex items-center gap-2"
        {...rest}
      >
        <OtpSlots
          length={length}
          separatorAt={separatorAt}
          value={state.current}
          invalid={invalid}
          reduceMotion={reduceMotion}
        />
      </OTPField.Root>
    </div>
  );
};
