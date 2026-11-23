"use client";

/**
 * Calendar：支持单日/区间选择、悬停区间预览、双月并排、日程打点、禁用约束与方向键导航的月历组件。
 * 交互与日期计算均由原生 grid ARIA 语义与 Intl.DateTimeFormat 实现，零额外外部日期库依赖。
 */
import { cn } from "@matt-ui/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  addMonths,
  applyRangePick,
  dateKey,
  formatMonthTitle,
  getWeekdayLabels,
  isDateBlocked,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from "./calendar-date.js";
import { CalendarGrid } from "./calendar-grid.js";
import type { CalendarProps, DateRange } from "./calendar.types.js";
import { calendarNavButtonVariants, calendarRootVariants } from "./calendar.variants.js";

const EMPTY_RANGE: DateRange = { start: null, end: null };

const initialDate = (props: CalendarProps, today: Date) =>
  props.value ??
  props.defaultValue ??
  props.range?.start ??
  props.defaultRange?.start ??
  props.month ??
  props.defaultMonth ??
  today;

const computePreviewRange = (
  mode: "single" | "range",
  selectedRange: DateRange,
  hoveredDate: Date | null,
): DateRange => {
  if (mode !== "range" || !selectedRange.start || selectedRange.end || !hoveredDate) {
    return EMPTY_RANGE;
  }
  const startTime = startOfDay(selectedRange.start).getTime();
  const hoverTime = startOfDay(hoveredDate).getTime();
  return hoverTime < startTime
    ? { start: startOfDay(hoveredDate), end: startOfDay(selectedRange.start) }
    : { start: startOfDay(selectedRange.start), end: startOfDay(hoveredDate) };
};

const useCalendarState = (props: CalendarProps) => {
  const [today] = useState(() => startOfDay(new Date()));
  const [innerValue, setInnerValue] = useState<Date | null>(props.defaultValue ?? null);
  const [innerRange, setInnerRange] = useState<DateRange>(props.defaultRange ?? EMPTY_RANGE);
  const [innerMonth, setInnerMonth] = useState<Date>(() =>
    startOfMonth(props.month ?? props.defaultMonth ?? initialDate(props, today)),
  );
  const [focusedDate, setFocusedDate] = useState<Date>(() => initialDate(props, today));
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
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
    setHoveredDate(null);
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
    hoveredDate,
    setHoveredDate,
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
    <button
      type="button"
      aria-label="上个月"
      onClick={onPrev}
      className={calendarNavButtonVariants()}
    >
      <ChevronLeft aria-hidden="true" className="size-4" />
    </button>
    <div className="flex flex-1 items-center justify-around gap-4 text-[13px] font-semibold tracking-tight text-foreground tabular-nums">
      {months.map((m) => (
        <span key={dateKey(m)}>{formatMonthTitle(m, locale)}</span>
      ))}
    </div>
    <button
      type="button"
      aria-label="下个月"
      onClick={onNext}
      className={calendarNavButtonVariants()}
    >
      <ChevronRight aria-hidden="true" className="size-4" />
    </button>
  </div>
);

const CalendarFooter = ({
  showTodayButton,
  onJumpToday,
  footer,
}: {
  showTodayButton: boolean;
  onJumpToday: () => void;
  footer?: CalendarProps["footer"];
}) => {
  if (!showTodayButton && !footer) return null;
  return (
    <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-solid border-border/65 pt-2.5 dark:border-white/8">
      {showTodayButton ? (
        <button
          type="button"
          onClick={onJumpToday}
          className="cursor-pointer rounded-md border border-solid border-transparent bg-transparent px-2 py-1 font-sans text-xs font-medium text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset"
        >
          回到今天
        </button>
      ) : (
        <span />
      )}
      {footer}
    </div>
  );
};

interface CalendarMonthsProps {
  months: Date[];
  weekdays: string[];
  locale: string;
  weekStartsOn: 0 | 1;
  highlightKeys: Set<string>;
  props: CalendarProps;
  state: ReturnType<typeof useCalendarState>;
}

const CalendarMonths = ({
  months,
  weekdays,
  locale,
  weekStartsOn,
  highlightKeys,
  props,
  state,
}: CalendarMonthsProps) => {
  const mode = props.mode ?? "single";
  const previewRange = computePreviewRange(mode, state.selectedRange, state.hoveredDate);
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {months.map((month) => (
        <CalendarGrid
          key={dateKey(month)}
          month={month}
          weekdays={weekdays}
          locale={locale}
          weekStartsOn={weekStartsOn}
          mode={mode}
          size={props.size ?? "md"}
          radius={props.radius ?? "md"}
          selectedDate={state.selectedDate}
          selectedRange={state.selectedRange}
          previewRange={previewRange}
          focusedDate={state.focusedDate}
          today={state.today}
          highlightKeys={highlightKeys}
          minDate={props.minDate}
          maxDate={props.maxDate}
          isDateDisabled={props.isDateDisabled}
          showOutsideDays={props.showOutsideDays ?? true}
          onSelect={state.selectDate}
          onHoverDate={mode === "range" ? state.setHoveredDate : undefined}
          onFocusDate={(next) => state.focusDate(next, months)}
          gridLabel={formatMonthTitle(month, locale)}
        />
      ))}
    </div>
  );
};

const jumpToToday = (props: CalendarProps, state: ReturnType<typeof useCalendarState>) => {
  state.setMonth(state.today);
  if (
    props.mode !== "range" &&
    !isDateBlocked(state.today, props.minDate, props.maxDate, props.isDateDisabled)
  ) {
    state.selectDate(state.today);
  }
};

const resolveCalendarConfig = (props: CalendarProps) => ({
  locale: props.locale ?? "zh-CN",
  weekStartsOn: props.weekStartsOn ?? (0 as const),
  variant: props.variant ?? ("default" as const),
  size: props.size ?? ("md" as const),
  monthCount: props.numberOfMonths ?? 1,
});

const useCalendarFocusSync = (
  rootRef: React.RefObject<HTMLDivElement | null>,
  focusRequest: { key: string; seq: number } | null,
) => {
  useEffect(() => {
    if (!focusRequest) return;
    rootRef.current
      ?.querySelector<HTMLButtonElement>(`button[data-day="${focusRequest.key}"]`)
      ?.focus();
  }, [rootRef, focusRequest]);
};

export const Calendar = (props: CalendarProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const state = useCalendarState(props);
  const cfg = resolveCalendarConfig(props);
  const months = Array.from({ length: cfg.monthCount }, (_, i) => addMonths(state.viewMonth, i));
  const weekdays = getWeekdayLabels(cfg.locale, cfg.weekStartsOn);
  const highlightKeys = useMemo(
    () => new Set((props.highlightDates ?? []).map(dateKey)),
    [props.highlightDates],
  );
  useCalendarFocusSync(rootRef, state.focusRequest);

  return (
    <div
      ref={rootRef}
      data-slot="calendar"
      data-variant={cfg.variant}
      data-size={cfg.size}
      aria-label={props["aria-label"]}
      className={cn(
        calendarRootVariants({ variant: cfg.variant, size: cfg.size }),
        props.className,
      )}
    >
      <CalendarHeader
        months={months}
        locale={cfg.locale}
        onPrev={() => state.setMonth(addMonths(state.viewMonth, -1))}
        onNext={() => state.setMonth(addMonths(state.viewMonth, 1))}
      />
      <CalendarMonths
        months={months}
        weekdays={weekdays}
        locale={cfg.locale}
        weekStartsOn={cfg.weekStartsOn}
        highlightKeys={highlightKeys}
        props={props}
        state={state}
      />
      <CalendarFooter
        showTodayButton={Boolean(props.showTodayButton)}
        onJumpToday={() => jumpToToday(props, state)}
        footer={props.footer}
      />
    </div>
  );
};
