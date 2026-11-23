import type { ReactNode } from "react";

export type EmptyStateVariant = "default" | "card" | "dashed" | "compact";

export interface EmptyStateProps {
  /** 容器视觉形态 */
  variant?: EmptyStateVariant;
  /** 顶部图标槽 */
  icon?: ReactNode;
  /** 自定义插画槽（传入时替代默认图标徽章） */
  illustration?: ReactNode;
  /** 空态标题 */
  title: string;
  /** 空态补充说明 */
  description?: string;
  /** 主操作按钮 */
  action?: ReactNode;
  /** 次操作按钮 */
  secondaryAction?: ReactNode;
  /** 紧凑模式（用于表格或侧边栏内嵌） */
  compact?: boolean;
  /** 自定义类名 */
  className?: string;
}
