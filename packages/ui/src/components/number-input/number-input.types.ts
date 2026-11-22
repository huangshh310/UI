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
  /** 标签（开启 scrub 时按住标签可横向拖拽微调） */
  label?: string;
  /** Intl.NumberFormat 格式化配置（货币/百分比/小数位） */
  format?: Intl.NumberFormatOptions;
  /** 是否允许在标签上横向拖拽微调 */
  scrub?: boolean;
  /** 禁用态 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}
