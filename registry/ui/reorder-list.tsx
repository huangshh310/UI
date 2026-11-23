// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * ReorderList：结合精确锁版本 @ui-sdk/core 重排状态机与 motion 弹簧布局过渡的可排序列表，
 * 支持 cards / divided 变体、compact / comfortable 密度、实时序号与键鼠双通道重排。
 */

import { cn } from "@/lib/utils";
import {
  createChange,
  createReorder,
  createRovingFocus,
  definePrimitive,
  type ChangeDetails,
  type ReorderDraft,
} from "@ui-sdk/core";
import { createParts } from "@ui-sdk/react/primitive";
import { GripVertical } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { type ReactNode, useId, useMemo, useState } from "react";

export const REORDER_LIST_CONTAINER: Record<ReorderListVariant, string> = {
  cards: "m-0 flex list-none flex-col gap-2 p-0",
  divided:
    "m-0 flex list-none flex-col divide-y divide-border/80 overflow-hidden rounded-2xl border border-solid border-border/80 bg-card p-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:divide-white/10 dark:border-white/12",
};

export const REORDER_ROW_BASE =
  "group flex cursor-grab items-center gap-3 outline-none select-none transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast)";

export const REORDER_ROW_VARIANT: Record<ReorderListVariant, string> = {
  cards:
    "rounded-xl border border-solid border-border/80 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-foreground/22 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 data-[grabbed]:z-10 data-[grabbed]:cursor-grabbing data-[grabbed]:border-signal data-[grabbed]:shadow-[0_10px_24px_-6px_rgba(0,0,0,0.16)] data-[grabbed]:ring-2 data-[grabbed]:ring-signal/25 dark:border-white/12 dark:hover:border-white/22 dark:data-[grabbed]:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.6)]",
  divided:
    "bg-card hover:bg-secondary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset data-[grabbed]:relative data-[grabbed]:z-10 data-[grabbed]:cursor-grabbing data-[grabbed]:bg-signal/10 data-[grabbed]:ring-1 data-[grabbed]:ring-signal/40 data-[grabbed]:ring-inset dark:hover:bg-white/[0.03] dark:data-[grabbed]:bg-signal/18",
};

export const REORDER_ROW_DENSITY: Record<ReorderListDensity, string> = {
  compact: "px-3 py-2",
  comfortable: "px-3.5 py-2.5",
};
export type ReorderListVariant = "cards" | "divided";

export type ReorderListDensity = "compact" | "comfortable";

export interface ReorderListItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
}

export interface ReorderListProps {
  /** 待排序条目（顺序按 value 决定，未传 value 时使用本数组顺序） */
  items: ReorderListItem[];
  /** 受控条目 id 顺序 */
  value?: string[];
  /** 顺序提交回调 */
  onValueChange?: (nextIds: string[]) => void;
  /** 容器外观：独立卡片组或发丝分隔列表 */
  variant?: ReorderListVariant;
  /** 条目间距密度 */
  density?: ReorderListDensity;
  /** 是否显示实时顺序编号（01 / 02 / ...） */
  showIndex?: boolean;
  /** 列表无障碍名称 */
  ariaLabel?: string;
  /** 自定义类名 */
  className?: string;
}
interface SortableOptions {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], details: ChangeDetails<string>) => void;
}

const sortablePrimitive = definePrimitive({
  name: "matt-reorder-list",
  options: { value: "list", defaultValue: "list", onValueChange: "callback" },
  controlled: ["value"],
  state: (options: SortableOptions) => ({
    value: options.value ?? options.defaultValue ?? [],
    moving: null as ReorderDraft | null,
    focused: null as string | null,
  }),
  sync: (options) => (options.value === undefined ? {} : { value: options.value }),
  api: (context) => {
    const change = createChange(context);
    const roving = createRovingFocus(context, {
      slot: "item",
      key: "focused",
      orientation: () => "vertical",
    });
    const reorder = createReorder(context, {
      slot: "item",
      key: "value",
      draft: "moving",
      set: (value, details) => change("value", value, details),
    });
    return { roving, reorder };
  },
  slots: (slot) => ({
    root: slot({
      state: (state, part) => ({ order: part.api.reorder.order(state) }),
      attrs: () => ({ role: "listbox", "aria-roledescription": "可重排列表" }),
    }),
    item: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => ({
        role: "option",
        "aria-roledescription": "可拖拽排序项",
        "aria-selected": String(state.moving?.key === part.key),
        tabindex: part.api.roving.tabIndex(state, part),
        "data-grabbed": state.moving?.key === part.key ? "" : undefined,
      }),
      on: {
        keydown: (event, { el, api, key }) =>
          api.reorder.keydown(event, key) || api.roving.keydown(event, el!),
        pointerdown: (event, { api, key }) => api.reorder.pointerdown(event, key),
      },
      bind: (el, part) => {
        const cleanups = [part.api.roving.bind(el, part), part.api.reorder.bind(el, part)];
        return () => cleanups.forEach((cleanup) => cleanup());
      },
    }),
  }),
});

const { Root: SortableRoot, Item: SortableRow } = createParts(sortablePrimitive, {
  root: "ul",
  item: "li",
});

interface ReorderItemCardProps {
  item: ReorderListItem;
  index: number;
  variant: ReorderListVariant;
  density: ReorderListDensity;
  showIndex: boolean;
  helpId: string;
}

const ReorderItemCard = ({
  item,
  index,
  variant,
  density,
  showIndex,
  helpId,
}: ReorderItemCardProps) => (
  <SortableRow
    value={item.id}
    aria-describedby={helpId}
    data-slot="reorder-item"
    render={
      <motion.li layout="position" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
    }
    className={cn(REORDER_ROW_BASE, REORDER_ROW_VARIANT[variant], REORDER_ROW_DENSITY[density])}
  >
    <span
      aria-hidden="true"
      className="inline-flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-(--ui-duration-fast) group-hover:text-foreground group-data-[grabbed]:text-signal"
    >
      <GripVertical className="size-4" />
    </span>
    {showIndex && (
      <span
        aria-hidden="true"
        className="w-5 shrink-0 font-mono text-[11px] font-medium text-muted-foreground tabular-nums"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    )}
    {item.icon && (
      <span aria-hidden="true" className="inline-flex shrink-0 items-center text-muted-foreground">
        {item.icon}
      </span>
    )}
    <div className="min-w-0 flex-1">
      <p className="m-0 truncate font-sans text-sm font-medium text-foreground">{item.title}</p>
      {item.subtitle && (
        <p className="m-0 truncate text-xs text-muted-foreground">{item.subtitle}</p>
      )}
    </div>
    {item.badge && (
      <span className="shrink-0 rounded-md border border-solid border-border/80 bg-secondary/70 px-2 py-0.5 font-mono text-[11px] text-muted-foreground dark:border-white/12 dark:bg-white/[0.06]">
        {item.badge}
      </span>
    )}
  </SortableRow>
);

const renderRows = (
  visibleOrder: string[],
  itemMap: Map<string, ReorderListItem>,
  opts: {
    variant: ReorderListVariant;
    density: ReorderListDensity;
    showIndex: boolean;
    helpId: string;
  },
) =>
  visibleOrder.map((id, idx) => {
    const item = itemMap.get(id);
    return item ? <ReorderItemCard key={id} item={item} index={idx} {...opts} /> : null;
  });

export const ReorderList = ({
  items,
  value,
  onValueChange,
  variant = "cards",
  density = "comfortable",
  showIndex = false,
  ariaLabel = "可重排列表",
  className,
}: ReorderListProps) => {
  const helpId = useId();
  const [innerOrder, setInnerOrder] = useState<string[]>(() => items.map((item) => item.id));
  const [announcement, setAnnouncement] = useState("");
  const itemMap = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const order = value ?? innerOrder;

  const handleOrderChange = (next: string[]) => {
    if (value === undefined) setInnerOrder(next);
    setAnnouncement(`列表顺序已更新，共 ${next.length} 项`);
    onValueChange?.(next);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-slot="reorder-list"
        data-variant={variant}
        data-density={density}
        className={cn("w-full", className)}
      >
        <p id={helpId} className="sr-only">
          按空格键拿起条目，方向键移动位置，再次按空格放下，按 Escape 取消。
        </p>
        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>
        <SortableRoot
          aria-label={ariaLabel}
          value={order}
          onValueChange={handleOrderChange}
          className={REORDER_LIST_CONTAINER[variant]}
        >
          {({ order: visibleOrder }) =>
            renderRows(visibleOrder, itemMap, { variant, density, showIndex, helpId })
          }
        </SortableRoot>
      </div>
    </MotionConfig>
  );
};
