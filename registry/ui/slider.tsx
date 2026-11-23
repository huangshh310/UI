// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Slider：基于 Base UI Slider 的精密滑块与区间双滑块，支持三档尺寸、多色调、浮动读数气泡与刻度标记。
 */

import { cn } from "@/lib/utils";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cva } from "class-variance-authority";
import { useState } from "react";

export const sliderTrackVariants = cva(
  "relative w-full rounded-full bg-secondary shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-border/60 dark:bg-white/12 dark:ring-white/10",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-1.5",
        lg: "h-2.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const sliderIndicatorVariants = cva(
  "h-full rounded-full transition-colors duration-(--ui-duration-fast)",
  {
    variants: {
      tone: {
        default: "bg-primary",
        signal: "bg-signal",
        emerald: "bg-emerald-500",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export const sliderThumbVariants = cva(
  "group/thumb relative cursor-pointer rounded-full border-2 border-solid bg-background shadow-[0_1px_3px_rgba(0,0,0,0.18),0_0.5px_1px_rgba(0,0,0,0.1)] outline-none transition-[transform,box-shadow,border-color] duration-(--ui-duration-fast) hover:scale-110 focus-visible:ring-4 data-dragging:scale-115 dark:bg-card",
  {
    variants: {
      size: {
        sm: "size-3.5",
        md: "size-4.5",
        lg: "size-5.5",
      },
      tone: {
        default: "border-primary focus-visible:ring-ring/25",
        signal: "border-signal focus-visible:ring-signal/25",
        emerald: "border-emerald-500 focus-visible:ring-emerald-500/25",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "default",
    },
  },
);

export const SLIDER_TOOLTIP_CLASS =
  "pointer-events-none absolute -top-7.5 left-1/2 -translate-x-1/2 translate-y-0.5 rounded-md bg-primary px-1.5 py-0.5 font-mono text-[10px] leading-tight font-medium whitespace-nowrap text-primary-foreground opacity-0 shadow-sm tabular-nums transition-[opacity,transform] duration-(--ui-duration-fast) group-hover/thumb:translate-y-0 group-hover/thumb:opacity-100 group-focus-visible/thumb:translate-y-0 group-focus-visible/thumb:opacity-100 group-data-dragging/thumb:translate-y-0 group-data-dragging/thumb:opacity-100";
export type SliderValue = number | [number, number];

export type SliderSize = "sm" | "md" | "lg";

export type SliderTone = "default" | "signal" | "emerald";

export interface SliderMark {
  value: number;
  label: string;
}

export interface SliderProps {
  /** 受控值：单数值或 [起, 止] 区间数组 */
  value?: SliderValue;
  /** 非受控初始值 */
  defaultValue?: SliderValue;
  /** 值变化回调 */
  onValueChange?: (value: SliderValue) => void;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步进 */
  step?: number;
  /** 轨道与滑块尺寸 */
  size?: SliderSize;
  /** 激活轨道色调 */
  tone?: SliderTone;
  /** 字段标签 */
  label?: string;
  /** 是否在右上角展示当前值 */
  showValue?: boolean;
  /** 是否在滑块上方悬停/拖拽时显示浮动数值气泡 */
  showTooltip?: boolean;
  /** 自定义数值格式化 */
  formatValue?: (val: number) => string;
  /** 底部刻度标记 */
  marks?: SliderMark[];
  /** 禁用态 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}
const formatSingle = (val: number, fmt?: (n: number) => string) => (fmt ? fmt(val) : String(val));

const formatReadout = (val: readonly number[], fmt?: (n: number) => string) =>
  val.length > 1
    ? `${formatSingle(val[0] ?? 0, fmt)} – ${formatSingle(val[1] ?? 0, fmt)}`
    : formatSingle(val[0] ?? 0, fmt);

const toTuple = (val: SliderValue): readonly number[] => (Array.isArray(val) ? val : [val]);

const normalizeValue = (next: number | readonly number[], min: number, max: number): SliderValue =>
  Array.isArray(next) ? [next[0] ?? min, next[1] ?? max] : (next as number);

const SliderHeader = ({
  label,
  showValue,
  formatValue,
}: {
  label?: string;
  showValue: boolean;
  formatValue?: (val: number) => string;
}) => {
  if (!label && !showValue) return null;
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      {label ? (
        <BaseSlider.Label className="font-medium text-foreground">{label}</BaseSlider.Label>
      ) : (
        <span />
      )}
      {showValue && (
        <BaseSlider.Value className="rounded-md bg-secondary/75 px-1.5 py-0.5 font-mono text-[11px] font-medium text-foreground tabular-nums dark:bg-white/[0.07]">
          {(_formatted, raw) => formatReadout(raw, formatValue)}
        </BaseSlider.Value>
      )}
    </div>
  );
};

const SliderMarksRow = ({ marks }: { marks?: SliderMark[] }) =>
  marks && marks.length > 0 ? (
    <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground tabular-nums">
      {marks.map((mark) => (
        <span key={mark.value}>{mark.label}</span>
      ))}
    </div>
  ) : null;

interface SliderTrackBarProps {
  isRange: boolean;
  size: SliderSize;
  tone: SliderTone;
  label?: string;
  showTooltip: boolean;
  values: readonly number[];
  formatValue?: (val: number) => string;
}

const SliderTrackBar = ({
  isRange,
  size,
  tone,
  label,
  showTooltip,
  values,
  formatValue,
}: SliderTrackBarProps) => {
  const thumbClass = sliderThumbVariants({ size, tone });
  return (
    <BaseSlider.Control className="flex w-full touch-none items-center py-2.5">
      <BaseSlider.Track data-slot="slider-track" className={sliderTrackVariants({ size })}>
        <BaseSlider.Indicator
          data-slot="slider-indicator"
          className={sliderIndicatorVariants({ tone })}
        />
        <BaseSlider.Thumb index={0} aria-label={label ?? "滑块"} className={thumbClass}>
          {showTooltip && (
            <span aria-hidden="true" className={SLIDER_TOOLTIP_CLASS}>
              {formatSingle(values[0] ?? 0, formatValue)}
            </span>
          )}
        </BaseSlider.Thumb>
        {isRange && (
          <BaseSlider.Thumb
            index={1}
            aria-label={label ? `${label}上限` : "区间上限"}
            className={thumbClass}
          >
            {showTooltip && (
              <span aria-hidden="true" className={SLIDER_TOOLTIP_CLASS}>
                {formatSingle(values[1] ?? 0, formatValue)}
              </span>
            )}
          </BaseSlider.Thumb>
        )}
      </BaseSlider.Track>
    </BaseSlider.Control>
  );
};

const resolveSliderConfig = (props: SliderProps) => ({
  defaultValue: props.defaultValue ?? 50,
  min: props.min ?? 0,
  max: props.max ?? 100,
  step: props.step ?? 1,
  size: props.size ?? "md",
  tone: props.tone ?? "default",
  showValue: props.showValue ?? false,
  showTooltip: props.showTooltip ?? false,
  disabled: props.disabled ?? false,
});

export const Slider = (props: SliderProps) => {
  const cfg = resolveSliderConfig(props);
  const [internal, setInternal] = useState<SliderValue>(cfg.defaultValue);
  const currentValue = props.value ?? internal;

  const handleChange = (next: number | readonly number[]) => {
    const normalized = normalizeValue(next, cfg.min, cfg.max);
    if (props.value === undefined) setInternal(normalized);
    props.onValueChange?.(normalized);
  };

  return (
    <BaseSlider.Root
      value={props.value}
      defaultValue={props.value === undefined ? cfg.defaultValue : undefined}
      onValueChange={handleChange}
      min={cfg.min}
      max={cfg.max}
      step={cfg.step}
      disabled={cfg.disabled}
      data-slot="slider"
      data-size={cfg.size}
      data-tone={cfg.tone}
      className={cn(
        "flex w-full flex-col gap-1.5 select-none data-disabled:opacity-50",
        props.className,
      )}
    >
      <SliderHeader label={props.label} showValue={cfg.showValue} formatValue={props.formatValue} />
      <SliderTrackBar
        isRange={Array.isArray(currentValue)}
        size={cfg.size}
        tone={cfg.tone}
        label={props.label}
        showTooltip={cfg.showTooltip}
        values={toTuple(currentValue)}
        formatValue={props.formatValue}
      />
      <SliderMarksRow marks={props.marks} />
    </BaseSlider.Root>
  );
};
