"use client";

/**
 * AdvancedDataTable 表头、行渲染、骨架加载与分页底栏子部件。
 */
import { cn } from "@matt-ui/utils";
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  type Header,
  type Row,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import type { MouseEvent } from "react";
import { DrawCheckbox } from "../draw-checkbox/index.js";
import type { AdvancedTableColumn } from "./advanced-data-table.types.js";
import { ADV_FOCUS_RING } from "./advanced-data-table.variants.js";

export const ADV_TABLE_FEATURES = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
});

export type AdvTableFeatures = typeof ADV_TABLE_FEATURES;

const ALIGN_MAP = { left: "text-left", center: "text-center", right: "text-right" } as const;

const PAGE_BTN = cn(
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-solid border-input/55 bg-background text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors duration-(--ui-duration-fast) hover:border-foreground/25 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 dark:border-white/12 dark:bg-card",
  ADV_FOCUS_RING,
);

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element && Boolean(target.closest("button,a,input,label,[role='checkbox']"));

const AdvHeaderCell = <TData extends object>({
  col,
  sorted,
  onSort,
}: {
  col: AdvancedTableColumn<TData>;
  sorted: false | "asc" | "desc";
  onSort: () => void;
}) => {
  const align = col.align ?? "left";
  return (
    <th
      scope="col"
      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
      className={cn(
        "px-4 py-2.5 text-xs font-medium whitespace-nowrap text-muted-foreground",
        ALIGN_MAP[align],
      )}
    >
      {col.sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 rounded border border-solid border-transparent bg-transparent px-1 py-0.5 -mx-1 font-sans text-xs font-medium text-muted-foreground hover:text-foreground",
            ADV_FOCUS_RING,
            align === "right" && "ml-auto flex-row-reverse",
            sorted && "text-foreground",
          )}
        >
          <span>{col.header}</span>
          {sorted === "asc" ? (
            <ArrowUp aria-hidden="true" className="size-3.5 text-signal" />
          ) : sorted === "desc" ? (
            <ArrowDown aria-hidden="true" className="size-3.5 text-signal" />
          ) : (
            <ChevronsUpDown aria-hidden="true" className="size-3.5 opacity-50" />
          )}
        </button>
      ) : (
        col.header
      )}
    </th>
  );
};

export const AdvHead = <TData extends object>({
  headers,
  visibleCols,
  selectable,
  allSelected,
  someSelected,
  onToggleAll,
}: {
  headers: Header<AdvTableFeatures, TData, unknown>[];
  visibleCols: AdvancedTableColumn<TData>[];
  selectable: boolean;
  allSelected: boolean;
  someSelected: boolean;
  onToggleAll: (checked: boolean) => void;
}) => (
  <thead>
    <tr className="border-b border-solid border-border/75 bg-secondary/35 dark:border-white/10 dark:bg-white/[0.03]">
      {selectable && (
        <th scope="col" className="w-10 px-4 py-2.5 text-left">
          <DrawCheckbox
            tone="signal"
            aria-label="选择当前页全部行"
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={onToggleAll}
          />
        </th>
      )}
      {headers.map((header, idx) => (
        <AdvHeaderCell
          key={header.id}
          col={visibleCols[idx]!}
          sorted={header.column.getIsSorted()}
          onSort={() => header.column.toggleSorting(header.column.getIsSorted() === "asc")}
        />
      ))}
    </tr>
  </thead>
);

const AdvRowCells = <TData extends object>({
  row,
  visibleCols,
  padClass,
}: {
  row: Row<AdvTableFeatures, TData>;
  visibleCols: AdvancedTableColumn<TData>[];
  padClass: string;
}) => (
  <>
    {row.getAllCells().map((cell, idx) => {
      const align = visibleCols[idx]?.align ?? "left";
      return (
        <td
          key={cell.id}
          className={cn(
            "px-4 text-foreground",
            padClass,
            ALIGN_MAP[align],
            align === "right" && "tabular-nums",
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      );
    })}
  </>
);

const AdvRow = <TData extends object>({
  row,
  visibleCols,
  selectable,
  striped,
  padClass,
  onRowClick,
}: {
  row: Row<AdvTableFeatures, TData>;
  visibleCols: AdvancedTableColumn<TData>[];
  selectable: boolean;
  striped: boolean;
  padClass: string;
  onRowClick?: (row: TData) => void;
}) => {
  const handleClick = (event: MouseEvent<HTMLTableRowElement>) => {
    if (!onRowClick || isInteractiveTarget(event.target)) return;
    onRowClick(row.original);
  };

  return (
    <tr
      data-selected={row.getIsSelected() ? "" : undefined}
      onClick={onRowClick ? handleClick : undefined}
      className={cn(
        "border-t border-solid border-border/55 transition-colors duration-(--ui-duration-instant) hover:bg-accent/45 data-selected:bg-signal/6 dark:border-white/7",
        striped && "even:bg-secondary/25 dark:even:bg-white/[0.025]",
        onRowClick && "cursor-pointer",
      )}
    >
      {selectable && (
        <td className={cn("w-10 px-4", padClass)}>
          <DrawCheckbox
            tone="signal"
            aria-label={`选择第 ${row.index + 1} 行`}
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(checked)}
          />
        </td>
      )}
      <AdvRowCells row={row} visibleCols={visibleCols} padClass={padClass} />
    </tr>
  );
};

const AdvLoadingRows = ({ colSpan }: { colSpan: number }) => (
  <>
    {[0, 1, 2].map((idx) => (
      <tr key={idx} className="border-t border-solid border-border/55 dark:border-white/7">
        <td colSpan={colSpan} className="px-4 py-3.5">
          <div className="h-3.5 w-full animate-pulse rounded-md bg-secondary/80 motion-reduce:animate-none" />
          <span className="sr-only">加载中</span>
        </td>
      </tr>
    ))}
  </>
);

export const AdvRows = <TData extends object>({
  rows,
  visibleCols,
  selectable,
  striped,
  loading,
  padClass,
  emptyMessage,
  onRowClick,
}: {
  rows: Row<AdvTableFeatures, TData>[];
  visibleCols: AdvancedTableColumn<TData>[];
  selectable: boolean;
  striped: boolean;
  loading: boolean;
  padClass: string;
  emptyMessage: string;
  onRowClick?: (row: TData) => void;
}) => {
  const colSpan = visibleCols.length + (selectable ? 1 : 0);
  if (loading) return <AdvLoadingRows colSpan={colSpan} />;
  if (rows.length === 0) {
    return (
      <tr>
        <td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </td>
      </tr>
    );
  }
  return (
    <>
      {rows.map((row) => (
        <AdvRow
          key={row.id}
          row={row}
          visibleCols={visibleCols}
          selectable={selectable}
          striped={striped}
          padClass={padClass}
          onRowClick={onRowClick}
        />
      ))}
    </>
  );
};

export const AdvFooter = (props: {
  pageIndex: number;
  pageCount: number;
  totalCount: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <div className="flex items-center justify-between gap-3 border-t border-solid border-border/75 px-5 py-3 text-xs text-muted-foreground dark:border-white/10">
    <span className="tabular-nums">共 {props.totalCount} 条匹配记录</span>
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="上一页"
        disabled={!props.canPrev}
        onClick={props.onPrev}
        className={PAGE_BTN}
      >
        <ChevronLeft aria-hidden="true" className="size-3.5" />
      </button>
      <span className="px-2 font-mono tabular-nums">
        {props.pageIndex + 1} / {Math.max(1, props.pageCount)}
      </span>
      <button
        type="button"
        aria-label="下一页"
        disabled={!props.canNext}
        onClick={props.onNext}
        className={PAGE_BTN}
      >
        <ChevronRight aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  </div>
);
