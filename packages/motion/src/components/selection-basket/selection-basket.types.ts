import type { ReactNode } from "react";

export interface SelectionBasketAction {
  id: string;
  label: string;
  icon?: ReactNode;
  tone?: "default" | "signal" | "destructive";
  onClick: () => void;
}

export interface SelectionBasketProps {
  /** 已选条目数量；为 0 时收起 */
  count: number;
  /** 可选总数，传入时显示「全选」按钮 */
  totalCount?: number;
  /** 批量操作按钮列表 */
  actions: SelectionBasketAction[];
  /** 全选回调 */
  onSelectAll?: () => void;
  /** 清空选择回调 */
  onClear: () => void;
  /** 是否固定悬浮在视口底部（文档预览可设 false） */
  floating?: boolean;
  /** 自定义类名 */
  className?: string;
}
