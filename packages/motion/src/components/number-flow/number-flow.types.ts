export interface NumberFlowProps {
  /** 要展示的数值 */
  value: number;
  /** Intl.NumberFormat 格式化配置 */
  format?: Intl.NumberFormatOptions;
  /** 区域设置，默认 zh-CN */
  locales?: string;
  /** 前缀（如 +） */
  prefix?: string;
  /** 后缀（如 /月） */
  suffix?: string;
  /** 自定义类名 */
  className?: string;
}
