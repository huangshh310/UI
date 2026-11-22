"use client";

/**
 * ReorderList：结合精确锁版本 @ui-sdk/core 重排状态机与 motion 弹簧布局过渡的可排序列表。
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
import type { ReorderListItem, ReorderListProps } from "./reorder-list.types.js";

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

const ROW_CLASS = cn(
  "flex cursor-grab items-center gap-3 rounded-xl border border-solid border-border bg-card px-3.5 py-2.5 shadow-sm outline-none select-none",
  "transition-[border-color,box-shadow] duration-(--ui-duration-fast) hover:border-foreground/22 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
  "data-[grabbed]:z-10 data-[grabbed]:cursor-grabbing data-[grabbed]:border-signal data-[grabbed]:shadow-md data-[grabbed]:ring-3 data-[grabbed]:ring-ring/25",
);

const ReorderItemCard = ({ item, helpId }: { item: ReorderListItem; helpId: string }) => (
  <SortableRow
    value={item.id}
    aria-describedby={helpId}
    render={
      <motion.li layout="position" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
    }
    className={ROW_CLASS}
  >
    <GripVertical aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
    <div className="min-w-0 flex-1">
      <p className="m-0 truncate font-sans text-sm font-medium text-foreground">{item.title}</p>
      {item.subtitle && (
        <p className="m-0 truncate text-xs text-muted-foreground">{item.subtitle}</p>
      )}
    </div>
    {item.badge && (
      <span className="shrink-0 rounded-md border border-solid border-border bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
        {item.badge}
      </span>
    )}
  </SortableRow>
);

export const ReorderList = ({
  items,
  value,
  onValueChange,
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
      <div data-slot="reorder-list" className={cn("w-full", className)}>
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
          className="m-0 flex list-none flex-col gap-2 p-0"
        >
          {({ order: visibleOrder }) =>
            visibleOrder.map((id) => {
              const item = itemMap.get(id);
              return item ? <ReorderItemCard key={id} item={item} helpId={helpId} /> : null;
            })
          }
        </SortableRoot>
      </div>
    </MotionConfig>
  );
};
