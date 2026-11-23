"use client";

/**
 * ReorderList：结合精确锁版本 @ui-sdk/core 重排状态机与 motion 弹簧布局过渡的可排序列表，
 * 支持 cards / divided 变体、compact / comfortable 密度、实时序号与键鼠双通道重排。
 */
import {
  createChange,
  createReorder,
  createRovingFocus,
  definePrimitive,
  type ChangeDetails,
  type ReorderDraft,
} from "@ui-sdk/core";
import { createParts } from "@ui-sdk/react/primitive";
import { cn } from "@matt-ui/utils";
import { GripVertical } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useId, useMemo, useState } from "react";
import type {
  ReorderListDensity,
  ReorderListItem,
  ReorderListProps,
  ReorderListVariant,
} from "./reorder-list.types.js";
import {
  REORDER_LIST_CONTAINER,
  REORDER_ROW_BASE,
  REORDER_ROW_DENSITY,
  REORDER_ROW_VARIANT,
} from "./reorder-list.variants.js";

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
