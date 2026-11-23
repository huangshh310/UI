// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { cn } from "@/lib/utils";
import { Slider as BaseSlider } from "@base-ui/react/slider";

export type SliderValue = number | [number, number];

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
  /** 字段标签 */
  label?: string;
  /** 是否在右上角展示当前值 */
  showValue?: boolean;
  /** 自定义数值格式化 */
  formatValue?: (val: number) => string;
  /** 底部刻度标记 */
  marks?: SliderMark[];
  /** 禁用态 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}
const THUMB_CLASS = cn(
  "size-4.5 cursor-pointer rounded-full border-2 border-solid border-primary bg-background shadow-sm outline-none",
  "transition-[transform,box-shadow] duration-(--ui-duration-fast) hover:scale-110 focus-visible:ring-4 focus-visible:ring-ring/25 data-dragging:scale-110 dark:bg-card",
);

const formatReadout = (val: readonly number[], fmt?: (n: number) => string) => {
  const f = fmt ?? ((n: number) => String(n));
  return val.length > 1 ? `${f(val[0] ?? 0)} – ${f(val[1] ?? 0)}` : f(val[0] ?? 0);
};

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
        <BaseSlider.Value className="font-mono text-muted-foreground tabular-nums">
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

const normalizeValue = (next: number | readonly number[], min: number, max: number): SliderValue =>
  Array.isArray(next) ? [next[0] ?? min, next[1] ?? max] : (next as number);

const SliderTrackBar = ({ isRange, label }: { isRange: boolean; label?: string }) => (
  <BaseSlider.Control className="flex w-full touch-none items-center py-2">
    <BaseSlider.Track className="relative h-1.5 w-full rounded-full bg-secondary">
      <BaseSlider.Indicator className="h-full rounded-full bg-primary" />
      <BaseSlider.Thumb index={0} aria-label={label ?? "滑块"} className={THUMB_CLASS} />
      {isRange && (
        <BaseSlider.Thumb
          index={1}
          aria-label={label ? `${label}上限` : "区间上限"}
          className={THUMB_CLASS}
        />
      )}
    </BaseSlider.Track>
  </BaseSlider.Control>
);

export const Slider = (props: SliderProps) => {
  const {
    defaultValue = 50,
    min = 0,
    max = 100,
    step = 1,
    showValue = false,
    disabled = false,
  } = props;
  const isRange = Array.isArray(props.value ?? defaultValue);

  return (
    <BaseSlider.Root
      value={props.value}
      defaultValue={props.value === undefined ? defaultValue : undefined}
      onValueChange={(next) => props.onValueChange?.(normalizeValue(next, min, max))}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      data-slot="slider"
      className={cn(
        "flex w-full flex-col gap-2 select-none data-disabled:opacity-50",
        props.className,
      )}
    >
      <SliderHeader label={props.label} showValue={showValue} formatValue={props.formatValue} />
      <SliderTrackBar isRange={isRange} label={props.label} />
      <SliderMarksRow marks={props.marks} />
    </BaseSlider.Root>
  );
};
