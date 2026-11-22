import type { ReactNode } from "react";

export type TabsVariant = "pill" | "underline" | "card";

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
  /** 视觉变体：胶囊分段 / 下划线 / 卡片 */
  variant?: TabsVariant;
  /** 自定义容器类名 */
  className?: string;
}
