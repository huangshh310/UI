export interface PaginationProps {
  /** 当前页码（从 1 开始） */
  page: number;
  /** 总页数 */
  totalPages: number;
  /** 切换页码回调 */
  onPageChange: (page: number) => void;
  /** 当前页两侧各展示几个页码 */
  siblingCount?: number;
  /** 导航区域无障碍名称 */
  ariaLabel?: string;
  /** 自定义类名 */
  className?: string;
}
