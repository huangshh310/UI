export type PaginationVariant = "default" | "minimal" | "pills";

export type PaginationSize = "sm" | "md" | "lg";

export interface PaginationProps {
  /** 当前页码（从 1 开始） */
  page: number;
  /** 总页数 */
  totalPages: number;
  /** 切换页码回调 */
  onPageChange: (page: number) => void;
  /** 外观变体：默认发丝页码 / 极简页码读数 / 胶囊实底 */
  variant?: PaginationVariant;
  /** 按钮尺寸规格 */
  size?: PaginationSize;
  /** 是否显示跳至首页 / 末页按钮 */
  showEdges?: boolean;
  /** 当前页两侧各展示几个页码 */
  siblingCount?: number;
  /** 导航区域无障碍名称 */
  ariaLabel?: string;
  /** 自定义类名 */
  className?: string;
}
