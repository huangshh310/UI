"use client";

/**
 * DatePicker：结合 Base UI Popover 与 Calendar 的日期/区间选择器，支持左侧快捷预设与一键清空。
 * 弹层定位、Escape 关闭与焦点恢复由 Base UI 的 Popover 提供。
 */
import { Popover } from "@base-ui/react/popover";
import { cn } from "@matt-ui/utils";
import { Calendar as CalendarIcon, ChevronDown, X } from "lucide-react";
import { useId, useState } from "react";
import { Calendar, type DateRange } from "../calendar/index.js";
import type { DatePickerPreset, DatePickerProps } from "./date-picker.types.js";

const EMPTY_RANGE: DateRange = { start: null, end: null };

const TRIGGER_CLASSES = cn(
  "group inline-flex h-10 w-full cursor-pointer items-center justify-between gap-2.5 rounded-lg border border-solid border-border bg-background px-3 shadow-sm dark:bg-card",
  "font-sans text-sm text-foreground select-none transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast)",
  "hover:border-foreground/22 hover:bg-accent/40 data-popup-open:border-ring/80",
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
  "disabled:pointer-events-none disabled:opacity-50",
);

const POPUP_CLASSES = cn(
  "origin-(--transform-origin) overflow-hidden rounded-2xl border border-solid border-border bg-popover text-popover-foreground shadow-lg outline-none",
  "transition-[transform,opacity] duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  "data-starting-style:-translate-y-1 data-starting-style:scale-96 data-starting-style:opacity-0",
  "data-ending-style:-translate-y-1 data-ending-style:scale-96 data-ending-style:opacity-0",
);

const CLEAR_BTN_CLASSES =
  "absolute top-1/2 right-8 inline-flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

const formatShortDate = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" }).format(
    date,
  );

const formatDisplayText = (
  mode: "single" | "range",
  value: Date | null,
  range: DateRange,
  locale: string,
): string | null => {
  if (mode === "single") return value ? formatShortDate(value, locale) : null;
  if (!range.start) return null;
  const start = formatShortDate(range.start, locale);
  return range.end ? `${start} – ${formatShortDate(range.end, locale)}` : `${start} – …`;
};

const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  Boolean(
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate(),
  );

const isPresetActive = (
  preset: DatePickerPreset,
  mode: "single" | "range",
  value: Date | null,
  range: DateRange,
) => {
  if (mode === "range") {
    return isSameDay(preset.range?.start, range.start) && isSameDay(preset.range?.end, range.end);
  }
  return isSameDay(preset.value, value);
};

const PresetRail = ({
  presets,
  mode,
  value,
  range,
  onPick,
}: {
  presets: DatePickerPreset[];
  mode: "single" | "range";
  value: Date | null;
  range: DateRange;
  onPick: (preset: DatePickerPreset) => void;
}) => (
  <div className="flex flex-wrap gap-1 border-b border-solid border-border/80 p-2 sm:w-32 sm:flex-col sm:border-r sm:border-b-0">
    {presets.map((preset) => {
      const active = isPresetActive(preset, mode, value, range);
      return (
        <button
          key={preset.label}
          type="button"
          onClick={() => onPick(preset)}
          className={cn(
            "h-8 cursor-pointer rounded-lg border-0 px-2.5 text-left font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast) focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            active
              ? "bg-signal/12 text-foreground"
              : "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          {preset.label}
        </button>
      );
    })}
  </div>
);

const useDatePickerState = (props: DatePickerProps) => {
  const mode = props.mode ?? "single";
  const [open, setOpen] = useState(false);
  const [innerValue, setInnerValue] = useState<Date | null>(props.defaultValue ?? null);
  const [innerRange, setInnerRange] = useState<DateRange>(props.defaultRange ?? EMPTY_RANGE);

  const currentValue = props.value !== undefined ? props.value : innerValue;
  const currentRange = props.range !== undefined ? props.range : innerRange;

  const commitValue = (next: Date | null) => {
    if (props.value === undefined) setInnerValue(next);
    props.onValueChange?.(next);
    if (next) setOpen(false);
  };

  const commitRange = (next: DateRange) => {
    if (props.range === undefined) setInnerRange(next);
    props.onRangeChange?.(next);
    if (next.start && next.end) setOpen(false);
  };

  const pickPreset = (preset: DatePickerPreset) => {
    if (mode === "range" && preset.range) commitRange(preset.range);
    else if (preset.value) commitValue(preset.value);
  };

  const clear = () => {
    if (mode === "range") commitRange(EMPTY_RANGE);
    else commitValue(null);
  };

  return {
    mode,
    open,
    setOpen,
    currentValue,
    currentRange,
    commitValue,
    commitRange,
    pickPreset,
    clear,
  };
};

interface TriggerFieldProps {
  label?: string;
  labelId: string;
  valueId: string;
  ariaLabel?: string;
  display: string | null;
  placeholder: string;
  canClear: boolean;
  disabled: boolean;
  onClear: () => void;
}

const TriggerField = ({
  label,
  labelId,
  valueId,
  ariaLabel,
  display,
  placeholder,
  canClear,
  disabled,
  onClear,
}: TriggerFieldProps) => (
  <div className="relative">
    <Popover.Trigger
      disabled={disabled}
      aria-labelledby={label ? `${labelId} ${valueId}` : undefined}
      className={TRIGGER_CLASSES}
    >
      <span className={cn("inline-flex min-w-0 items-center gap-2", canClear && "pr-7")}>
        <CalendarIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        {!label && ariaLabel && <span className="sr-only">{ariaLabel} </span>}
        <span
          id={valueId}
          className={cn("truncate tabular-nums", !display && "text-muted-foreground")}
        >
          {display ?? placeholder}
        </span>
      </span>
      <ChevronDown
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--ui-duration-normal) group-data-popup-open:rotate-180"
      />
    </Popover.Trigger>
    {canClear && (
      <button type="button" aria-label="清除日期" onClick={onClear} className={CLEAR_BTN_CLASSES}>
        <X aria-hidden="true" className="size-3.5" />
      </button>
    )}
  </div>
);

interface PopoverBodyProps {
  props: DatePickerProps;
  state: ReturnType<typeof useDatePickerState>;
  locale: string;
  months: 1 | 2;
}

const PopoverBody = ({ props, state, locale, months }: PopoverBodyProps) => (
  <Popover.Portal>
    <Popover.Positioner sideOffset={6} align="start" className="z-(--ui-z-popover) outline-none">
      <Popover.Popup className={POPUP_CLASSES}>
        <div className="flex flex-col sm:flex-row">
          {(props.presets?.length ?? 0) > 0 && (
            <PresetRail
              presets={props.presets ?? []}
              mode={state.mode}
              value={state.currentValue}
              range={state.currentRange}
              onPick={state.pickPreset}
            />
          )}
          <Calendar
            mode={state.mode}
            value={state.currentValue}
            range={state.currentRange}
            onValueChange={state.commitValue}
            onRangeChange={state.commitRange}
            numberOfMonths={months}
            locale={locale}
            minDate={props.minDate}
            maxDate={props.maxDate}
            isDateDisabled={props.isDateDisabled}
            className="rounded-none border-0 bg-transparent shadow-none"
          />
        </div>
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
);

export const DatePicker = (props: DatePickerProps) => {
  const labelId = useId();
  const valueId = useId();
  const state = useDatePickerState(props);
  const locale = props.locale ?? "zh-CN";
  const display = formatDisplayText(state.mode, state.currentValue, state.currentRange, locale);
  const placeholder = props.placeholder ?? (state.mode === "range" ? "选择日期区间" : "选择日期");
  const months = props.numberOfMonths ?? (state.mode === "range" ? 2 : 1);
  const canClear = Boolean((props.clearable ?? true) && display && !props.disabled);

  return (
    <div
      data-slot="date-picker"
      className={cn("flex w-full max-w-xs flex-col gap-1.5 font-sans", props.className)}
    >
      {props.label && (
        <span id={labelId} className="text-[13px] font-medium tracking-tight text-foreground">
          {props.label}
        </span>
      )}
      <Popover.Root open={state.open} onOpenChange={state.setOpen}>
        <TriggerField
          label={props.label}
          labelId={labelId}
          valueId={valueId}
          ariaLabel={props["aria-label"]}
          display={display}
          placeholder={placeholder}
          canClear={canClear}
          disabled={Boolean(props.disabled)}
          onClear={state.clear}
        />
        <PopoverBody props={props} state={state} locale={locale} months={months} />
      </Popover.Root>
    </div>
  );
};
