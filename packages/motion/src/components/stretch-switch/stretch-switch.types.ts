/**
 * StretchSwitch 的类型定义。
 */

export interface StretchSwitchProps {
  id?: string;
  name?: string;
  value?: string;
  /** 开关旁的标签文字 */
  label?: string;
  /** 标签下方的补充说明 */
  description?: string;
  /** 受控开启状态 */
  checked?: boolean;
  /** 非受控初始开启状态，默认否 */
  defaultChecked?: boolean;
  /** 开启态轨道底色：默认 primary，需要唯一视觉强调时可选 signal */
  tone?: "primary" | "signal";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}
