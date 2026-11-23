/**
 * Combobox 的类型定义（支持单选搜索与多选可移除芯片模式）。
 */
import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import type { comboboxDotVariants, comboboxGroupVariants } from "./combobox.variants.js";

export type ComboboxVariant = NonNullable<VariantProps<typeof comboboxGroupVariants>["variant"]>;
export type ComboboxSize = NonNullable<VariantProps<typeof comboboxGroupVariants>["size"]>;
export type ComboboxRadius = NonNullable<VariantProps<typeof comboboxGroupVariants>["radius"]>;
export type ComboboxDot = NonNullable<VariantProps<typeof comboboxDotVariants>["dot"]>;

export interface ComboboxOption {
  value: string;
  label: string;
  /** 选项的补充说明 */
  description?: string;
  /** 选项左侧图标或头像微件 */
  icon?: ReactNode;
  /** 选项右侧紧凑附加文本（例如版本号或角色） */
  badge?: string;
  /** 选项左侧状态圆点颜色 */
  dot?: ComboboxDot;
  disabled?: boolean;
}

interface ComboboxBaseProps {
  /** 候选项列表 */
  options: ComboboxOption[];
  /** 标签文本，自动关联到搜索输入框 */
  label?: string;
  /** 输入框占位文本 */
  placeholder?: string;
  /** 无匹配结果时的提示文案，默认「没有匹配项」 */
  emptyText?: string;
  /** 视觉风格：标准描边、柔灰填充或轻浮雕 */
  variant?: ComboboxVariant;
  /** 触发器高度尺寸 */
  size?: ComboboxSize;
  /** 圆角风格 */
  radius?: ComboboxRadius;
  /** 输入框前置装饰图标（不传时可通过 showSearchIcon 显示默认搜索图标） */
  prefix?: ReactNode;
  /** 是否显示前置搜索图标，默认否 */
  showSearchIcon?: boolean;
  /** 搜索关键词变化时调用（可用于异步远程检索） */
  onInputValueChange?: (query: string) => void;
  /** 是否处于远程检索中 */
  loading?: boolean;
  /** 是否允许点击清除按钮清空选中值，默认是 */
  clearable?: boolean;
  /** 下方辅助提示文案 */
  hint?: string;
  /** 错误校验文案（传入时触发错误边框与 aria-invalid） */
  error?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
}

export interface ComboboxSingleProps extends ComboboxBaseProps {
  /** 单选模式（默认） */
  multiple?: false;
  /** 受控选中值；null 表示未选 */
  value?: string | null;
  /** 非受控初始选中值 */
  defaultValue?: string | null;
  /** 选中值变化时调用 */
  onValueChange?: (value: string | null) => void;
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  /** 开启多选可移除芯片模式 */
  multiple: true;
  /** 受控选中值数组 */
  value?: string[];
  /** 非受控初始选中值数组 */
  defaultValue?: string[];
  /** 选中值数组变化时调用 */
  onValueChange?: (value: string[]) => void;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;
