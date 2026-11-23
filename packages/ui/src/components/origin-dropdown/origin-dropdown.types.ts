import type { ReactElement, ReactNode } from "react";

export type OriginDropdownSize = "sm" | "md";
export type OriginDropdownTriggerVariant = "default" | "subtle" | "ghost";
export type OriginDropdownActionTone = "default" | "signal" | "destructive";

export type OriginDropdownActionEntry = {
  kind: "action";
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  shortcut?: string;
  tone?: OriginDropdownActionTone;
  disabled?: boolean;
  onSelect?: () => void;
};

export type OriginDropdownCheckboxEntry = {
  kind: "checkbox";
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export type OriginDropdownSeparatorEntry = {
  kind: "separator";
};

export type OriginDropdownGroupEntry = {
  kind: "group";
  label: string;
  items: (OriginDropdownActionEntry | OriginDropdownCheckboxEntry)[];
};

export type OriginDropdownEntry =
  | OriginDropdownActionEntry
  | OriginDropdownCheckboxEntry
  | OriginDropdownSeparatorEntry
  | OriginDropdownGroupEntry;

export interface OriginDropdownProps {
  /** 受控打开状态 */
  open?: boolean;
  /** 非受控初始打开状态 */
  defaultOpen?: boolean;
  /** 开关状态变更回调 */
  onOpenChange?: (open: boolean) => void;
  /** 自定义触发元素；省略时使用默认按钮与 label */
  trigger?: ReactElement;
  /** 默认触发按钮文案 */
  label?: string;
  /** 默认触发按钮视觉风格 */
  triggerVariant?: OriginDropdownTriggerVariant;
  /** 菜单密度尺寸 */
  size?: OriginDropdownSize;
  /** 菜单项列表（支持动作、勾选、分组与分隔线） */
  items: OriginDropdownEntry[];
  /** 展开方向 */
  side?: "top" | "bottom" | "left" | "right";
  /** 对齐方式 */
  align?: "start" | "center" | "end";
  /** 菜单与触发器的间距（像素） */
  sideOffset?: number;
  /** 菜单面板自定义类名 */
  className?: string;
}
