/** 数值字号档位 */
export type NumberFlowSize = "sm" | "md" | "lg" | "xl";

/** 数值变化趋势语义色 */
export type NumberFlowTrend = "neutral" | "up" | "down";

export interface NumberFlowProps {
  /** 要展示的数值 */
  value: number;
  /** Intl.NumberFormat 格式化配置 */
  format?: Intl.NumberFormatOptions;
  /** 区域设置，默认 zh-CN */
  locales?: string;
  /** 前缀（如 ¥、+） */
  prefix?: string;
  /** 后缀（如 /月、ms） */
  suffix?: string;
  /** 排版字号档位，默认 md */
  size?: NumberFlowSize;
  /** 趋势语义着色，默认 neutral */
  trend?: NumberFlowTrend;
  /** 自定义类名 */
  className?: string;
}
