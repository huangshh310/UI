"use client";

/**
 * AdvancedDataTable 表头、行渲染与分页底栏子部件。
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
import { DrawCheckbox } from "../draw-checkbox/index.js";
import type { AdvancedTableColumn } from "./advanced-data-table.types.js";

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

const PAGE_BTN =
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-solid border-border bg-background text-muted-foreground shadow-sm transition-colors duration-(--ui-duration-fast) hover:border-foreground/22 hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 dark:bg-card";

const AdvHeaderCell = <TData,>({
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
            "inline-flex cursor-pointer items-center gap-1 rounded border-0 bg-transparent p-0 font-sans text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
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
            <ChevronsUpDown aria-hidden="true" className="size-3.5 opacity-55" />
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
    <tr className="border-b border-solid border-border/80 bg-secondary/35">
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

const AdvRow = <TData extends object>({
  row,
  visibleCols,
  selectable,
  padClass,
}: {
  row: Row<AdvTableFeatures, TData>;
  visibleCols: AdvancedTableColumn<TData>[];
  selectable: boolean;
  padClass: string;
}) => (
  <tr
    data-selected={row.getIsSelected() ? "" : undefined}
    className="border-t border-solid border-border/60 transition-colors duration-(--ui-duration-instant) hover:bg-accent/45 data-selected:bg-signal/6"
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
    {row.getAllCells().map((cell, idx) => {
      const align = visibleCols[idx]?.align ?? "left";
      return (
        <td
          key={cell.id}
          className={cn(
            "px-4 text-sm text-foreground",
            padClass,
            ALIGN_MAP[align],
            align === "right" && "tabular-nums",
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      );
    })}
  </tr>
);

export const AdvRows = <TData extends object>({
  rows,
  visibleCols,
  selectable,
  padClass,
  emptyMessage,
}: {
  rows: Row<AdvTableFeatures, TData>[];
  visibleCols: AdvancedTableColumn<TData>[];
  selectable: boolean;
  padClass: string;
  emptyMessage: string;
}) => {
  if (rows.length === 0) {
    return (
      <tr>
        <td
          colSpan={visibleCols.length + (selectable ? 1 : 0)}
          className="px-5 py-10 text-center text-sm text-muted-foreground"
        >
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
          padClass={padClass}
        />
      ))}
    </>
  );
};

export const AdvFooter = ({
  pageIndex,
  pageCount,
  totalCount,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  pageIndex: number;
  pageCount: number;
  totalCount: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <div className="flex items-center justify-between gap-3 border-t border-solid border-border/80 px-5 py-3 text-xs text-muted-foreground">
    <span className="tabular-nums">共 {totalCount} 条匹配记录</span>
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="上一页"
        disabled={!canPrev}
        onClick={onPrev}
        className={PAGE_BTN}
      >
        <ChevronLeft aria-hidden="true" className="size-3.5" />
      </button>
      <span className="px-2 font-mono tabular-nums">
        {pageIndex + 1} / {Math.max(1, pageCount)}
      </span>
      <button
        type="button"
        aria-label="下一页"
        disabled={!canNext}
        onClick={onNext}
        className={PAGE_BTN}
      >
        <ChevronRight aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  </div>
);
