/**
 * OtpInput 的类型定义。
 */
import type { ReactNode } from "react";

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
