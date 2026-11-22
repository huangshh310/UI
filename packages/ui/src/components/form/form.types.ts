/**
 * Form 模块化表单系统的类型定义。
 * 不对外暴露底层 Base UI 类型，保持接口可替换。
 */
import type { ComponentProps, ReactNode } from "react";

export type FormValidationMode = "onSubmit" | "onBlur" | "onChange";

export interface FormProps extends Omit<ComponentProps<"form">, "onSubmit"> {
  /** 校验时机，默认 onSubmit */
  validationMode?: FormValidationMode;
  /** 外部（例如服务端）返回的字段错误映射 */
  errors?: Record<string, string | string[]>;
  /** 校验通过提交时调用，接收按字段名收集的表单值 */
  onFormSubmit?: (values: Record<string, unknown>) => void;
}

export interface FormFieldProps extends ComponentProps<"div"> {
  /** 字段名称，用于提交取值与外部 errors 映射 */
  name?: string;
  /** 自定义校验函数；返回错误文案即视为不合法 */
  validate?: (value: unknown) => string | string[] | null | void;
  /** 覆盖外层表单的校验时机 */
  validationMode?: FormValidationMode;
  invalid?: boolean;
  disabled?: boolean;
}

export interface FormLabelProps extends ComponentProps<"label"> {
  /** 必填星号提示（仅视觉装饰，表单校验仍由控件 required 控制） */
  required?: boolean;
}

export interface FormInputProps extends ComponentProps<"input"> {}

export interface FormTextareaProps extends ComponentProps<"textarea"> {}

export interface FormDescriptionProps extends ComponentProps<"p"> {}

export interface FormErrorProps extends ComponentProps<"div"> {
  /** 强制展示错误文案或按原生 ValidityState 键名匹配 */
  match?: boolean | keyof ValidityState;
}

export interface FormRadioGroupProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
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
  disabled?: boolean;
  className?: string;
}
