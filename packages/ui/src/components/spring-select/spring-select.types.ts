/**
 * SpringSelect 的类型定义。
 */

export interface SpringSelectOption {
  value: string;
  label: string;
  /** 选项下方的补充说明 */
  description?: string;
  disabled?: boolean;
}

export interface SpringSelectProps {
  /** 下拉选项清单 */
  options: SpringSelectOption[];
  /** 选择器上方标签，也是触发器的可访问名称 */
  label?: string;
  /** 未选择时的占位提示 */
  placeholder?: string;
  /** 受控选中值；null 表示清空 */
  value?: string | null;
  /** 非受控初始选中值 */
  defaultValue?: string | null;
  /** 选中值变化时调用 */
  onValueChange?: (value: string | null) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
}
