"use client";

/**
 * DataTable 表头与表体行渲染子部件。
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
import type { MouseEvent } from "react";
import { DrawCheckbox } from "../draw-checkbox/index.js";
import { ALIGN_CLASS, SortHeaderButton, TableLoadingRows } from "./data-table-parts.js";
import type { DataTableColumn, DataTableDensity } from "./data-table.types.js";
import { dataTableCellVariants, dataTableHeadCellVariants } from "./data-table.variants.js";

export const DATA_TABLE_FEATURES = tableFeatures({
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

export type DataTableFeatures = typeof DATA_TABLE_FEATURES;

const ariaSort = (sorted: false | "asc" | "desc") =>
  sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined;

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element && Boolean(target.closest("button,a,input,label,[role='checkbox']"));

const HeaderCell = <TData extends object>({
  header,
  col,
  density,
}: {
  header: Header<DataTableFeatures, TData, unknown>;
  col?: DataTableColumn<TData>;
  density: DataTableDensity;
}) => {
  const align = col?.align ?? "left";
  const sorted = header.column.getIsSorted();
  return (
    <th
      scope="col"
      aria-sort={col?.sortable ? ariaSort(sorted) : undefined}
      className={cn(dataTableHeadCellVariants({ density }), ALIGN_CLASS[align])}
    >
      {col?.sortable ? (
        <SortHeaderButton
          label={col.header}
          sorted={sorted}
          align={align}
          onToggle={() => header.column.toggleSorting(sorted === "asc")}
        />
      ) : (
        col?.header
      )}
    </th>
  );
};

export const DataTableHead = <TData extends object>({
  headers,
  columns,
  density,
  stickyHeader,
  selectable,
  allSelected,
  someSelected,
  onToggleAll,
}: {
  headers: Header<DataTableFeatures, TData, unknown>[];
  columns: DataTableColumn<TData>[];
  density: DataTableDensity;
  stickyHeader: boolean;
  selectable: boolean;
  allSelected: boolean;
  someSelected: boolean;
  onToggleAll: (checked: boolean) => void;
}) => (
  <thead className={cn(stickyHeader && "sticky top-0 z-10 backdrop-blur-md")}>
    <tr className="border-b border-solid border-border/75 bg-secondary/35 dark:border-white/10 dark:bg-white/[0.03]">
      {selectable && (
        <th scope="col" className={cn("w-10 text-left", dataTableHeadCellVariants({ density }))}>
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
        <HeaderCell key={header.id} header={header} col={columns[idx]} density={density} />
      ))}
    </tr>
  </thead>
);

const DataTableRowCells = <TData extends object>({
  row,
  columns,
  density,
}: {
  row: Row<DataTableFeatures, TData>;
  columns: DataTableColumn<TData>[];
  density: DataTableDensity;
}) => (
  <>
    {row.getAllCells().map((cell, idx) => {
      const align = columns[idx]?.align ?? "left";
      return (
        <td
          key={cell.id}
          className={cn(
            dataTableCellVariants({ density }),
            ALIGN_CLASS[align],
            align === "right" && "tabular-nums",
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      );
    })}
  </>
);

const DataTableRow = <TData extends object>({
  row,
  columns,
  density,
  striped,
  selectable,
  onRowClick,
}: {
  row: Row<DataTableFeatures, TData>;
  columns: DataTableColumn<TData>[];
  density: DataTableDensity;
  striped: boolean;
  selectable: boolean;
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
        <td className={cn("w-10", dataTableCellVariants({ density }))}>
          <DrawCheckbox
            tone="signal"
            aria-label={`选择第 ${row.index + 1} 行`}
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(checked)}
          />
        </td>
      )}
      <DataTableRowCells row={row} columns={columns} density={density} />
    </tr>
  );
};

export const DataTableBody = <TData extends object>({
  rows,
  columns,
  density,
  striped,
  selectable,
  loading,
  emptyMessage,
  onRowClick,
}: {
  rows: Row<DataTableFeatures, TData>[];
  columns: DataTableColumn<TData>[];
  density: DataTableDensity;
  striped: boolean;
  selectable: boolean;
  loading: boolean;
  emptyMessage: string;
  onRowClick?: (row: TData) => void;
}) => {
  const colSpan = columns.length + (selectable ? 1 : 0);
  if (loading) return <TableLoadingRows colSpan={colSpan} />;
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
        <DataTableRow
          key={row.id}
          row={row}
          columns={columns}
          density={density}
          striped={striped}
          selectable={selectable}
          onRowClick={onRowClick}
        />
      ))}
    </>
  );
};
