/**
 * SelectionActions 的类型定义。
 */
import type { ComponentProps, ReactNode } from "react";

export interface SelectionActionItem {
  /** 指令唯一标识 */
  id: string;
  /** 按钮文案 */
  label: string;
  /** 可选前置图标 */
  icon?: ReactNode;
}

export interface SelectionActionsProps extends Omit<ComponentProps<"div">, "children"> {
  /** 当前选中的文本内容 */
  selectedText?: string;
  /** 快捷动作列表，默认包含「解释」与「润色」 */
  actions?: SelectionActionItem[];
  /** 行内输入框占位提示，默认 "描述修改意图…" */
  placeholder?: string;
  /** 是否处于处理中状态 */
  loading?: boolean;
  /** 点击快捷动作按钮回调 */
  onAction?: (actionId: string, selectedText: string) => void;
  /** 提交自定义自然语言指令回调 */
  onSubmitInstruction?: (instruction: string, selectedText: string) => void;
}
