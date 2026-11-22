export type SpinnerSize = "xs" | "sm" | "md" | "lg";

export interface SpinnerProps {
  /** 尺寸预设 */
  size?: SpinnerSize;
  /** 面向屏幕阅读器的加载状态描述 */
  label?: string;
  /** 自定义类名 */
  className?: string;
}
