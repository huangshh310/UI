"use client";

/**
 * AdvancedDataTable 表头与行渲染子部件。
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
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { MouseEvent } from "react";
import { DrawCheckbox } from "../draw-checkbox/index.js";
import type { AdvancedTableColumn } from "./advanced-data-table.types.js";
import { ADV_FOCUS_RING } from "./advanced-data-table.variants.js";
import { AdvEmptyRow, AdvLoadingRows } from "./advanced-table-states.js";

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
        "h-10 px-4 text-xs font-medium whitespace-nowrap text-muted-foreground first:pl-5 last:pr-5",
        ALIGN_MAP[align],
      )}
    >
      {col.sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "group -mx-1.5 inline-flex cursor-pointer items-center gap-1 rounded-md border border-solid border-transparent bg-transparent px-1.5 py-1 font-sans text-xs font-medium text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent/70 hover:text-foreground",
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
            <ChevronsUpDown
              aria-hidden="true"
              className="size-3.5 opacity-40 transition-opacity group-hover:opacity-80"
            />
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
    <tr className="border-b border-solid border-border/80 bg-muted/50 dark:border-white/10 dark:bg-white/[0.03]">
      {selectable && (
        <th scope="col" className="h-10 w-11 pr-2 pl-5 text-left">
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
            "px-4 text-foreground first:pl-5 last:pr-5",
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
        "transition-colors duration-(--ui-duration-instant) hover:bg-muted/50 data-selected:bg-signal/[0.06] dark:hover:bg-white/[0.03] dark:data-selected:bg-signal/12",
        striped && "even:bg-muted/35 dark:even:bg-white/[0.02]",
        onRowClick && "cursor-pointer",
      )}
    >
      {selectable && (
        <td className={cn("w-11 pr-2 pl-5", padClass)}>
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

interface AdvRowsProps<TData extends object> {
  rows: Row<AdvTableFeatures, TData>[];
  visibleCols: AdvancedTableColumn<TData>[];
  selectable: boolean;
  striped: boolean;
  loading: boolean;
  padClass: string;
  emptyMessage: string;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
  onRowClick?: (row: TData) => void;
}

export const AdvRows = <TData extends object>(p: AdvRowsProps<TData>) => {
  const colSpan = p.visibleCols.length + (p.selectable ? 1 : 0);
  if (p.loading) {
    return (
      <AdvLoadingRows visibleCols={p.visibleCols} selectable={p.selectable} padClass={p.padClass} />
    );
  }
  if (p.rows.length === 0) {
    return (
      <AdvEmptyRow
        colSpan={colSpan}
        emptyMessage={p.emptyMessage}
        hasActiveFilters={p.hasActiveFilters}
        onClearAllFilters={p.onClearAllFilters}
      />
    );
  }
  return (
    <>
      {p.rows.map((row) => (
        <AdvRow
          key={row.id}
          row={row}
          visibleCols={p.visibleCols}
          selectable={p.selectable}
          striped={p.striped}
          padClass={p.padClass}
          onRowClick={p.onRowClick}
        />
      ))}
    </>
  );
};
