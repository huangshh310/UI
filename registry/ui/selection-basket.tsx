// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SelectionBasket：底部悬浮多选操作栏，使用 motion AnimatePresence 提供弹性进出场与计数跳动。
 */

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { type ReactNode } from "react";

export interface SelectionBasketAction {
  id: string;
  label: string;
  icon?: ReactNode;
  tone?: "default" | "signal" | "destructive";
  onClick: () => void;
}

export interface SelectionBasketProps {
  /** 已选条目数量；为 0 时收起 */
  count: number;
  /** 可选总数，传入时显示「全选」按钮 */
  totalCount?: number;
  /** 批量操作按钮列表 */
  actions: SelectionBasketAction[];
  /** 全选回调 */
  onSelectAll?: () => void;
  /** 清空选择回调 */
  onClear: () => void;
  /** 是否固定悬浮在视口底部（文档预览可设 false） */
  floating?: boolean;
  /** 自定义类名 */
  className?: string;
}
const TONE_CLASS: Record<NonNullable<SelectionBasketAction["tone"]>, string> = {
  default:
    "border-border bg-background text-foreground hover:border-foreground/22 hover:bg-accent dark:bg-card",
  signal: "border-signal bg-signal text-signal-foreground hover:opacity-92",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/18",
};

const BasketActionRow = ({
  actions,
  onClear,
}: {
  actions: SelectionBasketAction[];
  onClear: () => void;
}) => (
  <div className="flex flex-wrap items-center gap-1.5">
    {actions.map((action) => (
      <button
        key={action.id}
        type="button"
        onClick={action.onClick}
        className={cn(
          "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-solid px-2.5 font-sans text-xs font-medium shadow-sm transition-colors duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
          TONE_CLASS[action.tone ?? "default"],
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
      className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <X aria-hidden="true" className="size-3.5" />
    </button>
  </div>
);

const BasketCounter = ({
  count,
  totalCount,
  onSelectAll,
}: {
  count: number;
  totalCount?: number;
  onSelectAll?: () => void;
}) => (
  <div className="flex items-center gap-2 text-xs">
    <motion.span
      key={count}
      initial={{ scale: 0.75 }}
      animate={{ scale: 1 }}
      className="inline-flex size-6 items-center justify-center rounded-full bg-signal font-mono text-xs font-semibold text-signal-foreground tabular-nums"
    >
      {count}
    </motion.span>
    <span className="font-medium text-foreground">已选 {count} 项</span>
    {totalCount !== undefined && onSelectAll && count < totalCount && (
      <button
        type="button"
        onClick={onSelectAll}
        className="cursor-pointer border-0 bg-transparent text-xs text-signal underline underline-offset-2 hover:opacity-80"
      >
        全选 ({totalCount})
      </button>
    )}
  </div>
);

export const SelectionBasket = ({
  count,
  totalCount,
  actions,
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
        <motion.div
          role="toolbar"
          aria-label="批量操作栏"
          data-slot="selection-basket"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className={cn(
            "inline-flex flex-wrap items-center gap-3 rounded-2xl border border-solid border-border bg-popover/95 px-3.5 py-2 text-popover-foreground shadow-lg backdrop-blur-md",
            floating && "fixed bottom-6 left-1/2 z-40 -translate-x-1/2",
            className,
          )}
        >
          <BasketCounter count={count} totalCount={totalCount} onSelectAll={onSelectAll} />
          <span aria-hidden="true" className="h-5 w-px bg-border" />
          <BasketActionRow actions={actions} onClear={onClear} />
        </motion.div>
      )}
    </AnimatePresence>
  </MotionConfig>
);
