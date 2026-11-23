// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Form：模块化、可组合的表单系统，涵盖字段、标签、输入框、多行文本框、单选组、分组与操作栏。
 * 校验生命周期、字段关联与单选键盘导航均由 Base UI 的 Form / Field / Radio 提供。
 */

import { cn } from "@/lib/utils";
import { Field } from "@base-ui/react/field";
import { Form as BaseForm } from "@base-ui/react/form";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { cva } from "class-variance-authority";
import { createContext, type ComponentProps, type ReactNode, useContext, useId } from "react";

export const formVariants = cva("flex w-full max-w-md flex-col font-sans", {
  variants: {
    variant: {
      default: "",
      card: "rounded-2xl border border-solid border-border/85 bg-card p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/10 dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]",
      subtle:
        "rounded-2xl border border-solid border-border/65 bg-secondary/35 p-5 dark:border-white/8 dark:bg-white/[0.03]",
    },
    density: {
      default: "gap-4",
      compact: "gap-3",
      relaxed: "gap-5",
    },
  },
  defaultVariants: {
    variant: "default",
    density: "default",
  },
});

export const formFieldVariants = cva("w-full", {
  variants: {
    layout: {
      vertical: "flex flex-col gap-1.5",
      horizontal:
        "grid grid-cols-1 gap-1.5 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-start sm:gap-x-4 sm:gap-y-1.5 [&>[data-slot=form-label]]:sm:pt-2 [&>[data-slot=form-description]]:sm:col-start-2 [&>[data-slot=form-error]]:sm:col-start-2",
    },
  },
  defaultVariants: {
    layout: "vertical",
  },
});

export const formControlVariants = cva(
  "w-full min-w-0 appearance-none border border-solid font-sans text-foreground placeholder:text-muted-foreground/70 transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-invalid:border-destructive data-invalid:hover:border-destructive data-invalid:focus-visible:border-destructive data-invalid:focus-visible:ring-destructive dark:data-invalid:border-destructive dark:data-invalid:hover:border-destructive data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input/50 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/25 hover:bg-card dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22 dark:hover:bg-card",
        filled:
          "border-transparent bg-secondary/75 hover:bg-secondary focus-visible:bg-card dark:bg-white/7 dark:hover:bg-white/11",
        ghost:
          "border-transparent bg-transparent shadow-none hover:bg-accent/55 focus-visible:bg-card",
      },
      size: {
        sm: "h-8.5 px-3 text-xs",
        md: "h-9.5 px-3.5 text-sm",
        lg: "h-11 px-4 text-sm",
      },
      radius: {
        md: "rounded-lg",
        lg: "rounded-xl",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      radius: "md",
    },
  },
);

export const formTextareaSizeVariants = cva("h-auto resize-y leading-relaxed", {
  variants: {
    size: {
      sm: "min-h-14 px-3 py-1.5 text-xs",
      md: "min-h-18 px-3.5 py-2 text-sm",
      lg: "min-h-24 px-4 py-2.5 text-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const formRadioGroupVariants = cva("w-full", {
  variants: {
    orientation: {
      vertical: "flex flex-col gap-2",
      horizontal: "grid grid-cols-1 gap-2 sm:grid-cols-2",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export const formRadioItemVariants = cva(
  "group flex cursor-pointer items-start gap-3 border border-solid font-sans select-none transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast) data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        card: "rounded-xl border-input/50 bg-background p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-foreground/22 hover:bg-accent/35 has-data-checked:border-signal/60 has-data-checked:bg-signal/6 has-data-checked:shadow-none dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22 dark:has-data-checked:border-signal/65",
        compact:
          "rounded-lg border-input/50 bg-background px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-foreground/22 hover:bg-accent/35 has-data-checked:border-signal/60 has-data-checked:bg-signal/6 has-data-checked:shadow-none dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22 dark:has-data-checked:border-signal/65",
        minimal:
          "rounded-lg border-transparent bg-transparent px-2 py-1.5 shadow-none hover:bg-accent/45 has-data-checked:bg-accent/55",
      },
    },
    defaultVariants: {
      variant: "card",
    },
  },
);

export const formActionsVariants = cva("flex flex-wrap items-center gap-2.5 pt-1", {
  variants: {
    align: {
      start: "justify-start",
      end: "justify-end",
      between: "justify-between",
    },
  },
  defaultVariants: {
    align: "between",
  },
});
export type FormValidationMode = "onSubmit" | "onBlur" | "onChange";
export type FormVariant = "default" | "card" | "subtle";
export type FormDensity = "default" | "compact" | "relaxed";
export type FormControlVariant = "default" | "filled" | "ghost";
export type FormControlSize = "sm" | "md" | "lg";
export type FormControlRadius = "md" | "lg" | "pill";
export type FormFieldLayout = "vertical" | "horizontal";
export type FormRadioOrientation = "vertical" | "horizontal";
export type FormRadioItemVariant = "card" | "compact" | "minimal";

export interface FormProps extends Omit<ComponentProps<"form">, "onSubmit"> {
  /** 校验时机，默认 onSubmit */
  validationMode?: FormValidationMode;
  /** 外部（例如服务端）返回的字段错误映射 */
  errors?: Record<string, string | string[]>;
  /** 校验通过提交时调用，接收按字段名收集的表单值 */
  onFormSubmit?: (values: Record<string, unknown>) => void;
  /** 表单容器表面风格 */
  variant?: FormVariant;
  /** 字段间距密度 */
  density?: FormDensity;
  /** 透传给内部输入框与文本域的默认外观 */
  controlVariant?: FormControlVariant;
  /** 透传给内部输入框与文本域的默认尺寸 */
  controlSize?: FormControlSize;
  /** 透传给内部输入框的默认圆角 */
  controlRadius?: FormControlRadius;
}

export interface FormFieldProps extends ComponentProps<"div"> {
  /** 字段名称，用于提交取值与外部 errors 映射 */
  name?: string;
  /** 自定义校验函数；返回错误文案即视为不合法 */
  validate?: (value: unknown) => string | string[] | null | void;
  /** 覆盖外层表单的校验时机 */
  validationMode?: FormValidationMode;
  /** 字段排列方式：纵向堆叠或左右分栏 */
  layout?: FormFieldLayout;
  invalid?: boolean;
  disabled?: boolean;
}

export interface FormLabelProps extends ComponentProps<"label"> {
  /** 必填星号提示（仅视觉装饰，表单校验仍由控件 required 控制） */
  required?: boolean;
  /** 选填徽标提示，帮助区分非必填字段 */
  optional?: boolean;
}

export interface FormInputProps extends Omit<ComponentProps<"input">, "size"> {
  /** 输入框视觉风格，未传时继承外层 Form 的 controlVariant */
  variant?: FormControlVariant;
  /** 输入框高度与字号，未传时继承外层 Form 的 controlSize */
  size?: FormControlSize;
  /** 输入框圆角，未传时继承外层 Form 的 controlRadius */
  radius?: FormControlRadius;
}

export interface FormTextareaProps extends ComponentProps<"textarea"> {
  /** 文本域视觉风格，未传时继承外层 Form 的 controlVariant */
  variant?: FormControlVariant;
  /** 文本域字号与内边距，未传时继承外层 Form 的 controlSize */
  size?: FormControlSize;
  /** 文本域圆角 */
  radius?: Exclude<FormControlRadius, "pill">;
}

export interface FormDescriptionProps extends ComponentProps<"p"> {}

export interface FormErrorProps extends ComponentProps<"div"> {
  /** 强制展示错误文案或按原生 ValidityState 键名匹配 */
  match?: boolean | keyof ValidityState;
}

export interface FormSectionProps extends ComponentProps<"div"> {
  /** 分组标题 */
  title?: string;
  /** 分组补充说明 */
  description?: string;
}

export interface FormActionsProps extends ComponentProps<"div"> {
  /** 底部操作栏对齐方式 */
  align?: "start" | "end" | "between";
}

export interface FormRadioGroupProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** 选项排布方向：纵向列表或双列网格 */
  orientation?: FormRadioOrientation;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export interface FormRadioItemProps {
  value: string;
  label: string;
  description?: string;
  /** 右侧辅助徽章（如"推荐"、"免费"） */
  badge?: string;
  /** 单选项外观风格 */
  variant?: FormRadioItemVariant;
  disabled?: boolean;
  className?: string;
}
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
