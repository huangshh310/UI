/**
 * ReorderList 的样式映射表：零 CVA 依赖，提供 cards / divided 两种容器质感与 compact / comfortable 密度。
 */
import type { ReorderListDensity, ReorderListVariant } from "./reorder-list.types.js";

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
