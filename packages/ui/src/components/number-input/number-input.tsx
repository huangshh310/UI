"use client";

/**
 * NumberInput：精密数值步进输入框，支持 default / filled / stepper 变体、前后缀单位、标签拖拽微调与校验态。
 */
import { NumberField } from "@base-ui/react/number-field";
import { cn } from "@matt-ui/utils";
import { ChevronDown, ChevronUp, Minus, MoveHorizontal, Plus } from "lucide-react";
import { useId, type ReactNode } from "react";
import type {
  NumberInputProps,
  NumberInputSize,
  NumberInputVariant,
} from "./number-input.types.js";
import {
  NUMBER_STACKED_STEP_BTN,
  numberGroupVariants,
  numberInputFieldVariants,
  numberStepButtonVariants,
} from "./number-input.variants.js";

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
