"use client";

/**
 * SegmentedControl：内凹轨道配物理抬升弹簧滑块的分段控制器（参考 interior.dev Segmented Control 与 bencho.dev），
 * 支持方向键与 Home/End 键盘漫游聚焦同步。
 */
import { cn } from "@matt-ui/utils";
import { motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { SegmentedControlItem, SegmentedControlProps } from "./segmented-control.types.js";

const SegmentButton = ({
  item,
  active,
  trackId,
  reduced,
  buttonRef,
  onSelect,
  onKeyDown,
}: {
  item: SegmentedControlItem;
  active: boolean;
  trackId: string;
  reduced: boolean | null;
  buttonRef: (el: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}) => (
  <button
    ref={buttonRef}
    type="button"
    aria-pressed={active}
    onClick={onSelect}
    onKeyDown={onKeyDown}
    className={cn(
      "relative inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-transparent px-3 font-sans text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
    )}
  >
    {active && (
      <motion.span
        layoutId={`seg-thumb-${trackId}`}
        transition={
          reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 36, mass: 0.6 }
        }
        className="pointer-events-none absolute inset-0 rounded-lg border border-solid border-border/80 bg-card shadow-sm"
      />
    )}
    <span className="relative z-10">{item.label}</span>
    {item.badge && (
      <span className="relative z-10 rounded-full bg-signal px-1.5 py-0.5 font-mono text-[10px] leading-none text-signal-foreground">
        {item.badge}
      </span>
    )}
  </button>
);

const resolveNextIndex = (key: string, currentIndex: number, length: number): number | null => {
  if (length === 0) return null;
  if (key === "ArrowRight") return (currentIndex + 1 + length) % length;
  if (key === "ArrowLeft") return (currentIndex - 1 + length) % length;
  if (key === "Home") return 0;
  if (key === "End") return length - 1;
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
    const nextIdx = resolveNextIndex(event.key, idx === -1 ? 0 : idx, items.length);
    if (nextIdx === null) return;
    event.preventDefault();
    const nextItem = items[nextIdx];
    if (!nextItem) return;
    select(nextItem.value);
    buttonRefs.current[nextIdx]?.focus();
  };
  return { setButtonRef, handleKeyDown };
};

export const SegmentedControl = ({
  items,
  value: controlledValue,
  defaultValue,
  onValueChange,
  ariaLabel = "分段切换器",
  className,
}: SegmentedControlProps) => {
  const trackId = useId();
  const reduced = useReducedMotion();
  const [internalValue, setInternalValue] = useState(defaultValue ?? items[0]?.value ?? "");
  const current = controlledValue ?? internalValue;
  const select = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next);
    onValueChange?.(next);
  };
  const { setButtonRef, handleKeyDown } = useSegmentedFocus(items, current, select);

  return (
    <fieldset
      aria-label={ariaLabel}
      data-slot="segmented-control"
      className={cn(
        "m-0 inline-flex flex-wrap items-center gap-1 rounded-xl border border-solid border-border/80 bg-secondary/75 p-1 shadow-inner",
        className,
      )}
    >
      {items.map((item, idx) => (
        <SegmentButton
          key={item.value}
          item={item}
          active={item.value === current}
          trackId={trackId}
          reduced={reduced}
          buttonRef={setButtonRef(idx)}
          onSelect={() => select(item.value)}
          onKeyDown={handleKeyDown}
        />
      ))}
    </fieldset>
  );
};
