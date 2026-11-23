import type { ReactNode } from "react";

/** 列表项入场与退场动效风格 */
export type StaggeredListVariant = "fade-up" | "scale" | "slide-left";

export interface StaggeredListProps {
  /** 要错峰显现与布局过渡的子元素列表 */
  children: ReactNode;
  /** 动效编排风格：上浮淡入 / 缩放聚焦 / 左侧滑入，默认 fade-up */
  variant?: StaggeredListVariant;
  /** 相邻条目错峰间隔（毫秒），默认 45 */
  staggerMs?: number;
  /** 入场位移距离（像素，适用于 fade-up 与 slide-left），默认 12 */
  distance?: number;
  /** 错峰延迟总上限（毫秒），默认 360 */
  maxDelayMs?: number;
  /** 是否启用条目增删或筛选时的弹簧布局过渡，默认 true */
  layout?: boolean;
  /** 是否在滚入视口时触发显现，默认 false */
  revealOnScroll?: boolean;
  /** 非滚入模式下是否在首次挂载时立即执行入场动画，默认 false */
  animateOnMount?: boolean;
  /** 自定义列表容器类名 */
  className?: string;
}
