import type { ReactNode } from "react";

export interface StaggeredListProps {
  /** 要错峰显现的子元素列表 */
  children: ReactNode;
  /** 相邻条目错峰间隔（毫秒） */
  staggerMs?: number;
  /** 是否在滚入视口时触发显现 */
  revealOnScroll?: boolean;
  /** 自定义列表容器类名 */
  className?: string;
}
