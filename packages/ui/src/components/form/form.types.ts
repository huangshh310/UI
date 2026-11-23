/**
 * Form 模块化表单系统的类型定义。
 * 不对外暴露底层 Base UI 类型，保持接口可替换。
 */
import type { ComponentProps, ReactNode } from "react";

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
