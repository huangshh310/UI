export type ProgressTone = "default" | "primary" | "signal" | "success" | "warning" | "destructive";

export type ProgressSize = "sm" | "md" | "lg";

export interface ProgressProps {
  /** 当前进度值；传 null 或配合 indeterminate 表示不确定加载状态 */
  value?: number | null;
  /** 最大值，默认 100 */
  max?: number;
  /** 顶部左侧标签 */
  label?: string;
  /** 是否在右侧展示等宽百分比读数 */
  showValue?: boolean;
  /** 是否强制切换为不确定流光加载态 */
  indeterminate?: boolean;
  /** 指示条色调 */
  tone?: ProgressTone;
  /** 轨道高度 */
  size?: ProgressSize;
  /** 自定义容器类名 */
  className?: string;
}
