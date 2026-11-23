import type { ReactNode } from "react";

export type ReorderListVariant = "cards" | "divided";

export type ReorderListDensity = "compact" | "comfortable";

export interface ReorderListItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
}

export interface ReorderListProps {
  /** 待排序条目（顺序按 value 决定，未传 value 时使用本数组顺序） */
  items: ReorderListItem[];
  /** 受控条目 id 顺序 */
  value?: string[];
  /** 顺序提交回调 */
  onValueChange?: (nextIds: string[]) => void;
  /** 容器外观：独立卡片组或发丝分隔列表 */
  variant?: ReorderListVariant;
  /** 条目间距密度 */
  density?: ReorderListDensity;
  /** 是否显示实时顺序编号（01 / 02 / ...） */
  showIndex?: boolean;
  /** 列表无障碍名称 */
  ariaLabel?: string;
  /** 自定义类名 */
  className?: string;
}
