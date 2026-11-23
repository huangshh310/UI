// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SegmentedControl：内凹轨道配物理抬升弹簧滑块的分段控制器，
 * 支持 default / glass / signal 质感、三档尺寸、图标与方向键漫游聚焦。
 */

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";

export const SEGMENTED_TRACK_BASE =
  "m-0 inline-flex flex-wrap items-center gap-0.5 rounded-full border border-solid p-1 select-none";

export const SEGMENTED_TRACK_VARIANTS: Record<SegmentedControlVariant, string> = {
  default:
    "border-border/80 bg-secondary/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/12 dark:bg-white/[0.06]",
  glass:
    "border-border/75 bg-card/70 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_3px_rgba(0,0,0,0.04)] dark:border-white/15 dark:bg-white/[0.08] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
  signal:
    "border-border/80 bg-secondary/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/12 dark:bg-white/[0.06]",
};

export const SEGMENTED_THUMB_VARIANTS: Record<SegmentedControlVariant, string> = {
  default:
    "pointer-events-none absolute inset-0 rounded-full bg-card shadow-[0_1px_3px_rgba(0,0,0,0.10),0_0.5px_1px_rgba(0,0,0,0.05)] ring-1 ring-border/75 dark:bg-card dark:ring-white/12",
  glass:
    "pointer-events-none absolute inset-0 rounded-full bg-background/95 shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] ring-1 ring-border/75 dark:bg-card/90 dark:ring-white/18 dark:shadow-[0_2px_10px_rgba(0,0,0,0.35)]",
  signal:
    "pointer-events-none absolute inset-0 rounded-full bg-signal shadow-[0_1px_3px_rgba(21,93,252,0.35),inset_0_1px_0_rgba(255,255,255,0.22)]",
};

export const SEGMENTED_BUTTON_BASE =
  "relative inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border-0 bg-transparent font-sans font-medium whitespace-nowrap transition-colors duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45";

export const SEGMENTED_BUTTON_SIZES: Record<SegmentedControlSize, string> = {
  sm: "h-7 px-2.5 text-xs",
  md: "h-8 px-3.5 text-xs",
  lg: "h-9.5 px-4 text-sm",
};

export const SEGMENTED_ACTIVE_TEXT: Record<SegmentedControlVariant, string> = {
  default: "text-foreground",
  glass: "text-foreground",
  signal: "text-signal-foreground",
};

export const SEGMENTED_BADGE_ACTIVE: Record<SegmentedControlVariant, string> = {
  default: "bg-primary text-primary-foreground",
  glass: "bg-primary text-primary-foreground",
  signal: "bg-black/25 text-signal-foreground",
};
export type SegmentedControlVariant = "default" | "glass" | "signal";

export type SegmentedControlSize = "sm" | "md" | "lg";

export interface SegmentedControlItem {
  value: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** 选项列表 */
  items: SegmentedControlItem[];
  /** 受控当前值 */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  /** 切换回调 */
  onValueChange?: (value: string) => void;
  /** 视觉风格：默认凹槽 / 磨砂玻璃 / 信号蓝高亮 */
  variant?: SegmentedControlVariant;
  /** 尺寸规格 */
  size?: SegmentedControlSize;
  /** 是否撑满容器宽度均分各分段 */
  fullWidth?: boolean;
  /** 控件无障碍名称 */
  ariaLabel?: string;
  /** 自定义类名 */
  className?: string;
}
const SPRING_TRANSITION = { type: "spring", stiffness: 460, damping: 34, mass: 0.65 } as const;

const SegmentLabel = ({
  item,
  active,
  variant,
}: {
  item: SegmentedControlItem;
  active: boolean;
  variant: SegmentedControlVariant;
}) => (
  <>
    {item.icon && (
      <span aria-hidden="true" className="relative z-10 inline-flex shrink-0 items-center">
        {item.icon}
      </span>
    )}
    <span className="relative z-10">{item.label}</span>
    {item.badge && (
      <span
        className={cn(
          "relative z-10 rounded-full px-1.5 py-0.5 font-mono text-[10px] leading-none tabular-nums",
          active ? SEGMENTED_BADGE_ACTIVE[variant] : "bg-primary text-primary-foreground",
        )}
      >
        {item.badge}
      </span>
    )}
  </>
);

interface SegmentButtonProps {
  item: SegmentedControlItem;
  active: boolean;
  variant: SegmentedControlVariant;
  size: SegmentedControlSize;
  fullWidth: boolean;
  trackId: string;
  reduced: boolean | null;
  registerButton: (el: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

const SegmentButton = ({
  item,
  active,
  variant,
  size,
  fullWidth,
  trackId,
  reduced,
  registerButton,
  onSelect,
  onKeyDown,
}: SegmentButtonProps) => (
  <button
    ref={registerButton}
    type="button"
    disabled={item.disabled}
    aria-pressed={active}
    data-slot="segmented-item"
    data-state={active ? "active" : "inactive"}
    onClick={onSelect}
    onKeyDown={onKeyDown}
    className={cn(
      SEGMENTED_BUTTON_BASE,
      SEGMENTED_BUTTON_SIZES[size],
      fullWidth && "flex-1",
      active ? SEGMENTED_ACTIVE_TEXT[variant] : "text-muted-foreground hover:text-foreground",
    )}
  >
    {active && (
      <motion.span
        layoutId={`seg-thumb-${trackId}`}
        transition={reduced ? { duration: 0 } : SPRING_TRANSITION}
        className={SEGMENTED_THUMB_VARIANTS[variant]}
      />
    )}
    <SegmentLabel item={item} active={active} variant={variant} />
  </button>
);

const findEnabledStep = (items: SegmentedControlItem[], start: number, step: 1 | -1): number => {
  const count = items.length;
  for (let offset = 1; offset <= count; offset += 1) {
    const candidate = (start + offset * step + count) % count;
    if (!items[candidate]?.disabled) return candidate;
  }
  return start;
};

const resolveNextIndex = (
  key: string,
  currentIndex: number,
  items: SegmentedControlItem[],
): number | null => {
  if (items.length === 0) return null;
  if (key === "ArrowRight") return findEnabledStep(items, currentIndex, 1);
  if (key === "ArrowLeft") return findEnabledStep(items, currentIndex, -1);
  if (key === "Home") return items.findIndex((i) => !i.disabled);
  if (key === "End") {
    for (let i = items.length - 1; i >= 0; i -= 1) {
      if (!items[i]?.disabled) return i;
    }
    return null;
  }
  return null;
};

const useSegmentedFocus = (
  items: SegmentedControlItem[],
  current: string,
  select: (next: string) => void,
) => {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const setButtonRef = (idx: number) => (el: HTMLButtonElement | null) => {
    buttonRefs.current[idx] = el;
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const idx = items.findIndex((i) => i.value === current);
    const nextIdx = resolveNextIndex(event.key, idx === -1 ? 0 : idx, items);
    if (nextIdx === null || nextIdx < 0) return;
    event.preventDefault();
    const nextItem = items[nextIdx];
    if (!nextItem || nextItem.disabled) return;
    select(nextItem.value);
    buttonRefs.current[nextIdx]?.focus();
  };
  return { setButtonRef, handleKeyDown };
};

const resolveInitialValue = (items: SegmentedControlItem[], defaultValue?: string) =>
  defaultValue ?? items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? "";

export const SegmentedControl = (props: SegmentedControlProps) => {
  const { items, value: controlledValue, onValueChange, className } = props;
  const variant = props.variant ?? "default";
  const size = props.size ?? "md";
  const fullWidth = props.fullWidth ?? false;
  const trackId = useId();
  const reduced = useReducedMotion();
  const [internalValue, setInternalValue] = useState(() =>
    resolveInitialValue(items, props.defaultValue),
  );
  const current = controlledValue ?? internalValue;
  const select = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next);
    onValueChange?.(next);
  };
  const { setButtonRef, handleKeyDown } = useSegmentedFocus(items, current, select);

  return (
    <fieldset
      aria-label={props.ariaLabel ?? "分段切换器"}
      data-slot="segmented-control"
      data-variant={variant}
      data-size={size}
      className={cn(
        SEGMENTED_TRACK_BASE,
        SEGMENTED_TRACK_VARIANTS[variant],
        fullWidth && "flex w-full",
        className,
      )}
    >
      {items.map((item, idx) => (
        <SegmentButton
          key={item.value}
          item={item}
          active={item.value === current}
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          trackId={trackId}
          reduced={reduced}
          registerButton={setButtonRef(idx)}
          onSelect={() => select(item.value)}
          onKeyDown={handleKeyDown}
        />
      ))}
    </fieldset>
  );
};
