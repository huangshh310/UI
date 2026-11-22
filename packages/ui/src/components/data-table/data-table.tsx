"use client";

/**
 * DataTable：基于 TanStack Table v9 的声明式数据表格。
 * 支持点击排序（aria-sort）、全局搜索、客户端分页、行选择（复用 DrawCheckbox）、骨架加载与空状态。
 */
import { cn } from "@matt-ui/utils";
import {
  useTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  DATA_TABLE_FEATURES,
  DataTableBody,
  DataTableHead,
  type DataTableFeatures,
} from "./data-table-body.js";
import { TablePagination, TableToolbar } from "./data-table-parts.js";
import type { DataTableColumn, DataTableProps } from "./data-table.types.js";

const toColumnDefs = <TData extends object>(
  columns: DataTableColumn<TData>[],
): ColumnDef<DataTableFeatures, TData, unknown>[] =>
  columns.map((col) => ({
    id: col.id,
    accessorFn: (row) => col.accessor?.(row) ?? "",
    enableSorting: Boolean(col.sortable),
    cell: ({ row }) =>
      col.cell ? col.cell(row.original) : String(col.accessor?.(row.original) ?? ""),
  }));

const useTableState = <TData extends object>(props: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const columnDefs = useMemo(() => toColumnDefs(props.columns), [props.columns]);

  const table = useTable<DataTableFeatures, TData>({
    features: DATA_TABLE_FEATURES,
    data: props.data,
    columns: columnDefs,
    getRowId: props.getRowId ? (row, idx) => props.getRowId!(row, idx) : undefined,
    state: { sorting, globalFilter, rowSelection },
    initialState: { pagination: { pageIndex: 0, pageSize: props.pageSize ?? 5 } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(next);
      if (props.onSelectionChange) {
        const picked = props.data.filter(
          (row, idx) => next[props.getRowId ? props.getRowId(row, idx) : String(idx)],
        );
        props.onSelectionChange(picked);
      }
    },
  });

  return { table, globalFilter, setGlobalFilter };
};

const ScrollableTable = <TData extends object>({
  props,
  table,
}: {
  props: DataTableProps<TData>;
  table: ReturnType<typeof useTableState<TData>>["table"];
}) => (
  <div
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    tabIndex={0}
    aria-label={props.title ?? "数据表格"}
    className="w-full overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
  >
    <table className="w-full border-collapse">
      <DataTableHead
        headers={table.getFlatHeaders()}
        columns={props.columns}
        selectable={Boolean(props.selectable)}
        allSelected={table.getIsAllPageRowsSelected()}
        someSelected={table.getIsSomePageRowsSelected()}
        onToggleAll={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
      <tbody>
        <DataTableBody
          rows={table.getRowModel().rows}
          columns={props.columns}
          selectable={Boolean(props.selectable)}
          loading={Boolean(props.loading)}
          emptyMessage={props.emptyMessage ?? "暂无数据"}
        />
      </tbody>
    </table>
  </div>
);

export const DataTable = <TData extends object>(props: DataTableProps<TData>) => {
  const { table, globalFilter, setGlobalFilter } = useTableState(props);
  const totalCount = table.getFilteredRowModel().rows.length;

  return (
    <div
      data-slot="data-table"
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-solid border-border bg-card font-sans text-card-foreground shadow-sm",
        props.className,
      )}
    >
      <TableToolbar
        title={props.title}
        description={props.description}
        searchable={Boolean(props.searchable)}
        searchPlaceholder={props.searchPlaceholder ?? "搜索记录…"}
        query={globalFilter}
        onQueryChange={setGlobalFilter}
        totalCount={totalCount}
      />
      <ScrollableTable props={props} table={table} />
      <TablePagination
        pageIndex={table.state.pagination.pageIndex}
        pageCount={table.getPageCount()}
        pageSize={table.state.pagination.pageSize}
        totalCount={totalCount}
        canPrev={table.getCanPreviousPage()}
        canNext={table.getCanNextPage()}
        onPrev={() => table.previousPage()}
        onNext={() => table.nextPage()}
      />
    </div>
  );
};
