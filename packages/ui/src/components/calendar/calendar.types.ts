/**
 * Calendar 组件的类型定义。
 */
import type { ReactNode } from "react";

/** 日期区间值 */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type CalendarVariant = "default" | "elevated" | "ghost";
export type CalendarSize = "sm" | "md" | "lg";
export type CalendarRadius = "md" | "lg" | "full";

export interface CalendarProps {
  /** 选择模式：单日或区间 */
  mode?: "single" | "range";
  /** 受控单日值 */
  value?: Date | null;
  /** 非受控初始单日值 */
  defaultValue?: Date | null;
  /** 单日选中回调 */
  onValueChange?: (date: Date | null) => void;
  /** 受控区间值 */
  range?: DateRange;
  /** 非受控初始区间值 */
  defaultRange?: DateRange;
  /** 区间变化回调 */
  onRangeChange?: (range: DateRange) => void;
  /** 受控当前展示月份 */
  month?: Date;
  /** 非受控初始展示月份 */
  defaultMonth?: Date;
  /** 月份切换回调 */
  onMonthChange?: (month: Date) => void;
  /** 同时展示的月数 */
  numberOfMonths?: 1 | 2;
  /** 本地化语言标签，默认 zh-CN */
  locale?: string;
  /** 每周起始日：0 为周日，1 为周一 */
  weekStartsOn?: 0 | 1;
  /** 允许选择的最小日期（含当天） */
  minDate?: Date;
  /** 允许选择的最大日期（含当天） */
  maxDate?: Date;
  /** 自定义禁用日期判断 */
  isDateDisabled?: (date: Date) => boolean;
  /** 是否显示前后月份补位日期 */
  showOutsideDays?: boolean;
  /** 日历面板视觉风格 */
  variant?: CalendarVariant;
  /** 日期网格尺寸密度 */
  size?: CalendarSize;
  /** 日期单元格圆角风格 */
  radius?: CalendarRadius;
  /** 需要打点标注的日程或高亮日期 */
  highlightDates?: Date[];
  /** 是否在底部展示“回到今天”快捷栏 */
  showTodayButton?: boolean;
  /** 自定义底部插槽 */
  footer?: ReactNode;
  className?: string;
  "aria-label"?: string;
}
