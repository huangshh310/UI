// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * DataTable：基于 TanStack Table v9 的声明式数据表格。
 * 支持点击排序（aria-sort）、全局搜索、客户端分页、行选择（复用 DrawCheckbox）、骨架加载与空状态。
 */

import { DrawCheckbox } from "@/components/ui/draw-checkbox";
import { cn } from "@/lib/utils";
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
  type ColumnDef,
  type Header,
  type Row,
  type RowSelectionState,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

export interface DataTableColumn<TData> {
  /** 列唯一标识 */
  id: string;
  /** 表头标题 */
  header: string;
  /** 提取排序与全局搜索用的纯值 */
  accessor?: (row: TData) => string | number | boolean | null | undefined;
  /** 自定义单元格渲染 */
  cell?: (row: TData) => ReactNode;
  /** 是否允许点击表头排序 */
  sortable?: boolean;
  /** 单元格对齐方式，数值列推荐 right */
  align?: "left" | "center" | "right";
}

export interface DataTableProps<TData> {
  /** 行数据 */
  data: TData[];
  /** 声明式列定义 */
  columns: DataTableColumn<TData>[];
  /** 提取行唯一标识，未提供时使用行索引 */
  getRowId?: (row: TData, index: number) => string;
  /** 表格标题与副标题 */
  title?: string;
  description?: string;
  /** 是否显示全局搜索输入框 */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** 是否开启多选复选框列 */
  selectable?: boolean;
  /** 选中行变化回调 */
  onSelectionChange?: (rows: TData[]) => void;
  /** 每页条数，默认 5 */
  pageSize?: number;
  /** 加载骨架态 */
  loading?: boolean;
  /** 空数据文案 */
  emptyMessage?: string;
  className?: string;
}
const DATA_TABLE_FEATURES = tableFeatures({
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

type DataTableFeatures = typeof DATA_TABLE_FEATURES;

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

const DataTableHead = <TData extends object>({
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

const DataTableBody = <TData extends object>({
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
const PAGE_BTN_CLASSES = cn(
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-solid border-border bg-background text-muted-foreground shadow-sm dark:bg-card",
  "transition-colors duration-(--ui-duration-fast) hover:border-foreground/22 hover:text-foreground",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
);

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const TableToolbar = ({
  title,
  description,
  searchable,
  searchPlaceholder,
  query,
  onQueryChange,
  totalCount,
}: {
  title?: string;
  description?: string;
  searchable: boolean;
  searchPlaceholder: string;
  query: string;
  onQueryChange: (next: string) => void;
  totalCount: number;
}) => {
  if (!title && !description && !searchable) return null;
  return (
    <div className="flex flex-col gap-3 border-b border-solid border-border/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      {(title || description) && (
        <div className="min-w-0">
          {title && <p className="m-0 text-sm font-semibold text-foreground">{title}</p>}
          {description && <p className="m-0 mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
      {searchable && (
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              aria-label="搜索表格"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 w-full rounded-full border border-solid border-border bg-secondary/50 pr-3.5 pl-8 font-sans text-xs text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) placeholder:text-muted-foreground/80 hover:border-foreground/22 focus:border-ring focus:bg-card focus:ring-1 focus:ring-ring focus:ring-inset"
            />
          </div>
          <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
            {totalCount} 条
          </span>
        </div>
      )}
    </div>
  );
};

const SortHeaderButton = ({
  label,
  sorted,
  align,
  onToggle,
}: {
  label: string;
  sorted: false | "asc" | "desc";
  align: "left" | "center" | "right";
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={cn(
      "inline-flex cursor-pointer items-center gap-1 rounded border-0 bg-transparent p-0 font-sans text-xs font-medium text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
      align === "right" && "ml-auto flex-row-reverse",
      sorted && "text-foreground",
    )}
  >
    <span>{label}</span>
    {sorted === "asc" ? (
      <ArrowUp aria-hidden="true" className="size-3.5 text-signal" />
    ) : sorted === "desc" ? (
      <ArrowDown aria-hidden="true" className="size-3.5 text-signal" />
    ) : (
      <ChevronsUpDown aria-hidden="true" className="size-3.5 opacity-55" />
    )}
  </button>
);

const TableLoadingRows = ({ colSpan }: { colSpan: number }) => (
  <>
    {[0, 1, 2].map((row) => (
      <tr key={row} className="border-t border-solid border-border/60">
        <td colSpan={colSpan} className="px-4 py-3.5">
          <div className="h-4 w-full animate-pulse rounded-md bg-secondary motion-reduce:animate-none" />
          <span className="sr-only">加载中</span>
        </td>
      </tr>
    ))}
  </>
);

interface TablePaginationProps {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  totalCount: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const TablePagination = (props: TablePaginationProps) => {
  if (props.totalCount <= props.pageSize && props.pageCount <= 1) return null;
  const start = props.totalCount === 0 ? 0 : props.pageIndex * props.pageSize + 1;
  const end = Math.min(props.totalCount, (props.pageIndex + 1) * props.pageSize);

  return (
    <div className="flex items-center justify-between gap-3 border-t border-solid border-border/80 px-5 py-3 text-xs text-muted-foreground">
      <span className="tabular-nums">
        第{" "}
        <strong className="font-medium text-foreground">
          {start}–{end}
        </strong>{" "}
        条，共 <strong className="font-medium text-foreground">{props.totalCount}</strong> 条
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="上一页"
          disabled={!props.canPrev}
          onClick={props.onPrev}
          className={PAGE_BTN_CLASSES}
        >
          <ChevronLeft aria-hidden="true" className="size-3.5" />
        </button>
        <span className="px-2 font-mono text-xs tabular-nums">
          {props.pageIndex + 1} / {Math.max(1, props.pageCount)}
        </span>
        <button
          type="button"
          aria-label="下一页"
          disabled={!props.canNext}
          onClick={props.onNext}
          className={PAGE_BTN_CLASSES}
        >
          <ChevronRight aria-hidden="true" className="size-3.5" />
        </button>
      </div>
    </div>
  );
};
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
        "w-full overflow-hidden rounded-[22px] border border-solid border-border/85 bg-card font-sans text-card-foreground shadow-md",
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
