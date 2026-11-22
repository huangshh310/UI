/**
 * Combobox 的类型定义。
 */

export interface ComboboxOption {
  value: string;
  label: string;
  /** 选项的补充说明 */
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** 候选项列表 */
  options: ComboboxOption[];
  /** 标签文本，自动关联到搜索输入框 */
  label?: string;
  /** 输入框占位文本 */
  placeholder?: string;
  /** 无匹配结果时的提示文案，默认「没有匹配项」 */
  emptyText?: string;
  /** 受控选中值；null 表示未选 */
  value?: string | null;
  /** 非受控初始选中值 */
  defaultValue?: string | null;
  /** 选中值变化时调用 */
  onValueChange?: (value: string | null) => void;
  /** 搜索关键词变化时调用（可用于异步远程检索） */
  onInputValueChange?: (query: string) => void;
  /** 是否处于远程检索中 */
  loading?: boolean;
  /** 是否允许点击清除按钮清空选中值，默认是 */
  clearable?: boolean;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
}
