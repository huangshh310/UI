// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Calendar：支持单日/区间选择、悬停区间预览、双月并排、日程打点、禁用约束与方向键导航的月历组件。
 * 交互与日期计算均由原生 grid ARIA 语义与 Intl.DateTimeFormat 实现，零额外外部日期库依赖。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type KeyboardEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

export const calendarRootVariants = cva("w-fit font-sans text-card-foreground select-none", {
  variants: {
    variant: {
      default:
        "rounded-2xl border border-solid border-border/85 bg-card shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/10 dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]",
      elevated:
        "rounded-2xl border border-solid border-border/80 bg-card shadow-[0_10px_30px_-8px_rgba(0,0,0,0.1),0_2px_6px_-1px_rgba(0,0,0,0.04)] dark:border-white/12 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]",
      ghost: "border-0 bg-transparent shadow-none",
    },
    size: {
      sm: "p-3",
      md: "p-3.5",
      lg: "p-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export const calendarTableVariants = cva("border-collapse", {
  variants: {
    size: {
      sm: "w-[224px]",
      md: "w-[252px]",
      lg: "w-[280px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const calendarRowVariants = cva("", {
  variants: {
    size: {
      sm: "h-8",
      md: "h-9",
      lg: "h-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const calendarWeekdayVariants = cva(
  "p-0 text-center text-[11px] font-medium text-muted-foreground",
  {
    variants: {
      size: {
        sm: "size-8",
        md: "size-9",
        lg: "size-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const calendarDayVariants = cva(
  "relative m-0 box-border inline-flex cursor-pointer appearance-none items-center justify-center border border-solid border-transparent bg-transparent font-sans font-normal text-foreground tabular-nums select-none transition-colors duration-(--ui-duration-instant) hover:bg-accent outline-none focus-visible:z-10 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-35",
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        md: "size-9 text-[13px]",
        lg: "size-10 text-sm",
      },
      radius: {
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      radius: "md",
    },
  },
);

export const calendarNavButtonVariants = cva(
  "inline-flex size-7.5 cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent text-muted-foreground transition-[background-color,color,border-color,transform] duration-(--ui-duration-fast) hover:border-border/75 hover:bg-accent/70 hover:text-foreground active:scale-95 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:hover:border-white/12",
);
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
const SELECTED_CLASSES = "bg-primary font-medium text-primary-foreground hover:bg-primary/90";

interface CalendarGridProps {
  month: Date;
  weekdays: string[];
  locale: string;
  weekStartsOn: 0 | 1;
  mode: "single" | "range";
  size: CalendarSize;
  radius: CalendarRadius;
  selectedDate: Date | null;
  selectedRange: DateRange;
  previewRange: DateRange;
  focusedDate: Date;
  today: Date;
  highlightKeys: Set<string>;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  showOutsideDays: boolean;
  onSelect: (date: Date) => void;
  onHoverDate?: (date: Date | null) => void;
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
  activeRange: DateRange,
): DayState => {
  if (mode === "single") {
    return {
      selected: isSameDay(date, selectedDate),
      rangeStart: false,
      rangeEnd: false,
      inRange: false,
    };
  }
  const rangeStart = isSameDay(date, activeRange.start);
  const rangeEnd = isSameDay(date, activeRange.end);
  return {
    selected: rangeStart || rangeEnd,
    rangeStart,
    rangeEnd,
    inRange: isBetweenRange(date, activeRange),
  };
};

const BAND_START_RADIUS: Record<CalendarRadius, string> = {
  md: "rounded-l-lg",
  lg: "rounded-l-xl",
  full: "rounded-l-full",
};

const BAND_END_RADIUS: Record<CalendarRadius, string> = {
  md: "rounded-r-lg",
  lg: "rounded-r-xl",
  full: "rounded-r-full",
};

const cellBandClass = (state: DayState, hasRangeSpan: boolean, radius: CalendarRadius) =>
  cn(
    "p-0 text-center",
    state.inRange && "bg-secondary/85 first:rounded-l-lg last:rounded-r-lg dark:bg-white/8",
    hasRangeSpan &&
      state.rangeStart &&
      cn("bg-secondary/85 dark:bg-white/8", BAND_START_RADIUS[radius]),
    hasRangeSpan &&
      state.rangeEnd &&
      cn("bg-secondary/85 dark:bg-white/8", BAND_END_RADIUS[radius]),
  );

const dayButtonClass = (
  outside: boolean,
  state: DayState,
  size: CalendarSize,
  radius: CalendarRadius,
) =>
  cn(
    calendarDayVariants({ size, radius }),
    outside && !state.selected && "text-muted-foreground/65",
    state.inRange && "rounded-none hover:bg-accent",
    state.selected && SELECTED_CLASSES,
  );

interface DayCellProps {
  day: Date;
  outside: boolean;
  disabled: boolean;
  isToday: boolean;
  isHighlighted: boolean;
  isFocused: boolean;
  size: CalendarSize;
  radius: CalendarRadius;
  state: DayState;
  hasRangeSpan: boolean;
  locale: string;
  showOutsideDays: boolean;
  onSelect: (date: Date) => void;
  onHoverDate?: (date: Date | null) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, date: Date) => void;
}

const DayCell = (props: DayCellProps) => {
  const { day, outside, disabled, isToday, isHighlighted, isFocused, state } = props;
  if (outside && !props.showOutsideDays) {
    return <td aria-hidden="true" className="p-0" />;
  }

  return (
    <td className={cellBandClass(state, props.hasRangeSpan, props.radius)}>
      <button
        type="button"
        data-day={dateKey(day)}
        tabIndex={isFocused ? 0 : -1}
        disabled={disabled}
        aria-label={formatDayLabel(day, props.locale)}
        aria-pressed={state.selected}
        aria-current={isToday ? "date" : undefined}
        onClick={() => props.onSelect(day)}
        onMouseEnter={() => props.onHoverDate?.(day)}
        onMouseLeave={() => props.onHoverDate?.(null)}
        onKeyDown={(event) => props.onKeyDown(event, day)}
        className={dayButtonClass(outside, state, props.size, props.radius)}
      >
        <span>{day.getDate()}</span>
        {(isToday || isHighlighted) && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute bottom-1 size-1 rounded-full",
              state.selected ? "bg-primary-foreground" : isToday ? "bg-signal" : "bg-foreground/45",
            )}
          />
        )}
      </button>
    </td>
  );
};

const WeekdayHeader = ({ weekdays, size }: { weekdays: string[]; size: CalendarSize }) => (
  <thead>
    <tr>
      {weekdays.map((dayName, idx) => (
        <th key={`${dayName}-${idx}`} scope="col" className={calendarWeekdayVariants({ size })}>
          {dayName}
        </th>
      ))}
    </tr>
  </thead>
);

const CalendarWeekRow = ({
  week,
  props,
  activeRange,
  hasRangeSpan,
  onKeyDown,
}: {
  week: Date[];
  props: CalendarGridProps;
  activeRange: DateRange;
  hasRangeSpan: boolean;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, date: Date) => void;
}) => (
  <tr className={calendarRowVariants({ size: props.size })}>
    {week.map((day) => {
      const outside = !isSameMonth(day, props.month);
      const key = dateKey(day);
      return (
        <DayCell
          key={key}
          day={day}
          outside={outside}
          disabled={isDateBlocked(day, props.minDate, props.maxDate, props.isDateDisabled)}
          isToday={isSameDay(day, props.today)}
          isHighlighted={props.highlightKeys.has(key)}
          isFocused={isSameDay(day, props.focusedDate) && !outside}
          size={props.size}
          radius={props.radius}
          state={getDayState(day, props.mode, props.selectedDate, activeRange)}
          hasRangeSpan={hasRangeSpan}
          locale={props.locale}
          showOutsideDays={props.showOutsideDays}
          onSelect={props.onSelect}
          onHoverDate={props.onHoverDate}
          onKeyDown={onKeyDown}
        />
      );
    })}
  </tr>
);

const CalendarGrid = (props: CalendarGridProps) => {
  const weeks = buildMonthWeeks(props.month, props.weekStartsOn);
  const activeRange = props.previewRange.start ? props.previewRange : props.selectedRange;
  const hasRangeSpan = Boolean(
    activeRange.start && activeRange.end && !isSameDay(activeRange.start, activeRange.end),
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    const next = resolveKeyMove(date, event.key, props.weekStartsOn);
    if (!next) return;
    event.preventDefault();
    props.onFocusDate(startOfDay(next));
  };

  return (
    <table aria-label={props.gridLabel} className={calendarTableVariants({ size: props.size })}>
      <WeekdayHeader weekdays={props.weekdays} size={props.size} />
      <tbody>
        {weeks.map((week, rowIndex) => (
          <CalendarWeekRow
            key={rowIndex}
            week={week}
            props={props}
            activeRange={activeRange}
            hasRangeSpan={hasRangeSpan}
            onKeyDown={handleKeyDown}
          />
        ))}
      </tbody>
    </table>
  );
};
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
