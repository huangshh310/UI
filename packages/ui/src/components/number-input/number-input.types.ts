import type { ReactNode } from "react";

export type NumberInputVariant = "default" | "filled" | "stepper";

export type NumberInputSize = "sm" | "md" | "lg";

export interface NumberInputProps {
  /** 受控数值 */
  value?: number | null;
  /** 初始数值 */
  defaultValue?: number;
  /** 数值变化回调 */
  onValueChange?: (value: number | null) => void;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步进间隔 */
  step?: number;
  /** 外观变体：默认发丝边框 / 柔雾填充 / 右侧堆叠步进 */
  variant?: NumberInputVariant;
  /** 高度与字号规格 */
  size?: NumberInputSize;
  /** 输入框前置装饰（如货币符号） */
  prefix?: ReactNode;
  /** 输入框后置单位（如 px / ms / %） */
  suffix?: ReactNode;
  /** 标签（开启 scrub 时按住标签可横向拖拽微调） */
  label?: string;
  /** 辅助说明文字 */
  hint?: string;
  /** 错误提示（传入时自动进入无效校验态） */
  error?: string;
  /** 是否处于无效校验态 */
  invalid?: boolean;
  /** Intl.NumberFormat 格式化配置（货币/百分比/小数位） */
  format?: Intl.NumberFormatOptions;
  /** 是否允许在标签上横向拖拽微调 */
  scrub?: boolean;
  /** 禁用态 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}
