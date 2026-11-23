export type SpinnerSize = "xs" | "sm" | "md" | "lg";
export type SpinnerVariant = "ring" | "dots" | "bars";

export interface SpinnerProps {
  /** 尺寸预设 */
  size?: SpinnerSize;
  /** 视觉样式：环形 / 脉冲点阵 / 律动柱条 */
  variant?: SpinnerVariant;
  /** 面向屏幕阅读器的加载状态描述（配合 showLabel 可同步显示文案） */
  label?: string;
  /** 是否在图标右侧显示可见的 label 文本 */
  showLabel?: boolean;
  /** 自定义类名 */
  className?: string;
}
