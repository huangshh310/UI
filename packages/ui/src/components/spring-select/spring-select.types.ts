/**
 * SpringSelect 的类型定义（支持单选与多选模式）。
 */
import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import type {
  selectDotVariants,
  selectItemVariants,
  selectTriggerVariants,
} from "./spring-select.variants.js";

export type SpringSelectVariant = NonNullable<
  VariantProps<typeof selectTriggerVariants>["variant"]
>;
export type SpringSelectSize = NonNullable<VariantProps<typeof selectTriggerVariants>["size"]>;
export type SpringSelectRadius = NonNullable<VariantProps<typeof selectTriggerVariants>["radius"]>;
export type SpringSelectTone = NonNullable<VariantProps<typeof selectItemVariants>["tone"]>;
export type SpringSelectDot = NonNullable<VariantProps<typeof selectDotVariants>["dot"]>;

export interface SpringSelectOption {
  value: string;
  label: string;
  /** 选项下方的补充说明 */
  description?: string;
  /** 选项左侧图标或微件 */
  icon?: ReactNode;
  /** 选项右侧紧凑附加信息（例如 "18ms" / "Pro" / "推荐"） */
  badge?: string;
  /** 选项左侧状态圆点颜色 */
  dot?: SpringSelectDot;
  /** 分组标题；同组选项会自动归入同一分组渲染 */
  group?: string;
  disabled?: boolean;
}

interface SpringSelectBaseProps {
  /** 下拉选项清单 */
  options: SpringSelectOption[];
  /** 选择器上方标签，也是触发器的可访问名称 */
  label?: string;
  /** 未选择时的占位提示 */
  placeholder?: string;
  /** 视觉风格：标准描边、柔灰填充、轻浮雕或极简幽灵 */
  variant?: SpringSelectVariant;
  /** 触发器尺寸 */
  size?: SpringSelectSize;
  /** 圆角风格：标准、柔和圆角或胶囊形 */
  radius?: SpringSelectRadius;
  /** 选中态与勾选图标色调 */
  tone?: SpringSelectTone;
  /** 触发器前置装饰图标（未选中时显示） */
  prefix?: ReactNode;
  /** 单选时是否在触发器内一并显示已选项的说明文字 */
  showSelectedDescription?: boolean;
  /** 选中后是否显示一键清空按钮 */
  clearable?: boolean;
  /** 下拉面板顶部标题栏 */
  popupHeader?: ReactNode;
  /** 下拉面板底部信息栏 */
  popupFooter?: ReactNode;
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

export interface SpringSelectSingleProps extends SpringSelectBaseProps {
  /** 单选模式（默认） */
  multiple?: false;
  /** 受控选中值；null 表示清空 */
  value?: string | null;
  /** 非受控初始选中值 */
  defaultValue?: string | null;
  /** 选中值变化时调用 */
  onValueChange?: (value: string | null) => void;
  maxTagCount?: never;
}

export interface SpringSelectMultipleProps extends SpringSelectBaseProps {
  /** 开启多选模式，触发器以紧凑标签芯片展示已选项 */
  multiple: true;
  /** 受控选中值数组 */
  value?: string[];
  /** 非受控初始选中值数组 */
  defaultValue?: string[];
  /** 选中值数组变化时调用 */
  onValueChange?: (value: string[]) => void;
  /** 触发器内最多展示的芯片数量，超出折叠为 +N（默认 3） */
  maxTagCount?: number;
}

export type SpringSelectProps = SpringSelectSingleProps | SpringSelectMultipleProps;
