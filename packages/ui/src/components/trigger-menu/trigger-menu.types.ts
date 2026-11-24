/**
 * TriggerMenu 的公开类型定义：光标锚定多触发符检索菜单与外部输入器适配契约。
 */
import type { ReactNode } from "react";

export interface TriggerMenuItemOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  icon?: ReactNode;
  keywords?: string[];
  disabled?: boolean;
  insertText?: string;
}

export interface TriggerMenuSource {
  char: string;
  type?: string;
  groupLabel?: string;
  boundary?: "start" | "line" | "word" | "anywhere";
  items: TriggerMenuItemOption[];
}

export interface TriggerMenuSelectPayload {
  value: string;
  trigger: string;
  item?: TriggerMenuItemOption;
}

export interface TriggerMenuProps {
  /** 触发规则列表（如 @ 文件、/ 指令、# 标签） */
  triggers: TriggerMenuSource[];
  /** 包裹自定义输入器（如 PromptInput）时自动绑定内部文本框；省略时渲染内置输入区 */
  children?: ReactNode;
  /** 受控文本值（仅内置输入模式） */
  value?: string;
  /** 非受控初始文本值（仅内置输入模式） */
  defaultValue?: string;
  /** 文本变化回调（仅内置输入模式） */
  onValueChange?: (value: string) => void;
  /** 选中建议项回调 */
  onSelect?: (payload: TriggerMenuSelectPayload) => void;
  /** 受控浮层开关 */
  open?: boolean;
  /** 浮层开关变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 内置输入是否采用多行文本框，默认 true */
  multiline?: boolean;
  /** 内置输入占位文案 */
  placeholder?: string;
  /** 无匹配项提示文案 */
  emptyText?: string;
  /** 内置输入框无障碍名称 */
  ariaLabel?: string;
  /** 是否禁用内置输入 */
  disabled?: boolean;
  /** 浮层首选弹出方向 */
  side?: "top" | "bottom";
  className?: string;
}
