import type { ReactNode } from "react";

export type ResizablePanelsVariant = "card" | "flush";

export type ResizableHandleStyle = "pill" | "line" | "dots";

export interface ResizablePanelItem {
  id: string;
  /** 初始占比（百分比 0-100） */
  defaultSize?: number;
  /** 最小占比 */
  minSize?: number;
  /** 最大占比 */
  maxSize?: number;
  /** 面板内容 */
  content: ReactNode;
}

export interface ResizablePanelsProps {
  /** 分栏方向 */
  orientation?: "horizontal" | "vertical";
  /** 外观变体：发丝卡片容器或无边框全幅工作区 */
  variant?: ResizablePanelsVariant;
  /** 分隔手柄风格：胶囊握柄 / 极简发丝线 / 三点握柄 */
  handleStyle?: ResizableHandleStyle;
  /** 面板配置列表（至少 2 项） */
  panels: ResizablePanelItem[];
  /** 方向键单次步进百分比 */
  step?: number;
  /** 布局变化回调（各面板百分比） */
  onLayoutChange?: (layout: number[]) => void;
  /** 自定义容器类名 */
  className?: string;
}
