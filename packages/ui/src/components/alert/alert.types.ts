import type { ReactNode } from "react";

export type AlertVariant = "neutral" | "info" | "success" | "warning" | "destructive";
export type AlertAppearance = "soft" | "accent" | "solid" | "banner";

export interface AlertProps {
  /** 语义级别 */
  variant?: AlertVariant;
  /** 视觉呈现形态：柔和底色 / 左侧强调条 / 实色高强调 / 通栏横幅 */
  appearance?: AlertAppearance;
  /** 提示标题 */
  title: string;
  /** 详细说明 */
  description?: ReactNode;
  /** 自定义左侧图标，省略时按 variant 匹配默认图标 */
  icon?: ReactNode;
  /** 右侧操作按钮槽 */
  action?: ReactNode;
  /** 是否允许关闭（传入 onDismiss 时默认自动开启） */
  dismissible?: boolean;
  /** 关闭回调 */
  onDismiss?: () => void;
  /** 自定义容器类名 */
  className?: string;
}
