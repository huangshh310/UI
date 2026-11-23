"use client";

/**
 * Form：模块化、可组合的表单系统，涵盖字段、标签、输入框、多行文本框、单选组、分组与操作栏。
 * 校验生命周期、字段关联与单选键盘导航均由 Base UI 的 Form / Field / Radio 提供。
 */
import { Field } from "@base-ui/react/field";
import { Form as BaseForm } from "@base-ui/react/form";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { cn } from "@matt-ui/utils";
import { createContext, useContext, useId } from "react";
import type {
  FormActionsProps,
  FormControlRadius,
  FormControlSize,
  FormControlVariant,
  FormDescriptionProps,
  FormErrorProps,
  FormFieldProps,
  FormInputProps,
  FormLabelProps,
  FormProps,
  FormRadioGroupProps,
  FormRadioItemProps,
  FormSectionProps,
  FormTextareaProps,
} from "./form.types.js";
import {
  formActionsVariants,
  formControlVariants,
  formFieldVariants,
  formRadioGroupVariants,
  formRadioItemVariants,
  formTextareaSizeVariants,
  formVariants,
} from "./form.variants.js";

interface FormStyleContextValue {
  controlVariant: FormControlVariant;
  controlSize: FormControlSize;
  controlRadius: FormControlRadius;
}

const FormStyleContext = createContext<FormStyleContextValue>({
  controlVariant: "default",
  controlSize: "md",
  controlRadius: "md",
});

export const Form = ({
  validationMode = "onSubmit",
  errors,
  onFormSubmit,
  variant = "default",
  density = "default",
  controlVariant = "default",
  controlSize = "md",
  controlRadius = "md",
  className,
  children,
  ...props
}: FormProps) => (
  <FormStyleContext.Provider value={{ controlVariant, controlSize, controlRadius }}>
    <BaseForm
      data-slot="form"
      data-variant={variant}
      validationMode={validationMode}
      errors={errors}
      onFormSubmit={onFormSubmit ? (values) => onFormSubmit(values) : undefined}
      className={cn(formVariants({ variant, density }), className)}
      {...props}
    >
      {children}
    </BaseForm>
  </FormStyleContext.Provider>
);

export const FormField = ({
  name,
  validate,
  validationMode,
  layout = "vertical",
  invalid,
  disabled,
  className,
  ...props
}: FormFieldProps) => (
  <Field.Root
    data-slot="form-field"
    data-layout={layout}
    name={name}
    validate={validate ? (value) => validate(value) : undefined}
    validationMode={validationMode}
    invalid={invalid}
    disabled={disabled}
    className={cn(formFieldVariants({ layout }), className)}
    {...props}
  />
);

export const FormLabel = ({
  required = false,
  optional = false,
  className,
  children,
  ...props
}: FormLabelProps) => (
  <Field.Label
    data-slot="form-label"
    className={cn(
      "inline-flex items-center gap-1.5 text-[13px] font-medium tracking-tight text-foreground",
      className,
    )}
    {...props}
  >
    <span>
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-destructive">
          *
        </span>
      )}
    </span>
    {optional && !required && (
      <span className="text-[11px] font-normal text-muted-foreground">选填</span>
    )}
  </Field.Label>
);

export const FormInput = ({ variant, size, radius, className, ...props }: FormInputProps) => {
  const ctx = useContext(FormStyleContext);
  return (
    <Field.Control
      data-slot="form-input"
      className={cn(
        formControlVariants({
          variant: variant ?? ctx.controlVariant,
          size: size ?? ctx.controlSize,
          radius: radius ?? ctx.controlRadius,
        }),
        className,
      )}
      {...props}
    />
  );
};

export const FormTextarea = ({
  variant,
  size,
  radius = "md",
  className,
  rows = 3,
  ...props
}: FormTextareaProps) => {
  const ctx = useContext(FormStyleContext);
  const resolvedSize = size ?? ctx.controlSize;
  return (
    <Field.Control
      data-slot="form-textarea"
      render={<textarea rows={rows} {...props} />}
      className={cn(
        formControlVariants({
          variant: variant ?? ctx.controlVariant,
          size: resolvedSize,
          radius,
        }),
        formTextareaSizeVariants({ size: resolvedSize }),
        className,
      )}
    />
  );
};

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

export const FormSection = ({
  title,
  description,
  className,
  children,
  ...props
}: FormSectionProps) => (
  <div
    data-slot="form-section"
    className={cn(
      "flex flex-col gap-3.5 border-b border-solid border-border/65 pb-4 last:border-b-0 last:pb-0 dark:border-white/8",
      className,
    )}
    {...props}
  >
    {(title || description) && (
      <div className="flex flex-col gap-0.5">
        {title && (
          <h3 className="m-0 text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        )}
        {description && (
          <p className="m-0 text-xs leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
    )}
    <div className="flex flex-col gap-3.5">{children}</div>
  </div>
);

export const FormActions = ({ align = "between", className, ...props }: FormActionsProps) => (
  <div
    data-slot="form-actions"
    className={cn(formActionsVariants({ align }), className)}
    {...props}
  />
);

export const FormRadioGroup = ({
  name,
  value,
  defaultValue,
  onValueChange,
  orientation = "vertical",
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
    data-orientation={orientation}
    name={name}
    value={value}
    defaultValue={defaultValue}
    disabled={disabled}
    readOnly={readOnly}
    required={required}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    onValueChange={(next) => onValueChange?.(String(next))}
    className={cn(formRadioGroupVariants({ orientation }), className)}
  >
    {children}
  </RadioGroup>
);

const RADIO_CIRCLE_CLASSES = cn(
  "mt-0.5 inline-flex size-[17px] shrink-0 items-center justify-center rounded-full border border-solid border-input/70 bg-background transition-colors duration-(--ui-duration-fast) dark:border-white/22 dark:bg-card",
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
  "data-checked:border-signal data-checked:bg-signal data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]",
);

export const FormRadioItem = ({
  value,
  label,
  description,
  badge,
  variant = "card",
  disabled = false,
  className,
}: FormRadioItemProps) => {
  const labelId = useId();
  const descId = useId();
  return (
    <label
      data-slot="form-radio-item"
      data-variant={variant}
      data-disabled={disabled ? "" : undefined}
      className={cn(formRadioItemVariants({ variant }), className)}
    >
      <Radio.Root
        value={value}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={description ? descId : undefined}
        className={RADIO_CIRCLE_CLASSES}
      >
        <Radio.Indicator className="size-1.5 rounded-full bg-signal-foreground transition-transform duration-(--ui-duration-fast) data-starting-style:scale-0" />
      </Radio.Root>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center justify-between gap-2">
          <span id={labelId} className="text-[13px] leading-snug font-medium text-foreground">
            {label}
          </span>
          {badge && (
            <span className="shrink-0 rounded-full border border-solid border-border/75 bg-secondary/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground dark:border-white/10">
              {badge}
            </span>
          )}
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
