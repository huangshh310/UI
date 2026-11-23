import type { ReactNode } from "react";

export type ToastTone = "default" | "signal" | "success" | "warning" | "destructive";
export type ToastPlacement = "bottom-right" | "bottom-center" | "top-right" | "top-center";

export interface ToastInput {
  /** 通知标题 */
  title: string;
  /** 辅助说明 */
  description?: string;
  /** 语义色调 */
  tone?: ToastTone;
  /** 自定义左侧状态图标 */
  icon?: ReactNode;
  /** 动作按钮文案（如「撤销」） */
  actionLabel?: string;
  /** 动作按钮点击回调 */
  onAction?: () => void;
  /** 是否显示右侧关闭按钮，默认 true */
  dismissible?: boolean;
  /** 自动关闭时长（毫秒，0 为不自动关闭） */
  timeout?: number;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** 通知停靠位置 */
  placement?: ToastPlacement;
  /** 默认停留时间（毫秒） */
  timeout?: number;
  /** 同时展示的最大数量 */
  limit?: number;
}
