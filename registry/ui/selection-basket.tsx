// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SelectionBasket：底部/顶部悬浮多选操作浮舱，使用 motion AnimatePresence 提供弹性进出场与计数跳动。
 */

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { type ReactNode } from "react";

export const BASKET_DOCK_VARIANT: Record<SelectionBasketVariant, string> = {
  default:
    "border-border bg-popover/96 text-popover-foreground backdrop-blur-xl shadow-[0_18px_48px_-12px_rgba(0,0,0,0.14),0_3px_10px_-2px_rgba(0,0,0,0.05)] dark:bg-popover/95 dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.72)]",
  inverted:
    "border-foreground bg-foreground text-background shadow-[0_20px_54px_-12px_rgba(0,0,0,0.3)] dark:border-white/15 dark:bg-foreground dark:text-background dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.72)]",
  glass:
    "border-border bg-popover/92 text-popover-foreground backdrop-blur-2xl shadow-[0_18px_48px_-12px_rgba(0,0,0,0.12)] dark:bg-popover/90 dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.68)]",
};

export const BASKET_DOCK_SIZE: Record<SelectionBasketSize, string> = {
  sm: "gap-3 rounded-xl px-3 py-1.5",
  md: "gap-3.5 rounded-2xl px-3.5 py-2",
};

export const BASKET_POSITION_CLASS: Record<SelectionBasketPosition, string> = {
  bottom: "fixed bottom-6 left-1/2 z-40 -translate-x-1/2",
  top: "fixed top-6 left-1/2 z-40 -translate-x-1/2",
};

type ActionTone = NonNullable<SelectionBasketAction["tone"]>;

export const BASKET_ACTION_TONE: Record<ActionTone, string> = {
  default:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
  signal: "border-transparent bg-signal text-signal-foreground hover:bg-signal/92",
  destructive:
    "border-transparent bg-destructive/12 text-destructive hover:bg-destructive/18 dark:bg-destructive/18 dark:text-red-300",
};

export const BASKET_INVERTED_ACTION_TONE: Record<ActionTone, string> = {
  default:
    "border-transparent bg-white/12 text-background hover:bg-white/20 dark:bg-black/8 dark:text-background dark:hover:bg-black/14",
  signal: "border-transparent bg-signal text-signal-foreground hover:bg-signal/92",
  destructive:
    "border-transparent bg-red-500/22 text-red-200 hover:bg-red-500/32 dark:bg-red-600/14 dark:text-red-900 dark:hover:bg-red-600/20",
};
export type SelectionBasketVariant = "default" | "inverted" | "glass";
export type SelectionBasketSize = "sm" | "md";
export type SelectionBasketPosition = "bottom" | "top";

export interface SelectionBasketAction {
  id: string;
  label: string;
  icon?: ReactNode;
  tone?: "default" | "signal" | "destructive";
  disabled?: boolean;
  onClick: () => void;
}

export interface SelectionBasketProps {
  /** 已选条目数量；为 0 时收起 */
  count: number;
  /** 可选总数，传入时显示「全选」按钮 */
  totalCount?: number;
  /** 批量操作按钮列表 */
  actions: SelectionBasketAction[];
  /** 视觉风格：default 磨砂浅浮舱 / inverted 高对比反色浮舱 / glass 轻透胶囊 */
  variant?: SelectionBasketVariant;
  /** 尺寸密度 */
  size?: SelectionBasketSize;
  /** 悬浮吸附位置（仅 floating=true 时生效） */
  position?: SelectionBasketPosition;
  /** 全选回调 */
  onSelectAll?: () => void;
  /** 清空选择回调 */
  onClear: () => void;
  /** 是否固定悬浮在视口边缘（文档预览可设 false） */
  floating?: boolean;
  /** 自定义类名 */
  className?: string;
}
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
    <AnimatePresence mode="popLayout" initial={false}>
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
    </AnimatePresence>
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
    <AnimatePresence initial={false}>
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
