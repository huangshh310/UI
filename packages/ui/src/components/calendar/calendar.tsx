"use client";

/**
 * Calendar：支持单日/区间选择、双月并排、禁用约束与完整方向键导航的月历组件。
 * 交互与日期计算均由原生 grid ARIA 语义与 Intl.DateTimeFormat 实现，零额外外部日期库依赖。
 */
import { cn } from "@matt-ui/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  addMonths,
  applyRangePick,
  dateKey,
  formatMonthTitle,
  getWeekdayLabels,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from "./calendar-date.js";
import { CalendarGrid } from "./calendar-grid.js";
import type { CalendarProps, DateRange } from "./calendar.types.js";

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
        "w-fit rounded-[22px] border border-solid border-border bg-card p-4 font-sans text-card-foreground shadow-xs select-none",
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
