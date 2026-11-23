"use client";

/**
 * Calendar 单月网格渲染与键盘导航处理。
 */
import { cn } from "@matt-ui/utils";
import type { KeyboardEvent } from "react";
import {
  addDays,
  addMonths,
  buildMonthWeeks,
  dateKey,
  formatDayLabel,
  isBetweenRange,
  isDateBlocked,
  isSameDay,
  isSameMonth,
  startOfDay,
} from "./calendar-date.js";
import type { CalendarRadius, CalendarSize, DateRange } from "./calendar.types.js";
import {
  calendarDayVariants,
  calendarRowVariants,
  calendarTableVariants,
  calendarWeekdayVariants,
} from "./calendar.variants.js";

const SELECTED_CLASSES = "bg-primary font-medium text-primary-foreground hover:bg-primary/90";

export interface CalendarGridProps {
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

export const CalendarGrid = (props: CalendarGridProps) => {
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
