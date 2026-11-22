// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Calendar：支持单日/区间选择、双月并排、禁用约束与完整方向键导航的月历组件。
 * 交互与日期计算均由原生 grid ARIA 语义与 Intl.DateTimeFormat 实现，零额外外部日期库依赖。
 */

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

/** 日期区间值 */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

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
  className?: string;
  "aria-label"?: string;
}
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date: Date, delta: number) =>
  new Date(date.getFullYear(), date.getMonth() + delta, 1);

const addDays = (date: Date, delta: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);

const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  Boolean(
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate(),
  );

const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const isDateBlocked = (
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
const buildMonthWeeks = (month: Date, weekStartsOn: 0 | 1): Date[][] => {
  const first = startOfMonth(month);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const cursor = addDays(first, -offset);
  return Array.from({ length: 6 }, (_week, week) =>
    Array.from({ length: 7 }, (_day, day) => addDays(cursor, week * 7 + day)),
  );
};

/** 生成本地化星期标题列表 */
const getWeekdayLabels = (locale: string, weekStartsOn: 0 | 1): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  // 2026-02-01 是周日，适合作为周序列锚点
  const sunday = new Date(2026, 1, 1);
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(addDays(sunday, (weekStartsOn + index) % 7)),
  );
};

const formatMonthTitle = (month: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }).format(month);

const formatDayLabel = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(date);

/** 区间选择状态转移：首点设起点，次点自动规范起止顺序，三点重新开始 */
const applyRangePick = (current: DateRange, clicked: Date): DateRange => {
  const day = startOfDay(clicked);
  if (!current.start || current.end) return { start: day, end: null };
  const startTime = startOfDay(current.start).getTime();
  return day.getTime() < startTime
    ? { start: day, end: startOfDay(current.start) }
    : { start: startOfDay(current.start), end: day };
};

const isBetweenRange = (date: Date, range: DateRange) => {
  if (!range.start || !range.end) return false;
  const time = startOfDay(date).getTime();
  return time > startOfDay(range.start).getTime() && time < startOfDay(range.end).getTime();
};
const DAY_BASE = cn(
  "relative m-0 box-border inline-flex size-9 cursor-pointer appearance-none items-center justify-center rounded-lg border-0 bg-transparent",
  "font-sans text-sm font-normal text-foreground tabular-nums select-none transition-colors duration-(--ui-duration-instant)",
  "hover:bg-accent outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card",
  "disabled:pointer-events-none disabled:opacity-35",
);

const SELECTED_CLASSES =
  "bg-signal font-medium text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-signal/92";

interface CalendarGridProps {
  month: Date;
  weekdays: string[];
  locale: string;
  weekStartsOn: 0 | 1;
  mode: "single" | "range";
  selectedDate: Date | null;
  selectedRange: DateRange;
  focusedDate: Date;
  today: Date;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  showOutsideDays: boolean;
  onSelect: (date: Date) => void;
  onFocusDate: (date: Date) => void;
  gridLabel: string;
}

const resolveKeyMove = (date: Date, key: string, weekStartsOn: 0 | 1): Date | null => {
  const moves: Record<string, () => Date> = {
    ArrowLeft: () => addDays(date, -1),
    ArrowRight: () => addDays(date, 1),
    ArrowUp: () => addDays(date, -7),
    ArrowDown: () => addDays(date, 7),
    PageUp: () => addMonths(date, -1),
    PageDown: () => addMonths(date, 1),
    Home: () => addDays(date, -((date.getDay() - weekStartsOn + 7) % 7)),
    End: () => addDays(date, 6 - ((date.getDay() - weekStartsOn + 7) % 7)),
  };
  return moves[key]?.() ?? null;
};

interface DayState {
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inRange: boolean;
}

const getDayState = (
  date: Date,
  mode: "single" | "range",
  selectedDate: Date | null,
  selectedRange: DateRange,
): DayState => {
  if (mode === "single") {
    return {
      selected: isSameDay(date, selectedDate),
      rangeStart: false,
      rangeEnd: false,
      inRange: false,
    };
  }
  const rangeStart = isSameDay(date, selectedRange.start);
  const rangeEnd = isSameDay(date, selectedRange.end);
  return {
    selected: rangeStart || rangeEnd,
    rangeStart,
    rangeEnd,
    inRange: isBetweenRange(date, selectedRange),
  };
};

const cellBandClass = (state: DayState, hasRangeSpan: boolean) =>
  cn(
    "p-0 text-center",
    state.inRange && "bg-signal/12 first:rounded-l-lg last:rounded-r-lg",
    hasRangeSpan && state.rangeStart && "rounded-l-lg bg-signal/12",
    hasRangeSpan && state.rangeEnd && "rounded-r-lg bg-signal/12",
  );

const dayButtonClass = (outside: boolean, state: DayState) =>
  cn(
    DAY_BASE,
    outside && !state.selected && "text-muted-foreground",
    state.inRange && "rounded-none hover:bg-signal/20",
    state.selected && SELECTED_CLASSES,
  );

interface DayCellProps {
  day: Date;
  outside: boolean;
  disabled: boolean;
  isToday: boolean;
  isFocused: boolean;
  state: DayState;
  hasRangeSpan: boolean;
  locale: string;
  showOutsideDays: boolean;
  onSelect: (date: Date) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, date: Date) => void;
}

const DayCell = (props: DayCellProps) => {
  const { day, outside, disabled, isToday, isFocused, state, hasRangeSpan, locale } = props;
  if (outside && !props.showOutsideDays) {
    return <td aria-hidden="true" className="size-9 p-0" />;
  }

  return (
    <td className={cellBandClass(state, hasRangeSpan)}>
      <button
        type="button"
        data-day={dateKey(day)}
        tabIndex={isFocused ? 0 : -1}
        disabled={disabled}
        aria-label={formatDayLabel(day, locale)}
        aria-pressed={state.selected}
        aria-current={isToday ? "date" : undefined}
        onClick={() => props.onSelect(day)}
        onKeyDown={(event) => props.onKeyDown(event, day)}
        className={dayButtonClass(outside, state)}
      >
        <span>{day.getDate()}</span>
        {isToday && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute bottom-1 size-1 rounded-full",
              state.selected ? "bg-signal-foreground" : "bg-signal",
            )}
          />
        )}
      </button>
    </td>
  );
};

const WeekdayHeader = ({ weekdays }: { weekdays: string[] }) => (
  <thead>
    <tr>
      {weekdays.map((dayName, idx) => (
        <th
          key={`${dayName}-${idx}`}
          scope="col"
          className="size-9 p-0 text-center text-xs font-medium text-muted-foreground"
        >
          {dayName}
        </th>
      ))}
    </tr>
  </thead>
);

const CalendarGrid = (props: CalendarGridProps) => {
  const weeks = buildMonthWeeks(props.month, props.weekStartsOn);
  const hasRangeSpan = Boolean(props.selectedRange.start && props.selectedRange.end);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    const next = resolveKeyMove(date, event.key, props.weekStartsOn);
    if (!next) return;
    event.preventDefault();
    props.onFocusDate(startOfDay(next));
  };

  return (
    <table aria-label={props.gridLabel} className="w-[252px] border-collapse">
      <WeekdayHeader weekdays={props.weekdays} />
      <tbody>
        {weeks.map((week, rowIndex) => (
          <tr key={rowIndex} className="h-9">
            {week.map((day) => {
              const outside = !isSameMonth(day, props.month);
              const disabled = isDateBlocked(
                day,
                props.minDate,
                props.maxDate,
                props.isDateDisabled,
              );
              return (
                <DayCell
                  key={dateKey(day)}
                  day={day}
                  outside={outside}
                  disabled={disabled}
                  isToday={isSameDay(day, props.today)}
                  isFocused={isSameDay(day, props.focusedDate) && !outside}
                  state={getDayState(day, props.mode, props.selectedDate, props.selectedRange)}
                  hasRangeSpan={hasRangeSpan}
                  locale={props.locale}
                  showOutsideDays={props.showOutsideDays}
                  onSelect={props.onSelect}
                  onKeyDown={handleKeyDown}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
const EMPTY_RANGE: DateRange = { start: null, end: null };

const NAV_BTN_CLASSES = cn(
  "inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground",
  "transition-[background-color,color,transform] duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground active:scale-95",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

const initialDate = (props: CalendarProps, today: Date) =>
  props.value ??
  props.defaultValue ??
  props.range?.start ??
  props.defaultRange?.start ??
  props.month ??
  props.defaultMonth ??
  today;

const useCalendarState = (props: CalendarProps) => {
  const [today] = useState(() => startOfDay(new Date()));
  const [innerValue, setInnerValue] = useState<Date | null>(props.defaultValue ?? null);
  const [innerRange, setInnerRange] = useState<DateRange>(props.defaultRange ?? EMPTY_RANGE);
  const [innerMonth, setInnerMonth] = useState<Date>(() =>
    startOfMonth(props.month ?? props.defaultMonth ?? initialDate(props, today)),
  );
  const [focusedDate, setFocusedDate] = useState<Date>(() => initialDate(props, today));
  const [focusRequest, setFocusRequest] = useState<{ key: string; seq: number } | null>(null);

  const selectedDate = props.value !== undefined ? props.value : innerValue;
  const selectedRange = props.range !== undefined ? props.range : innerRange;
  const viewMonth = props.month ? startOfMonth(props.month) : innerMonth;

  const setMonth = (next: Date) => {
    const normalized = startOfMonth(next);
    if (!props.month) setInnerMonth(normalized);
    props.onMonthChange?.(normalized);
  };

  const selectDate = (date: Date) => {
    const day = startOfDay(date);
    setFocusedDate(day);
    if (props.mode === "range") {
      const nextRange = applyRangePick(selectedRange, day);
      if (props.range === undefined) setInnerRange(nextRange);
      props.onRangeChange?.(nextRange);
      return;
    }
    if (props.value === undefined) setInnerValue(day);
    props.onValueChange?.(day);
  };

  const focusDate = (next: Date, visibleMonths: Date[]) => {
    setFocusedDate(next);
    setFocusRequest((prev) => ({ key: dateKey(next), seq: (prev?.seq ?? 0) + 1 }));
    if (!visibleMonths.some((m) => isSameMonth(m, next))) setMonth(next);
  };

  return {
    today,
    selectedDate,
    selectedRange,
    viewMonth,
    focusedDate,
    focusRequest,
    setMonth,
    selectDate,
    focusDate,
  };
};

const CalendarHeader = ({
  months,
  locale,
  onPrev,
  onNext,
}: {
  months: Date[];
  locale: string;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <div className="mb-2 flex h-8 items-center justify-between gap-2">
    <button type="button" aria-label="上个月" onClick={onPrev} className={NAV_BTN_CLASSES}>
      <ChevronLeft aria-hidden="true" className="size-4" />
    </button>
    <div className="flex flex-1 items-center justify-around gap-4 text-sm font-semibold tracking-tight text-foreground tabular-nums">
      {months.map((m) => (
        <span key={dateKey(m)}>{formatMonthTitle(m, locale)}</span>
      ))}
    </div>
    <button type="button" aria-label="下个月" onClick={onNext} className={NAV_BTN_CLASSES}>
      <ChevronRight aria-hidden="true" className="size-4" />
    </button>
  </div>
);

const CalendarMonths = ({
  months,
  weekdays,
  locale,
  weekStartsOn,
  props,
  state,
}: {
  months: Date[];
  weekdays: string[];
  locale: string;
  weekStartsOn: 0 | 1;
  props: CalendarProps;
  state: ReturnType<typeof useCalendarState>;
}) => (
  <div className="flex flex-col gap-4 sm:flex-row">
    {months.map((month) => (
      <CalendarGrid
        key={dateKey(month)}
        month={month}
        weekdays={weekdays}
        locale={locale}
        weekStartsOn={weekStartsOn}
        mode={props.mode ?? "single"}
        selectedDate={state.selectedDate}
        selectedRange={state.selectedRange}
        focusedDate={state.focusedDate}
        today={state.today}
        minDate={props.minDate}
        maxDate={props.maxDate}
        isDateDisabled={props.isDateDisabled}
        showOutsideDays={props.showOutsideDays ?? true}
        onSelect={state.selectDate}
        onFocusDate={(next) => state.focusDate(next, months)}
        gridLabel={formatMonthTitle(month, locale)}
      />
    ))}
  </div>
);

export const Calendar = (props: CalendarProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const state = useCalendarState(props);
  const locale = props.locale ?? "zh-CN";
  const weekStartsOn = props.weekStartsOn ?? 0;
  const months = Array.from({ length: props.numberOfMonths ?? 1 }, (_, i) =>
    addMonths(state.viewMonth, i),
  );
  const weekdays = getWeekdayLabels(locale, weekStartsOn);

  useEffect(() => {
    if (!state.focusRequest) return;
    rootRef.current
      ?.querySelector<HTMLButtonElement>(`button[data-day="${state.focusRequest.key}"]`)
      ?.focus();
  }, [state.focusRequest]);

  return (
    <div
      ref={rootRef}
      data-slot="calendar"
      aria-label={props["aria-label"]}
      className={cn(
        "w-fit rounded-2xl border border-solid border-border bg-card p-3 font-sans text-card-foreground shadow-sm select-none",
        props.className,
      )}
    >
      <CalendarHeader
        months={months}
        locale={locale}
        onPrev={() => state.setMonth(addMonths(state.viewMonth, -1))}
        onNext={() => state.setMonth(addMonths(state.viewMonth, 1))}
      />
      <CalendarMonths
        months={months}
        weekdays={weekdays}
        locale={locale}
        weekStartsOn={weekStartsOn}
        props={props}
        state={state}
      />
    </div>
  );
};
