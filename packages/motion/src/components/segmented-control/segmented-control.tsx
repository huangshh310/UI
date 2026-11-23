"use client";

/**
 * SegmentedControl：内凹轨道配物理抬升弹簧滑块的分段控制器，
 * 支持 default / glass / signal 质感、三档尺寸、图标与方向键漫游聚焦。
 */
import { cn } from "@matt-ui/utils";
import { motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type {
  SegmentedControlItem,
  SegmentedControlProps,
  SegmentedControlSize,
  SegmentedControlVariant,
} from "./segmented-control.types.js";
import {
  SEGMENTED_ACTIVE_TEXT,
  SEGMENTED_BADGE_ACTIVE,
  SEGMENTED_BUTTON_BASE,
  SEGMENTED_BUTTON_SIZES,
  SEGMENTED_THUMB_VARIANTS,
  SEGMENTED_TRACK_BASE,
  SEGMENTED_TRACK_VARIANTS,
} from "./segmented-control.variants.js";

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
