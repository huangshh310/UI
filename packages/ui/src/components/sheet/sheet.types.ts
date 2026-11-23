import type { ReactElement, ReactNode } from "react";

export type SheetSide = "right" | "left" | "top" | "bottom";
export type SheetSize = "sm" | "md" | "lg" | "xl";
export type SheetBackdrop = "blur" | "dim" | "transparent";

export interface SheetProps {
  /** 受控打开状态 */
  open?: boolean;
  /** 非受控初始打开状态 */
  defaultOpen?: boolean;
  /** 开关状态回调 */
  onOpenChange?: (open: boolean) => void;
  /** 触发元素 */
  trigger?: ReactElement;
  /** 滑入方向 */
  side?: SheetSide;
  /** 尺寸预设（左右抽屉控制宽度，上下抽屉控制最大高度） */
  size?: SheetSize;
  /** 是否以悬浮留白圆角卡片展示（默认 true，四周圆角并与视口保留间距；false 为传统贴边模式） */
  inset?: boolean;
  /** 背景遮罩风格 */
  backdrop?: SheetBackdrop;
  /** 抽屉标题 */
  title: string;
  /** 抽屉副标题 */
  description?: string;
  /** 标题左侧徽章图标 */
  icon?: ReactNode;
  /** 标题旁状态胶囊标签 */
  badge?: string;
  /** 独立滚动主体内容 */
  children?: ReactNode;
  /** 吸底操作栏 */
  footer?: ReactNode;
  /** 是否展示关闭按钮 */
  showCloseButton?: boolean;
  /** 自定义面板类名 */
  className?: string;
}
