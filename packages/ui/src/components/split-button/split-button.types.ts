/**
 * SplitButton 的类型定义。
 */
import type { ReactNode } from "react";

/** 下拉菜单中的一个相关操作 */
export interface SplitButtonAction {
  /** 唯一标识 */
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface SplitButtonProps {
  /** 主操作上显示的内容 */
  children: ReactNode;
  /** 点击主操作时调用 */
  onClick?: () => void;
  /** 下拉菜单中的相关操作 */
  actions: SplitButtonAction[];
  /** 打开菜单的按钮的可访问名称，默认「More actions」 */
  menuLabel?: string;
  /** 禁用整个控件 */
  disabled?: boolean;
  className?: string;
}
