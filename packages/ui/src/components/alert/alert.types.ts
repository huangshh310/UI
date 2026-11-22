import type { ReactNode } from "react";

export type AlertVariant = "neutral" | "info" | "success" | "warning" | "destructive";

export interface AlertProps {
  /** 语义级别 */
  variant?: AlertVariant;
  /** 提示标题 */
  title: string;
  /** 详细说明 */
  description?: ReactNode;
  /** 自定义左侧图标，省略时按 variant 匹配默认图标 */
  icon?: ReactNode;
  /** 右侧操作按钮槽 */
  action?: ReactNode;
  /** 是否允许关闭 */
  dismissible?: boolean;
  /** 关闭回调 */
  onDismiss?: () => void;
  /** 自定义容器类名 */
  className?: string;
}
