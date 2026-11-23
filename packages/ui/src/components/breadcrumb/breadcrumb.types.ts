import type { ReactNode } from "react";

export type BreadcrumbVariant = "chevron" | "slash" | "pill";

export type BreadcrumbSize = "sm" | "md";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  /** 路径节点列表，末项自动标记 aria-current="page" */
  items: BreadcrumbItem[];
  /** 视觉风格：箭头分隔 / 斜杠分隔 / 胶囊容器 */
  variant?: BreadcrumbVariant;
  /** 字号与间距规格 */
  size?: BreadcrumbSize;
  /** 自定义分隔符（覆盖变体默认分隔符） */
  separator?: ReactNode;
  /** 最多展示节点数，超出时折叠中间路径 */
  maxItems?: number;
  /** 导航无障碍名称 */
  ariaLabel?: string;
  /** 自定义类名 */
  className?: string;
}
