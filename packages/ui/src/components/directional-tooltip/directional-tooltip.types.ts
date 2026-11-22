import type { ReactElement, ReactNode } from "react";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";

export interface DirectionalTooltipProviderProps {
  children?: ReactNode;
  /** 组内默认延迟（毫秒） */
  delay?: number;
  /** 组内关闭延迟（毫秒） */
  closeDelay?: number;
  /** 快速切换时间窗口（毫秒） */
  timeout?: number;
}

export interface DirectionalTooltipProps {
  /** 提示文案或节点 */
  content: ReactNode;
  /** 触发元素（传入按钮、链接等交互元素） */
  children: ReactElement;
  /** 弹出方向，动效将沿该方向轴线滑入 */
  side?: TooltipSide;
  /** 对齐方式 */
  align?: TooltipAlign;
  /** 与触发元素的间距（像素） */
  sideOffset?: number;
  /** 悬停触发延迟（毫秒） */
  delay?: number;
  /** 受控显示状态 */
  open?: boolean;
  /** 状态变更回调 */
  onOpenChange?: (open: boolean) => void;
  /** 是否显示指示箭头 */
  showArrow?: boolean;
  /** 自定义气泡类名 */
  className?: string;
}
