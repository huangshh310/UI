/**
 * DatePicker 组件的类型定义。
 */
import type { CalendarRadius, DateRange } from "../calendar/index.js";

/** 快捷日期预设 */
export interface DatePickerPreset {
  label: string;
  value?: Date;
  range?: DateRange;
}

export type DatePickerVariant = "default" | "filled" | "elevated";
export type DatePickerSize = "sm" | "md" | "lg";
export type DatePickerRadius = "md" | "lg" | "pill";

export interface DatePickerProps {
  /** 选择模式：单日或区间 */
  mode?: "single" | "range";
  /** 受控单日值 */
  value?: Date | null;
  /** 非受控初始单日值 */
  defaultValue?: Date | null;
  /** 单日变更回调 */
  onValueChange?: (date: Date | null) => void;
  /** 受控区间值 */
  range?: DateRange;
  /** 非受控初始区间值 */
  defaultRange?: DateRange;
  /** 区间变更回调 */
  onRangeChange?: (range: DateRange) => void;
  /** 左侧快捷日期预设 */
  presets?: DatePickerPreset[];
  /** 日历面板月数（区间模式默认 2，单日模式默认 1） */
  numberOfMonths?: 1 | 2;
  /** 字段标签 */
  label?: string;
  /** 辅助提示说明 */
  hint?: string;
  /** 校验错误提示（非空时自动切换无效态与 aria-invalid） */
  error?: string;
  /** 占位文案 */
  placeholder?: string;
  /** 本地化语言标签 */
  locale?: string;
  /** 每周起始日：0 为周日，1 为周一 */
  weekStartsOn?: 0 | 1;
  /** 触发器视觉风格 */
  variant?: DatePickerVariant;
  /** 触发器高度与字号 */
  size?: DatePickerSize;
  /** 触发器圆角风格 */
  radius?: DatePickerRadius;
  /** 弹层水平对齐方式 */
  align?: "start" | "center" | "end";
  /** 弹层日历内是否展示“回到今天”快捷按钮 */
  showTodayButton?: boolean;
  /** 弹层日历单元格圆角风格 */
  calendarRadius?: CalendarRadius;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  /** 有值时是否显示一键清空按钮 */
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}
