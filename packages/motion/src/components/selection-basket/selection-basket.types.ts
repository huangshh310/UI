import type { ReactNode } from "react";

export type SelectionBasketVariant = "default" | "inverted" | "glass";
export type SelectionBasketSize = "sm" | "md";
export type SelectionBasketPosition = "bottom" | "top";

export interface SelectionBasketAction {
  id: string;
  label: string;
  icon?: ReactNode;
  tone?: "default" | "signal" | "destructive";
  disabled?: boolean;
  onClick: () => void;
}

export interface SelectionBasketProps {
  /** 已选条目数量；为 0 时收起 */
  count: number;
  /** 可选总数，传入时显示「全选」按钮 */
  totalCount?: number;
  /** 批量操作按钮列表 */
  actions: SelectionBasketAction[];
  /** 视觉风格：default 磨砂浅浮舱 / inverted 高对比反色浮舱 / glass 轻透胶囊 */
  variant?: SelectionBasketVariant;
  /** 尺寸密度 */
  size?: SelectionBasketSize;
  /** 悬浮吸附位置（仅 floating=true 时生效） */
  position?: SelectionBasketPosition;
  /** 全选回调 */
  onSelectAll?: () => void;
  /** 清空选择回调 */
  onClear: () => void;
  /** 是否固定悬浮在视口边缘（文档预览可设 false） */
  floating?: boolean;
  /** 自定义类名 */
  className?: string;
}
