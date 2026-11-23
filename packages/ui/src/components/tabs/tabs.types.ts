import type { ReactNode } from "react";

export type TabsVariant = "pill" | "line" | "underline" | "card" | "enclosed";

export type TabsSize = "sm" | "md" | "lg";

export interface TabsItem {
  value: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  disabled?: boolean;
  content: ReactNode;
}

export interface TabsProps {
  /** 页签项数组 */
  items: TabsItem[];
  /** 受控当前值 */
  value?: string;
  /** 非受控默认值 */
  defaultValue?: string;
  /** 页签切换回调 */
  onValueChange?: (value: string) => void;
  /** 视觉变体：胶囊分段 / 极简底线 / 卡片 / 围合面板（underline 为 line 兼容别名） */
  variant?: TabsVariant;
  /** 尺寸规格 */
  size?: TabsSize;
  /** 是否撑满容器等宽分布 */
  fullWidth?: boolean;
  /** 页签列表容器附加类名 */
  listClassName?: string;
  /** 面板区域附加类名 */
  panelClassName?: string;
  /** 自定义容器类名 */
  className?: string;
}
