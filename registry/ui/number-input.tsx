// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * NumberInput：精密数值步进输入框，支持 default / filled / stepper 变体、前后缀单位、标签拖拽微调与校验态。
 */

import { cn } from "@/lib/utils";
import { NumberField } from "@base-ui/react/number-field";
import { cva } from "class-variance-authority";
import { ChevronDown, ChevronUp, Minus, MoveHorizontal, Plus } from "lucide-react";
import { type ReactNode, useId } from "react";

export const numberGroupVariants = cva(
  "inline-flex w-full items-center overflow-hidden rounded-xl border border-solid transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input/50 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/25 dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22",
        filled:
          "border-transparent bg-secondary/75 hover:bg-secondary focus-within:bg-background dark:bg-white/[0.07] dark:hover:bg-white/[0.11] dark:focus-within:bg-card",
        stepper:
          "border-input/50 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/25 dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22",
      },
      size: {
        sm: "h-8 rounded-lg",
        md: "h-9.5 rounded-xl",
        lg: "h-11 rounded-xl",
      },
      invalid: {
        true: "border-destructive hover:border-destructive focus-within:border-destructive focus-within:ring-destructive dark:border-destructive dark:hover:border-destructive",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      invalid: false,
    },
  },
);

export const numberStepButtonVariants = cva(
  "inline-flex h-full shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      size: {
        sm: "w-7.5",
        md: "w-9",
        lg: "w-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const numberInputFieldVariants = cva(
  "h-full min-w-0 flex-1 border-0 bg-transparent font-mono font-medium text-foreground tabular-nums outline-none",
  {
    variants: {
      variant: {
        default: "px-2 text-center",
        filled: "px-2 text-center",
        stepper: "px-3 text-left",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const NUMBER_STACKED_STEP_BTN =
  "flex flex-1 cursor-pointer items-center justify-center border-0 bg-transparent px-2 text-muted-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-40";
export type NumberInputVariant = "default" | "filled" | "stepper";

export type NumberInputSize = "sm" | "md" | "lg";

export interface NumberInputProps {
  /** 受控数值 */
  value?: number | null;
  /** 初始数值 */
  defaultValue?: number;
  /** 数值变化回调 */
  onValueChange?: (value: number | null) => void;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步进间隔 */
  step?: number;
  /** 外观变体：默认发丝边框 / 柔雾填充 / 右侧堆叠步进 */
  variant?: NumberInputVariant;
  /** 高度与字号规格 */
  size?: NumberInputSize;
  /** 输入框前置装饰（如货币符号） */
  prefix?: ReactNode;
  /** 输入框后置单位（如 px / ms / %） */
  suffix?: ReactNode;
  /** 标签（开启 scrub 时按住标签可横向拖拽微调） */
  label?: string;
  /** 辅助说明文字 */
  hint?: string;
  /** 错误提示（传入时自动进入无效校验态） */
  error?: string;
  /** 是否处于无效校验态 */
  invalid?: boolean;
  /** Intl.NumberFormat 格式化配置（货币/百分比/小数位） */
  format?: Intl.NumberFormatOptions;
  /** 是否允许在标签上横向拖拽微调 */
  scrub?: boolean;
  /** 禁用态 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}
const NumberLabel = ({ id, label, scrub }: { id: string; label?: string; scrub: boolean }) => {
  if (!label) return null;
  if (!scrub) {
    return (
      <label htmlFor={id} className="text-xs font-medium text-foreground">
        {label}
      </label>
    );
  }
  return (
    <NumberField.ScrubArea className="inline-flex w-fit cursor-ew-resize items-center gap-1 select-none">
      <label htmlFor={id} className="cursor-ew-resize text-xs font-medium text-foreground">
        {label}
      </label>
      <MoveHorizontal aria-hidden="true" className="size-3 text-muted-foreground" />
      <NumberField.ScrubAreaCursor />
    </NumberField.ScrubArea>
  );
};

interface NumberFieldInnerProps {
  variant: NumberInputVariant;
  size: NumberInputSize;
  invalid: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  describedBy?: string;
}

const NumberInputInner = ({
  variant,
  size,
  invalid,
  prefix,
  suffix,
  describedBy,
}: NumberFieldInnerProps) => (
  <>
    {prefix && (
      <span className="shrink-0 pl-2.5 font-mono text-xs text-muted-foreground select-none">
        {prefix}
      </span>
    )}
    <NumberField.Input
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={numberInputFieldVariants({ variant, size })}
    />
    {suffix && (
      <span className="shrink-0 pr-2.5 font-mono text-xs text-muted-foreground select-none">
        {suffix}
      </span>
    )}
  </>
);

const NumberInputControls = (props: NumberFieldInnerProps) => {
  const { variant, size, invalid } = props;
  const groupClass = numberGroupVariants({ variant, size, invalid });

  if (variant === "stepper") {
    return (
      <NumberField.Group data-slot="number-input-group" className={groupClass}>
        <NumberInputInner {...props} />
        <div className="flex h-full shrink-0 flex-col divide-y divide-border/75 border-l border-solid border-border/75 dark:divide-white/10 dark:border-white/12">
          <NumberField.Increment aria-label="增加" className={NUMBER_STACKED_STEP_BTN}>
            <ChevronUp aria-hidden="true" className="size-3" />
          </NumberField.Increment>
          <NumberField.Decrement aria-label="减少" className={NUMBER_STACKED_STEP_BTN}>
            <ChevronDown aria-hidden="true" className="size-3" />
          </NumberField.Decrement>
        </div>
      </NumberField.Group>
    );
  }

  const stepBtn = numberStepButtonVariants({ size });
  const divider = variant === "default";
  return (
    <NumberField.Group data-slot="number-input-group" className={groupClass}>
      <NumberField.Decrement
        aria-label="减少"
        className={cn(
          stepBtn,
          divider && "border-r border-solid border-border/75 dark:border-white/10",
        )}
      >
        <Minus aria-hidden="true" className="size-3.5" />
      </NumberField.Decrement>
      <NumberInputInner {...props} />
      <NumberField.Increment
        aria-label="增加"
        className={cn(
          stepBtn,
          divider && "border-l border-solid border-border/75 dark:border-white/10",
        )}
      >
        <Plus aria-hidden="true" className="size-3.5" />
      </NumberField.Increment>
    </NumberField.Group>
  );
};

const NumberMessage = ({ id, error, hint }: { id: string; error?: string; hint?: string }) => {
  const message = error ?? hint;
  if (!message) return null;
  return (
    <p
      id={id}
      role={error ? "alert" : undefined}
      className={cn("m-0 text-xs", error ? "text-destructive" : "text-muted-foreground")}
    >
      {message}
    </p>
  );
};

const resolveNumberConfig = (props: NumberInputProps) => ({
  defaultValue: props.defaultValue ?? 0,
  step: props.step ?? 1,
  variant: props.variant ?? "default",
  size: props.size ?? "md",
  scrub: props.scrub ?? true,
  disabled: props.disabled ?? false,
  isInvalid: Boolean(props.invalid || props.error),
  hasMessage: Boolean(props.error || props.hint),
});

export const NumberInput = (props: NumberInputProps) => {
  const cfg = resolveNumberConfig(props);
  const inputId = useId();
  const messageId = useId();

  return (
    <NumberField.Root
      id={inputId}
      value={props.value}
      defaultValue={props.value === undefined ? cfg.defaultValue : undefined}
      onValueChange={(next) => props.onValueChange?.(next)}
      min={props.min}
      max={props.max}
      step={cfg.step}
      format={props.format}
      disabled={cfg.disabled}
      data-slot="number-input"
      data-variant={cfg.variant}
      data-size={cfg.size}
      data-invalid={cfg.isInvalid ? "" : undefined}
      className={cn("flex w-full max-w-52 flex-col gap-1.5", props.className)}
    >
      <NumberLabel id={inputId} label={props.label} scrub={cfg.scrub} />
      <NumberInputControls
        variant={cfg.variant}
        size={cfg.size}
        invalid={cfg.isInvalid}
        prefix={props.prefix}
        suffix={props.suffix}
        describedBy={cfg.hasMessage ? messageId : undefined}
      />
      <NumberMessage id={messageId} error={props.error} hint={props.hint} />
    </NumberField.Root>
  );
};
