/**
 * Calendar 日期计算与格式化辅助函数（零第三方日期库依赖）。
 */
import type { DateRange } from "./calendar.types.js";

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const addMonths = (date: Date, delta: number) =>
  new Date(date.getFullYear(), date.getMonth() + delta, 1);

export const addDays = (date: Date, delta: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);

export const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  Boolean(
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate(),
  );

export const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const isDateBlocked = (
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  isDateDisabled?: (d: Date) => boolean,
) => {
  const day = startOfDay(date).getTime();
  if (minDate && day < startOfDay(minDate).getTime()) return true;
  if (maxDate && day > startOfDay(maxDate).getTime()) return true;
  return Boolean(isDateDisabled?.(date));
};

/** 生成指定月份的 6 周（42 天）网格，按行分组 */
export const buildMonthWeeks = (month: Date, weekStartsOn: 0 | 1): Date[][] => {
  const first = startOfMonth(month);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const cursor = addDays(first, -offset);
  return Array.from({ length: 6 }, (_week, week) =>
    Array.from({ length: 7 }, (_day, day) => addDays(cursor, week * 7 + day)),
  );
};

/** 生成本地化星期标题列表 */
export const getWeekdayLabels = (locale: string, weekStartsOn: 0 | 1): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  // 2026-02-01 是周日，适合作为周序列锚点
  const sunday = new Date(2026, 1, 1);
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(addDays(sunday, (weekStartsOn + index) % 7)),
  );
};

export const formatMonthTitle = (month: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }).format(month);

export const formatDayLabel = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(date);

/** 区间选择状态转移：首点设起点，次点自动规范起止顺序，三点重新开始 */
export const applyRangePick = (current: DateRange, clicked: Date): DateRange => {
  const day = startOfDay(clicked);
  if (!current.start || current.end) return { start: day, end: null };
  const startTime = startOfDay(current.start).getTime();
  return day.getTime() < startTime
    ? { start: day, end: startOfDay(current.start) }
    : { start: startOfDay(current.start), end: day };
};

export const isBetweenRange = (date: Date, range: DateRange) => {
  if (!range.start || !range.end) return false;
  const time = startOfDay(date).getTime();
  return time > startOfDay(range.start).getTime() && time < startOfDay(range.end).getTime();
};
