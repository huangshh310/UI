import type { ReactElement, ReactNode } from "react";

export type SettleModalSize = "sm" | "md" | "lg";

export interface SettleModalProps {
  /** 受控打开状态 */
  open?: boolean;
  /** 非受控初始打开状态 */
  defaultOpen?: boolean;
  /** 打开状态变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 触发元素（传入按钮等交互元素，不嵌套额外 button） */
  trigger?: ReactElement;
  /** 弹窗标题，用于无障碍命名 */
  title: string;
  /** 弹窗副标题说明 */
  description?: string;
  /** 主体内容 */
  children?: ReactNode;
  /** 底部操作栏 */
  footer?: ReactNode;
  /** 宽度预设 */
  size?: SettleModalSize;
  /** 是否显示右上角关闭按钮 */
  showCloseButton?: boolean;
  /** 自定义弹窗面板类名 */
  className?: string;
}
