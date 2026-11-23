"use client";

/**
 * SelectionBasket：底部/顶部悬浮多选操作浮舱，使用 motion AnimatePresence 提供弹性进出场与计数跳动。
 */
import { cn } from "@matt-ui/utils";
import { X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import type {
  SelectionBasketAction,
  SelectionBasketProps,
  SelectionBasketSize,
  SelectionBasketVariant,
} from "./selection-basket.types.js";
import {
  BASKET_ACTION_TONE,
  BASKET_DOCK_SIZE,
  BASKET_DOCK_VARIANT,
  BASKET_INVERTED_ACTION_TONE,
  BASKET_POSITION_CLASS,
} from "./selection-basket.variants.js";

const BasketActionRow = ({
  actions,
  variant,
  size,
  onClear,
}: {
  actions: SelectionBasketAction[];
  variant: SelectionBasketVariant;
  size: SelectionBasketSize;
  onClear: () => void;
}) => {
  const toneMap = variant === "inverted" ? BASKET_INVERTED_ACTION_TONE : BASKET_ACTION_TONE;
  const btnHeight = size === "sm" ? "h-7 px-2 text-[11px]" : "h-8 px-2.5 text-xs";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={action.disabled}
          onClick={action.onClick}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-solid font-sans font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-[background-color,border-color,opacity,transform] duration-(--ui-duration-fast) active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45",
            btnHeight,
            toneMap[action.tone ?? "default"],
          )}
        >
          {action.icon && <span aria-hidden="true">{action.icon}</span>}
          <span>{action.label}</span>
        </button>
      ))}
      <button
        type="button"
        aria-label="清空"
        onClick={onClear}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent outline-none transition-colors duration-(--ui-duration-fast) focus-visible:ring-2 focus-visible:ring-ring",
          size === "sm" ? "size-7" : "size-8",
          variant === "inverted"
            ? "text-background/75 hover:bg-white/12 hover:text-background dark:text-background/70 dark:hover:bg-black/10 dark:hover:text-background"
            : "text-muted-foreground hover:bg-accent/80 hover:text-foreground dark:hover:bg-white/10",
        )}
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  );
};

const BasketCounter = ({
  count,
  totalCount,
  variant,
  onSelectAll,
}: {
  count: number;
  totalCount?: number;
  variant: SelectionBasketVariant;
  onSelectAll?: () => void;
}) => (
  <div className="flex items-center gap-2 text-xs">
    <motion.span
      key={count}
      initial={{ scale: 0.72 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 460, damping: 24 }}
      className={cn(
        "inline-flex size-6 items-center justify-center rounded-full font-mono text-xs font-semibold tabular-nums",
        variant === "inverted"
          ? "bg-signal text-signal-foreground"
          : "bg-primary text-primary-foreground",
      )}
    >
      {count}
    </motion.span>
    <span className="font-medium">已选 {count} 项</span>
    {totalCount !== undefined && onSelectAll && count < totalCount && (
      <button
        type="button"
        onClick={onSelectAll}
        className="cursor-pointer rounded border-0 bg-transparent text-xs font-medium text-current underline decoration-current/40 underline-offset-3 outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
      >
        全选 ({totalCount})
      </button>
    )}
  </div>
);

const BasketDock = ({
  count,
  totalCount,
  actions,
  variant,
  size,
  position,
  onSelectAll,
  onClear,
  floating,
  className,
}: Required<Pick<SelectionBasketProps, "variant" | "size" | "position" | "floating">> &
  Pick<
    SelectionBasketProps,
    "count" | "totalCount" | "actions" | "onSelectAll" | "onClear" | "className"
  >) => {
  const offsetY = position === "top" ? -18 : 20;
  const dividerClass =
    variant === "inverted" ? "bg-white/20 dark:bg-black/15" : "bg-border/80 dark:bg-white/12";

  return (
    <motion.div
      role="toolbar"
      aria-label="批量操作栏"
      data-slot="selection-basket"
      data-variant={variant}
      initial={{ opacity: 0, y: offsetY, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: offsetY * 0.8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "inline-flex flex-wrap items-center border border-solid",
        BASKET_DOCK_VARIANT[variant],
        BASKET_DOCK_SIZE[size],
        floating && BASKET_POSITION_CLASS[position],
        className,
      )}
    >
      <BasketCounter
        count={count}
        totalCount={totalCount}
        variant={variant}
        onSelectAll={onSelectAll}
      />
      <span aria-hidden="true" className={cn("h-5 w-px", dividerClass)} />
      <BasketActionRow actions={actions} variant={variant} size={size} onClear={onClear} />
    </motion.div>
  );
};

export const SelectionBasket = ({
  count,
  totalCount,
  actions,
  variant = "default",
  size = "md",
  position = "bottom",
  onSelectAll,
  onClear,
  floating = true,
  className,
}: SelectionBasketProps) => (
  <MotionConfig reducedMotion="user">
    <div aria-live="polite" className="sr-only">
      {count > 0 ? `已选择 ${count} 项` : ""}
    </div>
    <AnimatePresence>
      {count > 0 && (
        <BasketDock
          count={count}
          totalCount={totalCount}
          actions={actions}
          variant={variant}
          size={size}
          position={position}
          onSelectAll={onSelectAll}
          onClear={onClear}
          floating={floating}
          className={className}
        />
      )}
    </AnimatePresence>
  </MotionConfig>
);
