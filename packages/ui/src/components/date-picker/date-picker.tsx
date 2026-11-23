"use client";

/**
 * DatePicker：结合 Base UI Popover 与 Calendar 的日期/区间选择器，支持左侧快捷预设、毛玻璃浮层、校验反馈与一键清空。
 * 弹层定位、Escape 关闭与焦点恢复由 Base UI 的 Popover 提供。
 */
import { Popover } from "@base-ui/react/popover";
import { cn } from "@matt-ui/utils";
import { Calendar as CalendarIcon, ChevronDown, X } from "lucide-react";
import { useId, useState } from "react";
import { Calendar, type DateRange } from "../calendar/index.js";
import type {
  DatePickerPreset,
  DatePickerProps,
  DatePickerRadius,
  DatePickerSize,
  DatePickerVariant,
} from "./date-picker.types.js";
import {
  datePickerPopupVariants,
  datePickerTriggerVariants,
  formatDisplayText,
  isPresetActive,
} from "./date-picker.variants.js";

const EMPTY_RANGE: DateRange = { start: null, end: null };

const CLEAR_BTN_CLASSES =
  "absolute top-1/2 right-8 inline-flex size-5.5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-solid border-transparent bg-transparent text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

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
  <div className="flex flex-wrap gap-1 border-b border-solid border-border/75 p-2 sm:w-32 sm:flex-col sm:border-r sm:border-b-0 dark:border-white/10">
    {presets.map((preset) => {
      const active = isPresetActive(preset, mode, value, range);
      return (
        <button
          key={preset.label}
          type="button"
          onClick={() => onPick(preset)}
          className={cn(
            "h-8 cursor-pointer rounded-lg border border-solid border-transparent px-2.5 text-left font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast) outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
            active
              ? "bg-signal/12 text-foreground dark:bg-signal/20"
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
  messageId?: string;
  ariaLabel?: string;
  display: string | null;
  placeholder: string;
  canClear: boolean;
  disabled: boolean;
  invalid: boolean;
  variant: DatePickerVariant;
  size: DatePickerSize;
  radius: DatePickerRadius;
  onClear: () => void;
}

const TriggerField = ({
  label,
  labelId,
  valueId,
  messageId,
  ariaLabel,
  display,
  placeholder,
  canClear,
  disabled,
  invalid,
  variant,
  size,
  radius,
  onClear,
}: TriggerFieldProps) => (
  <div className="relative">
    <Popover.Trigger
      disabled={disabled}
      aria-labelledby={label ? `${labelId} ${valueId}` : undefined}
      aria-describedby={messageId}
      aria-invalid={invalid || undefined}
      className={datePickerTriggerVariants({ variant, size, radius, invalid })}
    >
      <span className={cn("inline-flex min-w-0 items-center gap-2", canClear && "pr-7")}>
        <CalendarIcon aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
        {!label && ariaLabel && <span className="sr-only">{ariaLabel} </span>}
        <span
          id={valueId}
          className={cn("truncate tabular-nums", !display && "text-muted-foreground/75")}
        >
          {display ?? placeholder}
        </span>
      </span>
      <ChevronDown
        aria-hidden="true"
        className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-(--ui-duration-normal) group-data-popup-open:rotate-180"
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
  radius: DatePickerRadius;
}

const PopoverBody = ({ props, state, locale, months, radius }: PopoverBodyProps) => (
  <Popover.Portal>
    <Popover.Positioner
      sideOffset={6}
      align={props.align ?? "start"}
      className="z-(--ui-z-popover) outline-none"
    >
      <Popover.Popup className={datePickerPopupVariants({ radius })}>
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
            variant="ghost"
            size="sm"
            radius={props.calendarRadius ?? "md"}
            mode={state.mode}
            value={state.currentValue}
            range={state.currentRange}
            onValueChange={state.commitValue}
            onRangeChange={state.commitRange}
            numberOfMonths={months}
            locale={locale}
            weekStartsOn={props.weekStartsOn}
            showTodayButton={props.showTodayButton}
            minDate={props.minDate}
            maxDate={props.maxDate}
            isDateDisabled={props.isDateDisabled}
          />
        </div>
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
);

const DatePickerMessage = ({ id, error, hint }: { id: string; error?: string; hint?: string }) => {
  if (error) {
    return (
      <p id={id} className="m-0 text-xs font-medium text-destructive">
        {error}
      </p>
    );
  }
  return hint ? (
    <p id={id} className="m-0 text-xs text-muted-foreground">
      {hint}
    </p>
  ) : null;
};

interface PickerOptions {
  locale: string;
  variant: DatePickerVariant;
  size: DatePickerSize;
  radius: DatePickerRadius;
  placeholder: string;
  months: 1 | 2;
}

const resolvePickerOptions = (props: DatePickerProps, mode: "single" | "range"): PickerOptions => ({
  locale: props.locale ?? "zh-CN",
  variant: props.variant ?? "default",
  size: props.size ?? "md",
  radius: props.radius ?? "md",
  placeholder: props.placeholder ?? (mode === "range" ? "选择日期区间" : "选择日期"),
  months: props.numberOfMonths ?? (mode === "range" ? 2 : 1),
});

export const DatePicker = (props: DatePickerProps) => {
  const labelId = useId();
  const valueId = useId();
  const messageId = useId();
  const state = useDatePickerState(props);
  const opts = resolvePickerOptions(props, state.mode);
  const display = formatDisplayText(
    state.mode,
    state.currentValue,
    state.currentRange,
    opts.locale,
  );
  const canClear = Boolean((props.clearable ?? true) && display && !props.disabled);

  return (
    <div
      data-slot="date-picker"
      data-variant={opts.variant}
      data-size={opts.size}
      className={cn("flex w-full max-w-xs flex-col gap-1.5 font-sans", props.className)}
    >
      {props.label && (
        <span id={labelId} className="text-[13px] font-medium tracking-tight text-foreground">
          {props.label}
        </span>
      )}
      <Popover.Root open={state.open} onOpenChange={state.setOpen}>
        <TriggerField
          {...opts}
          label={props.label}
          labelId={labelId}
          valueId={valueId}
          messageId={props.error || props.hint ? messageId : undefined}
          ariaLabel={props["aria-label"]}
          display={display}
          canClear={canClear}
          disabled={Boolean(props.disabled)}
          invalid={Boolean(props.error)}
          onClear={state.clear}
        />
        <PopoverBody props={props} state={state} {...opts} />
      </Popover.Root>
      <DatePickerMessage id={messageId} error={props.error} hint={props.hint} />
    </div>
  );
};
