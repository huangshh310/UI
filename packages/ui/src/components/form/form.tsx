"use client";

/**
 * Form：模块化、可组合的表单系统，涵盖字段、标签、输入框、多行文本框、单选组、说明与错误提示。
 * 校验生命周期、字段关联与单选键盘导航均由 Base UI 的 Form / Field / Radio 提供。
 */
import { Field } from "@base-ui/react/field";
import { Form as BaseForm } from "@base-ui/react/form";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { cn } from "@matt-ui/utils";
import { useId } from "react";
import type {
  FormDescriptionProps,
  FormErrorProps,
  FormFieldProps,
  FormInputProps,
  FormLabelProps,
  FormProps,
  FormRadioGroupProps,
  FormRadioItemProps,
  FormTextareaProps,
} from "./form.types.js";

const CONTROL_BASE = cn(
  "w-full min-w-0 appearance-none rounded-xl border border-solid border-border bg-card px-3.5 font-sans text-sm text-foreground shadow-sm",
  "placeholder:text-muted-foreground/75 transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) hover:border-foreground/22",
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
  "data-invalid:border-destructive data-invalid:focus-visible:border-destructive data-invalid:focus-visible:ring-destructive data-disabled:pointer-events-none data-disabled:opacity-50",
);

export const Form = ({
  validationMode = "onSubmit",
  errors,
  onFormSubmit,
  className,
  ...props
}: FormProps) => (
  <BaseForm
    data-slot="form"
    validationMode={validationMode}
    errors={errors}
    onFormSubmit={onFormSubmit ? (values) => onFormSubmit(values) : undefined}
    className={cn("flex w-full max-w-md flex-col gap-4 font-sans", className)}
    {...props}
  />
);

export const FormField = ({
  name,
  validate,
  validationMode,
  invalid,
  disabled,
  className,
  ...props
}: FormFieldProps) => (
  <Field.Root
    data-slot="form-field"
    name={name}
    validate={validate ? (value) => validate(value) : undefined}
    validationMode={validationMode}
    invalid={invalid}
    disabled={disabled}
    className={cn("flex flex-col gap-1.5", className)}
    {...props}
  />
);

export const FormLabel = ({ required = false, className, children, ...props }: FormLabelProps) => (
  <Field.Label
    data-slot="form-label"
    className={cn("text-[13px] font-medium tracking-tight text-foreground", className)}
    {...props}
  >
    {children}
    {required && (
      <span aria-hidden="true" className="ml-0.5 text-destructive">
        *
      </span>
    )}
  </Field.Label>
);

export const FormInput = ({ className, ...props }: FormInputProps) => (
  <Field.Control
    data-slot="form-input"
    className={cn(CONTROL_BASE, "h-10", className)}
    {...props}
  />
);

export const FormTextarea = ({ className, rows = 3, ...props }: FormTextareaProps) => (
  <Field.Control
    data-slot="form-textarea"
    render={<textarea rows={rows} {...props} />}
    className={cn(CONTROL_BASE, "min-h-18 resize-y py-2 leading-relaxed", className)}
  />
);

export const FormDescription = ({ className, ...props }: FormDescriptionProps) => (
  <Field.Description
    data-slot="form-description"
    className={cn("m-0 text-xs leading-relaxed text-muted-foreground", className)}
    {...props}
  />
);

export const FormError = ({ match, className, ...props }: FormErrorProps) => (
  <Field.Error
    data-slot="form-error"
    match={match}
    className={cn(
      "m-0 text-xs font-medium text-destructive transition-opacity duration-(--ui-duration-fast) data-starting-style:opacity-0",
      className,
    )}
    {...props}
  />
);

export const FormRadioGroup = ({
  name,
  value,
  defaultValue,
  onValueChange,
  disabled,
  readOnly,
  required,
  className,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: FormRadioGroupProps) => (
  <RadioGroup
    data-slot="form-radio-group"
    name={name}
    value={value}
    defaultValue={defaultValue}
    disabled={disabled}
    readOnly={readOnly}
    required={required}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    onValueChange={(next) => onValueChange?.(String(next))}
    className={cn("flex flex-col gap-2.5", className)}
  >
    {children}
  </RadioGroup>
);

export const FormRadioItem = ({
  value,
  label,
  description,
  disabled = false,
  className,
}: FormRadioItemProps) => {
  const labelId = useId();
  const descId = useId();

  return (
    <label
      data-slot="form-radio-item"
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border border-solid border-border bg-background p-3.5 font-sans shadow-sm select-none transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast) dark:bg-card",
        "hover:border-foreground/20 hover:bg-accent/35 has-data-checked:border-signal/60 has-data-checked:bg-signal/6 has-data-checked:shadow-none data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
    >
      <Radio.Root
        value={value}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={description ? descId : undefined}
        className={cn(
          "mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border border-solid border-foreground/22 bg-background transition-colors duration-(--ui-duration-fast) dark:bg-card",
          "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
          "data-checked:border-signal data-checked:bg-signal data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]",
        )}
      >
        <Radio.Indicator className="size-1.5 rounded-full bg-signal-foreground transition-transform duration-(--ui-duration-fast) data-starting-style:scale-0" />
      </Radio.Root>
      <span className="flex flex-col gap-0.5">
        <span id={labelId} className="text-[13px] leading-snug font-medium text-foreground">
          {label}
        </span>
        {description && (
          <span id={descId} className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </label>
  );
};
