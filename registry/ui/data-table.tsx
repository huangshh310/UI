// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * DataTable：基于 TanStack Table v9 的声明式数据表格。
 * 支持点击排序（aria-sort）、全局搜索、客户端分页、行选择（复用 DrawCheckbox）、外观与密度变体、斑马纹、骨架加载与空状态。
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
import { cva } from "class-variance-authority";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
  X,
} from "lucide-react";
import { type MouseEvent, type ReactNode, useMemo, useState } from "react";

export const dataTableShellVariants = cva("w-full overflow-hidden font-sans text-card-foreground", {
  variants: {
    variant: {
      default:
        "rounded-2xl border border-solid border-border/85 bg-card shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/10 dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]",
      minimal:
        "rounded-xl border border-solid border-border/70 bg-background shadow-none dark:border-white/10 dark:bg-card/60",
      ghost: "border-0 bg-transparent shadow-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const dataTableCellVariants = cva("text-foreground", {
  variants: {
    density: {
      compact: "px-3.5 py-2 text-xs",
      normal: "px-4 py-3 text-[13px]",
      comfortable: "px-4 py-4 text-sm",
    },
  },
  defaultVariants: {
    density: "normal",
  },
});

export const dataTableHeadCellVariants = cva(
  "font-medium whitespace-nowrap text-muted-foreground",
  {
    variants: {
      density: {
        compact: "px-3.5 py-2 text-[11px]",
        normal: "px-4 py-2.5 text-xs",
        comfortable: "px-4 py-3 text-xs",
      },
    },
    defaultVariants: {
      density: "normal",
    },
  },
);
export type DataTableVariant = "default" | "minimal" | "ghost";
export type DataTableDensity = "compact" | "normal" | "comfortable";

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
  /** 容器外观风格 */
  variant?: DataTableVariant;
  /** 行高与单元格内边距密度 */
  density?: DataTableDensity;
  /** 是否开启斑马纹交替底色 */
  striped?: boolean;
  /** 是否吸顶表头（配合固定高度容器垂直滚动） */
  stickyHeader?: boolean;
  /** 顶部工具栏右侧扩展槽 */
  toolbarActions?: ReactNode;
  /** 点击行回调（自动忽略复选框与内部按钮点击） */
  onRowClick?: (row: TData) => void;
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

const DataTableHead = <TData extends object>({
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

const DataTableBody = <TData extends object>({
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
const FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const PAGE_BTN_CLASSES = cn(
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-solid border-input/55 bg-background text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/12 dark:bg-card",
  "transition-colors duration-(--ui-duration-fast) hover:border-foreground/25 hover:text-foreground",
  FOCUS_RING,
  "disabled:pointer-events-none disabled:opacity-40",
);

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const TableSearchInput = ({
  query,
  placeholder,
  onChange,
}: {
  query: string;
  placeholder: string;
  onChange: (next: string) => void;
}) => (
  <div className="relative w-full sm:w-56">
    <Search
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
    />
    <input
      type="search"
      aria-label="搜索表格"
      value={query}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-8 w-full rounded-lg border border-solid border-input/50 bg-background pr-7 pl-8 font-sans text-xs text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) placeholder:text-muted-foreground/75 hover:border-foreground/25 dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22",
        "outline-none focus:border-ring focus:bg-card focus:ring-1 focus:ring-ring focus:ring-inset",
      )}
    />
    {query.length > 0 && (
      <button
        type="button"
        aria-label="清除搜索"
        onClick={() => onChange("")}
        className={cn(
          "absolute top-1/2 right-1.5 inline-flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-solid border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
          FOCUS_RING,
        )}
      >
        <X aria-hidden="true" className="size-3" />
      </button>
    )}
  </div>
);

const ToolbarTitle = ({ title, description }: { title?: string; description?: string }) => {
  if (!title && !description) return null;
  return (
    <div className="min-w-0">
      {title && <p className="m-0 text-sm font-semibold tracking-tight text-foreground">{title}</p>}
      {description && <p className="m-0 mt-0.5 text-xs text-muted-foreground">{description}</p>}
    </div>
  );
};

const TableToolbar = ({
  title,
  description,
  searchable,
  searchPlaceholder,
  query,
  onQueryChange,
  totalCount,
  toolbarActions,
}: {
  title?: string;
  description?: string;
  searchable: boolean;
  searchPlaceholder: string;
  query: string;
  onQueryChange: (next: string) => void;
  totalCount: number;
  toolbarActions?: ReactNode;
}) => {
  const hasHeading = Boolean(title || description);
  const hasControls = Boolean(searchable || toolbarActions);
  if (!hasHeading && !hasControls) return null;
  return (
    <div className="flex flex-col gap-3 border-b border-solid border-border/75 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
      <ToolbarTitle title={title} description={description} />
      {hasControls && (
        <div className="flex flex-wrap items-center gap-2.5">
          {searchable && (
            <>
              <TableSearchInput
                query={query}
                placeholder={searchPlaceholder}
                onChange={onQueryChange}
              />
              <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                {totalCount} 条
              </span>
            </>
          )}
          {toolbarActions}
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
      "inline-flex cursor-pointer items-center gap-1 rounded border border-solid border-transparent bg-transparent px-1 py-0.5 -mx-1 font-sans text-xs font-medium text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:text-foreground",
      FOCUS_RING,
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
      <ChevronsUpDown aria-hidden="true" className="size-3.5 opacity-50" />
    )}
  </button>
);

const TableLoadingRows = ({ colSpan }: { colSpan: number }) => (
  <>
    {[0, 1, 2].map((row) => (
      <tr key={row} className="border-t border-solid border-border/55 dark:border-white/7">
        <td colSpan={colSpan} className="px-4 py-3.5">
          <div className="h-3.5 w-full animate-pulse rounded-md bg-secondary/80 motion-reduce:animate-none" />
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
    <div className="flex items-center justify-between gap-3 border-t border-solid border-border/75 px-5 py-3 text-xs text-muted-foreground dark:border-white/10">
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
}) => {
  const density = props.density ?? "normal";
  return (
    <div
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-label={props.title ?? "数据表格"}
      className="w-full overflow-x-auto outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <table className="w-full border-collapse">
        <DataTableHead
          headers={table.getFlatHeaders()}
          columns={props.columns}
          density={density}
          stickyHeader={Boolean(props.stickyHeader)}
          selectable={Boolean(props.selectable)}
          allSelected={table.getIsAllPageRowsSelected()}
          someSelected={table.getIsSomePageRowsSelected()}
          onToggleAll={(checked) => table.toggleAllPageRowsSelected(checked)}
        />
        <tbody>
          <DataTableBody
            rows={table.getRowModel().rows}
            columns={props.columns}
            density={density}
            striped={Boolean(props.striped)}
            selectable={Boolean(props.selectable)}
            loading={Boolean(props.loading)}
            emptyMessage={props.emptyMessage ?? "暂无数据"}
            onRowClick={props.onRowClick}
          />
        </tbody>
      </table>
    </div>
  );
};

export const DataTable = <TData extends object>(props: DataTableProps<TData>) => {
  const { table, globalFilter, setGlobalFilter } = useTableState(props);
  const totalCount = table.getFilteredRowModel().rows.length;
  const variant = props.variant ?? "default";
  const density = props.density ?? "normal";

  return (
    <div
      data-slot="data-table"
      data-variant={variant}
      data-density={density}
      className={cn(dataTableShellVariants({ variant }), props.className)}
    >
      <TableToolbar
        title={props.title}
        description={props.description}
        searchable={Boolean(props.searchable)}
        searchPlaceholder={props.searchPlaceholder ?? "搜索记录…"}
        query={globalFilter}
        onQueryChange={setGlobalFilter}
        totalCount={totalCount}
        toolbarActions={props.toolbarActions}
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
