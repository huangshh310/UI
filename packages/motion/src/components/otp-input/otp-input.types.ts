/**
 * OtpInput 的类型定义。
 */

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
