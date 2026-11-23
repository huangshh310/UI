// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * DatePicker：结合 Base UI Popover 与 Calendar 的日期/区间选择器，支持左侧快捷预设、毛玻璃浮层、校验反馈与一键清空。
 * 弹层定位、Escape 关闭与焦点恢复由 Base UI 的 Popover 提供。
 */

import { Calendar, type CalendarRadius, type DateRange } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Popover } from "@base-ui/react/popover";
import { cva } from "class-variance-authority";
import { Calendar as CalendarIcon, ChevronDown, X } from "lucide-react";
import { useId, useState } from "react";

export const datePickerTriggerVariants = cva(
  "group inline-flex w-full cursor-pointer items-center justify-between gap-2.5 border border-solid font-sans text-foreground select-none transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast) data-popup-open:border-ring outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input/50 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/25 hover:bg-card dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22 dark:hover:bg-card",
        filled:
          "border-transparent bg-secondary/75 hover:bg-secondary data-popup-open:bg-card dark:bg-white/7 dark:hover:bg-white/11",
        elevated:
          "border-border/85 bg-card shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/20 dark:border-white/12 dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.5)]",
      },
      size: {
        sm: "h-8.5 px-2.5 text-xs",
        md: "h-9.5 px-3 text-sm",
        lg: "h-11 px-3.5 text-sm",
      },
      radius: {
        md: "rounded-lg",
        lg: "rounded-xl",
        pill: "rounded-full",
      },
      invalid: {
        true: "border-destructive hover:border-destructive data-popup-open:border-destructive focus-visible:border-destructive focus-visible:ring-destructive dark:border-destructive dark:hover:border-destructive",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      radius: "md",
      invalid: false,
    },
  },
);

export const datePickerPopupVariants = cva(
  "origin-(--transform-origin) overflow-hidden border border-solid border-border/80 bg-popover/96 text-popover-foreground backdrop-blur-xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.04)] outline-none transition-[transform,opacity] duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)] data-starting-style:-translate-y-1 data-starting-style:scale-[0.97] data-starting-style:opacity-0 data-ending-style:-translate-y-0.5 data-ending-style:scale-[0.98] data-ending-style:opacity-0 dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]",
  {
    variants: {
      radius: {
        md: "rounded-xl",
        lg: "rounded-2xl",
        pill: "rounded-2xl",
      },
    },
    defaultVariants: {
      radius: "md",
    },
  },
);

const formatShortDate = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" }).format(
    date,
  );

export const formatDisplayText = (
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

export const isPresetActive = (
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
/** 快捷日期预设 */
export interface DatePickerPreset {
  label: string;
  value?: Date;
  range?: DateRange;
}

export type DatePickerVariant = "default" | "filled" | "elevated";
export type DatePickerSize = "sm" | "md" | "lg";
export type DatePickerRadius = "md" | "lg" | "pill";

export interface DatePickerProps {
  /** 选择模式：单日或区间 */
  mode?: "single" | "range";
  /** 受控单日值 */
  value?: Date | null;
  /** 非受控初始单日值 */
  defaultValue?: Date | null;
  /** 单日变更回调 */
  onValueChange?: (date: Date | null) => void;
  /** 受控区间值 */
  range?: DateRange;
  /** 非受控初始区间值 */
  defaultRange?: DateRange;
  /** 区间变更回调 */
  onRangeChange?: (range: DateRange) => void;
  /** 左侧快捷日期预设 */
  presets?: DatePickerPreset[];
  /** 日历面板月数（区间模式默认 2，单日模式默认 1） */
  numberOfMonths?: 1 | 2;
  /** 字段标签 */
  label?: string;
  /** 辅助提示说明 */
  hint?: string;
  /** 校验错误提示（非空时自动切换无效态与 aria-invalid） */
  error?: string;
  /** 占位文案 */
  placeholder?: string;
  /** 本地化语言标签 */
  locale?: string;
  /** 每周起始日：0 为周日，1 为周一 */
  weekStartsOn?: 0 | 1;
  /** 触发器视觉风格 */
  variant?: DatePickerVariant;
  /** 触发器高度与字号 */
  size?: DatePickerSize;
  /** 触发器圆角风格 */
  radius?: DatePickerRadius;
  /** 弹层水平对齐方式 */
  align?: "start" | "center" | "end";
  /** 弹层日历内是否展示“回到今天”快捷按钮 */
  showTodayButton?: boolean;
  /** 弹层日历单元格圆角风格 */
  calendarRadius?: CalendarRadius;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  /** 有值时是否显示一键清空按钮 */
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}
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
