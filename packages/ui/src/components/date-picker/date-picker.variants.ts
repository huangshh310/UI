/**
 * DatePicker 的样式定义：极简发丝触发器、毛玻璃浮层与单焦点环。
 */
import { cva } from "class-variance-authority";
import type { DateRange } from "../calendar/index.js";
import type { DatePickerPreset } from "./date-picker.types.js";

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
