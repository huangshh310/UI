export type ProgressTone = "signal" | "primary" | "success";
export type ProgressSize = "sm" | "md";

export interface ProgressProps {
  /** 当前进度值；传 null 表示不确定加载状态 */
  value: number | null;
  /** 最大值，默认 100 */
  max?: number;
  /** 顶部左侧标签 */
  label?: string;
  /** 是否在右侧展示等宽百分比读数 */
  showValue?: boolean;
  /** 指示条色调 */
  tone?: ProgressTone;
  /** 轨道高度 */
  size?: ProgressSize;
  /** 自定义容器类名 */
  className?: string;
}
