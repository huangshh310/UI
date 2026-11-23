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
import type { DateRange } from "./calendar.types.js";

const DAY_BASE = cn(
  "relative m-0 box-border inline-flex size-9 cursor-pointer appearance-none items-center justify-center rounded-lg border-0 bg-transparent",
  "font-sans text-sm font-normal text-foreground tabular-nums select-none transition-colors duration-(--ui-duration-instant)",
  "hover:bg-accent outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card",
  "disabled:pointer-events-none disabled:opacity-35",
);

const SELECTED_CLASSES = "bg-primary font-medium text-primary-foreground hover:bg-primary/90";

export interface CalendarGridProps {
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
    state.inRange && "bg-secondary first:rounded-l-lg last:rounded-r-lg",
    hasRangeSpan && state.rangeStart && "rounded-l-lg bg-secondary",
    hasRangeSpan && state.rangeEnd && "rounded-r-lg bg-secondary",
  );

const dayButtonClass = (outside: boolean, state: DayState) =>
  cn(
    DAY_BASE,
    outside && !state.selected && "text-muted-foreground",
    state.inRange && "rounded-none hover:bg-accent",
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
              state.selected ? "bg-primary-foreground" : "bg-foreground",
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

export const CalendarGrid = (props: CalendarGridProps) => {
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
