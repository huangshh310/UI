/**
 * DrawCheckbox 的类型定义。
 */

export interface DrawCheckboxProps {
  id?: string;
  name?: string;
  value?: string;
  /** 复选框旁的标签文字 */
  label?: string;
  /** 标签下方的补充说明 */
  description?: string;
  /** 受控勾选状态 */
  checked?: boolean;
  /** 非受控初始勾选状态，默认否 */
  defaultChecked?: boolean;
  /** 半选态（部分选中） */
  indeterminate?: boolean;
  /** 勾选态底色：默认 primary，需要视觉唯一强调时可选 signal */
  tone?: "primary" | "signal";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}
