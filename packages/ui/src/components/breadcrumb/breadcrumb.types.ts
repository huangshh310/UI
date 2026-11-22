export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  /** 路径节点列表，末项自动标记 aria-current="page" */
  items: BreadcrumbItem[];
  /** 最多展示节点数，超出时折叠中间路径 */
  maxItems?: number;
  /** 导航无障碍名称 */
  ariaLabel?: string;
  /** 自定义类名 */
  className?: string;
}
