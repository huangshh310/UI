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
import { DrawCheckbox } from "../draw-checkbox/index.js";
import { ALIGN_CLASS, SortHeaderButton, TableLoadingRows } from "./data-table-parts.js";
import type { DataTableColumn } from "./data-table.types.js";

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

const HeaderCell = <TData extends object>({
  header,
  col,
}: {
  header: Header<DataTableFeatures, TData, unknown>;
  col?: DataTableColumn<TData>;
}) => {
  const align = col?.align ?? "left";
  const sorted = header.column.getIsSorted();
  return (
    <th
      scope="col"
      aria-sort={col?.sortable ? ariaSort(sorted) : undefined}
      className={cn(
        "px-4 py-2.5 text-xs font-medium whitespace-nowrap text-muted-foreground",
        ALIGN_CLASS[align],
      )}
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
  selectable,
  allSelected,
  someSelected,
  onToggleAll,
}: {
  headers: Header<DataTableFeatures, TData, unknown>[];
  columns: DataTableColumn<TData>[];
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
        <HeaderCell key={header.id} header={header} col={columns[idx]} />
      ))}
    </tr>
  </thead>
);

const DataTableRow = <TData extends object>({
  row,
  columns,
  selectable,
}: {
  row: Row<DataTableFeatures, TData>;
  columns: DataTableColumn<TData>[];
  selectable: boolean;
}) => (
  <tr
    data-selected={row.getIsSelected() ? "" : undefined}
    className="border-t border-solid border-border/60 transition-colors duration-(--ui-duration-instant) hover:bg-accent/45 data-selected:bg-signal/6"
  >
    {selectable && (
      <td className="w-10 px-4 py-3">
        <DrawCheckbox
          tone="signal"
          aria-label={`选择第 ${row.index + 1} 行`}
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(checked)}
        />
      </td>
    )}
    {row.getAllCells().map((cell, idx) => {
      const align = columns[idx]?.align ?? "left";
      return (
        <td
          key={cell.id}
          className={cn(
            "px-4 py-3 text-sm text-foreground",
            ALIGN_CLASS[align],
            align === "right" && "tabular-nums",
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      );
    })}
  </tr>
);

export const DataTableBody = <TData extends object>({
  rows,
  columns,
  selectable,
  loading,
  emptyMessage,
}: {
  rows: Row<DataTableFeatures, TData>[];
  columns: DataTableColumn<TData>[];
  selectable: boolean;
  loading: boolean;
  emptyMessage: string;
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
        <DataTableRow key={row.id} row={row} columns={columns} selectable={selectable} />
      ))}
    </>
  );
};
