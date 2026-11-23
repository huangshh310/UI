/**
 * SplitButton 的类型定义。
 */
import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import type { splitSegmentVariants } from "./split-button.variants.js";

type SplitVariantProps = VariantProps<typeof splitSegmentVariants>;

/** 视觉变体 */
export type SplitButtonVariant = NonNullable<SplitVariantProps["variant"]>;

/** 尺寸 */
export type SplitButtonSize = NonNullable<SplitVariantProps["size"]>;

/** 圆角风格 */
export type SplitButtonRadius = NonNullable<SplitVariantProps["radius"]>;

/** 下拉菜单中的一个相关操作 */
export interface SplitButtonAction {
  /** 唯一标识 */
  id: string;
  label: string;
  onSelect: () => void;
  /** 可选前置图标 */
  icon?: ReactNode;
  /** 可选辅助说明文案 */
  description?: string;
  /** 可选快捷键提示（纯视觉展示，如 "⌘⇧S"） */
  shortcut?: string;
  /** 是否为高危破坏性操作 */
  destructive?: boolean;
  disabled?: boolean;
}

export interface SplitButtonProps {
  /** 主操作上显示的内容 */
  children: ReactNode;
  /** 点击主操作时调用 */
  onClick?: () => void;
  /** 下拉菜单中的相关操作 */
  actions: SplitButtonAction[];
  /** 视觉变体，默认 primary */
  variant?: SplitButtonVariant;
  /** 尺寸，默认 md */
  size?: SplitButtonSize;
  /** 圆角风格，默认 pill */
  radius?: SplitButtonRadius;
  /** 主操作是否处于加载中 */
  loading?: boolean;
  /** 打开菜单的按钮的可访问名称，默认「More actions」 */
  menuLabel?: string;
  /** 禁用整个控件 */
  disabled?: boolean;
  className?: string;
}
