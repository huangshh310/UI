// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AdvancedDataTable：在 TanStack Table v9 之上扩展分面筛选、毛玻璃列显隐（Base UI Popover）、
 * 行密度切换、斑马纹、骨架态、批量操作栏与 CSV 导出钩子的高级数据表格。
 */

import { type DataTableColumn } from "@/components/ui/data-table";
import { DrawCheckbox } from "@/components/ui/draw-checkbox";
import { cn } from "@/lib/utils";
import { Popover } from "@base-ui/react/popover";
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
  Columns3,
  Download,
  Search,
  X,
} from "lucide-react";
import { type MouseEvent, type ReactNode, useMemo, useState } from "react";

export const advancedTableShellVariants = cva(
  "w-full overflow-hidden font-sans text-card-foreground",
  {
    variants: {
      variant: {
        default:
          "rounded-2xl border border-solid border-border/85 bg-card shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/10 dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]",
        minimal:
          "rounded-xl border border-solid border-border/70 bg-background shadow-none dark:border-white/10 dark:bg-card/60",
        elevated:
          "rounded-2xl border border-solid border-border/80 bg-card shadow-[0_12px_32px_-10px_rgba(0,0,0,0.1),0_2px_6px_-1px_rgba(0,0,0,0.04)] dark:border-white/12 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const ADV_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const ADV_CTRL_BTN =
  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-solid border-input/55 bg-background px-2.5 font-sans text-xs font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors duration-(--ui-duration-fast) hover:border-foreground/25 hover:bg-accent/50 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/12 dark:bg-card dark:hover:border-white/22";

export const ADV_POPOVER_CLASSES =
  "min-w-44 origin-(--transform-origin) rounded-xl border border-solid border-border/80 bg-popover/96 p-2.5 text-popover-foreground backdrop-blur-xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.04)] outline-none transition-[transform,opacity] duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)] data-starting-style:-translate-y-1 data-starting-style:scale-[0.97] data-starting-style:opacity-0 data-ending-style:-translate-y-0.5 data-ending-style:scale-[0.98] data-ending-style:opacity-0 dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]";

export const DENSITY_CELL_PADDING: Record<TableDensity, string> = {
  compact: "py-2 text-xs",
  normal: "py-3 text-[13px]",
  comfortable: "py-4 text-sm",
};

const escapeCsv = (value: unknown) => {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export const buildCsv = <TData extends object>(
  columns: { header: string; accessor?: (row: TData) => unknown }[],
  rows: TData[],
): string => {
  const header = columns.map((col) => escapeCsv(col.header)).join(",");
  const lines = rows.map((row) =>
    columns.map((col) => escapeCsv(col.accessor ? col.accessor(row) : "")).join(","),
  );
  return [header, ...lines].join("\n");
};
export type TableDensity = "compact" | "normal" | "comfortable";
export type AdvancedDataTableVariant = "default" | "minimal" | "elevated";

export interface AdvancedTableColumn<TData> extends DataTableColumn<TData> {
  /** 是否默认隐藏该列 */
  defaultHidden?: boolean;
  /** 是否允许在列显隐面板中隐藏，默认 true */
  hideable?: boolean;
}

export interface AdvancedTableFacet<TData> {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  getValue: (row: TData) => string;
}

export interface AdvancedTableBatchAction<TData> {
  id: string;
  label: string;
  tone?: "default" | "destructive";
  onAction: (rows: TData[]) => void;
}

export interface AdvancedDataTableProps<TData> {
  data: TData[];
  columns: AdvancedTableColumn<TData>[];
  getRowId?: (row: TData, index: number) => string;
  title?: string;
  description?: string;
  /** 容器外观风格 */
  variant?: AdvancedDataTableVariant;
  /** 是否开启斑马纹交替底色 */
  striped?: boolean;
  /** 是否展示顶部搜索输入框，默认 true */
  searchable?: boolean;
  /** 搜索输入框占位文案 */
  searchPlaceholder?: string;
  /** 是否展示行密度切换器，默认 true */
  showDensityToggle?: boolean;
  /** 顶部工具栏自定义扩展操作 */
  toolbarActions?: ReactNode;
  /** 加载骨架态 */
  loading?: boolean;
  /** 单行点击回调（自动忽略复选框与内部按钮点击） */
  onRowClick?: (row: TData) => void;
  /** 分面筛选分组 */
  facets?: AdvancedTableFacet<TData>[];
  /** 多选批量操作 */
  batchActions?: AdvancedTableBatchAction<TData>[];
  /** 默认行密度 */
  defaultDensity?: TableDensity;
  /** 导出 CSV 回调；传入时显示导出按钮，接收当前过滤后的 CSV 文本与行数据 */
  onExportCsv?: (csv: string, rows: TData[]) => void;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
}
const ADV_TABLE_FEATURES = tableFeatures({
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

type AdvTableFeatures = typeof ADV_TABLE_FEATURES;

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

const AdvHead = <TData extends object>({
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

const AdvRows = <TData extends object>({
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

const AdvFooter = (props: {
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
const DENSITIES: { id: TableDensity; label: string }[] = [
  { id: "compact", label: "紧凑" },
  { id: "normal", label: "标准" },
  { id: "comfortable", label: "宽松" },
];

const DensityToggle = ({
  value,
  onChange,
}: {
  value: TableDensity;
  onChange: (next: TableDensity) => void;
}) => (
  <div className="inline-flex items-center gap-0.5 rounded-lg border border-solid border-border/75 bg-secondary/60 p-0.5 dark:border-white/10 dark:bg-white/6">
    {DENSITIES.map((item) => (
      <button
        key={item.id}
        type="button"
        aria-pressed={value === item.id}
        onClick={() => onChange(item.id)}
        className={cn(
          "h-7 cursor-pointer rounded-md border border-solid border-transparent px-2 font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast)",
          ADV_FOCUS_RING,
          value === item.id
            ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:bg-card dark:border-white/10"
            : "bg-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        {item.label}
      </button>
    ))}
  </div>
);

const ColumnVisibilityPopover = <TData extends object>({
  columns,
  hiddenIds,
  onToggle,
}: {
  columns: AdvancedTableColumn<TData>[];
  hiddenIds: Record<string, boolean>;
  onToggle: (id: string, visible: boolean) => void;
}) => {
  const toggleable = columns.filter((col) => col.hideable !== false);
  if (toggleable.length === 0) return null;

  return (
    <Popover.Root>
      <Popover.Trigger className={ADV_CTRL_BTN}>
        <Columns3 aria-hidden="true" className="size-3.5 text-muted-foreground" />
        列显隐
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6} align="end" className="z-(--ui-z-popover) outline-none">
          <Popover.Popup className={ADV_POPOVER_CLASSES}>
            <p className="m-0 mb-2 px-0.5 font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              显示列
            </p>
            <div className="flex flex-col gap-2">
              {toggleable.map((col) => (
                <DrawCheckbox
                  key={col.id}
                  tone="signal"
                  label={col.header}
                  checked={!hiddenIds[col.id]}
                  onCheckedChange={(checked) => onToggle(col.id, checked)}
                />
              ))}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

const FacetGroup = <TData extends object>(p: {
  facet: AdvancedTableFacet<TData>;
  selected: string | null | undefined;
  onToggle: (value: string) => void;
}) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <span className="text-xs font-medium text-muted-foreground">{p.facet.label}</span>
    {p.facet.options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        aria-pressed={p.selected === opt.value}
        onClick={() => p.onToggle(opt.value)}
        className={cn(
          "h-6.5 cursor-pointer rounded-full border border-solid px-2.5 font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast)",
          ADV_FOCUS_RING,
          p.selected === opt.value
            ? "border-signal/45 bg-signal/12 text-foreground dark:bg-signal/18"
            : "border-input/55 bg-background text-muted-foreground hover:border-foreground/25 hover:text-foreground dark:border-white/12 dark:bg-card",
        )}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const FacetFilterBar = <TData extends object>(p: {
  facets: AdvancedTableFacet<TData>[];
  activeFacets: Record<string, string | null>;
  onToggle: (facetId: string, optionValue: string) => void;
  onReset: () => void;
}) => {
  if (p.facets.length === 0) return null;
  const hasActive = Object.values(p.activeFacets).some(Boolean);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-solid border-border/65 bg-secondary/20 px-5 py-2.5 dark:border-white/8 dark:bg-white/[0.02]">
      {p.facets.map((facet) => (
        <FacetGroup
          key={facet.id}
          facet={facet}
          selected={p.activeFacets[facet.id]}
          onToggle={(val) => p.onToggle(facet.id, val)}
        />
      ))}
      {hasActive && (
        <button
          type="button"
          onClick={p.onReset}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 rounded-md border border-solid border-transparent bg-transparent px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground",
            ADV_FOCUS_RING,
          )}
        >
          <X aria-hidden="true" className="size-3" />
          重置筛选
        </button>
      )}
    </div>
  );
};

const BatchActionBar = <TData extends object>(p: {
  selectedRows: TData[];
  actions: AdvancedTableBatchAction<TData>[];
  onClear: () => void;
}) => {
  if (p.selectedRows.length === 0 || p.actions.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-solid border-signal/25 bg-signal/8 px-5 py-2.5 dark:bg-signal/12">
      <div className="flex items-center gap-2 text-xs text-foreground">
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-signal font-mono text-[11px] font-semibold text-signal-foreground tabular-nums">
          {p.selectedRows.length}
        </span>
        <span className="font-medium">已选 {p.selectedRows.length} 项</span>
        <button
          type="button"
          onClick={p.onClear}
          className={cn(
            "cursor-pointer rounded border border-solid border-transparent bg-transparent px-1 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground",
            ADV_FOCUS_RING,
          )}
        >
          取消选择
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {p.actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => action.onAction(p.selectedRows)}
            className={cn(
              "h-7 cursor-pointer rounded-lg border border-solid px-2.5 font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast)",
              ADV_FOCUS_RING,
              action.tone === "destructive"
                ? "border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/18 dark:border-destructive"
                : "border-input/55 bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-accent dark:border-white/12 dark:bg-card",
            )}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const AdvSearchInput = ({
  query,
  placeholder,
  onChange,
}: {
  query: string;
  placeholder: string;
  onChange: (next: string) => void;
}) => (
  <div className="relative w-full sm:w-52">
    <Search
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
    />
    <input
      type="search"
      aria-label="搜索高级表格"
      value={query}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-8 w-full rounded-lg border border-solid border-input/50 bg-background pr-7 pl-8 font-sans text-xs text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) placeholder:text-muted-foreground/75 hover:border-foreground/25 focus:border-ring focus:bg-card focus:ring-1 focus:ring-ring focus:ring-inset dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22"
    />
    {query.length > 0 && (
      <button
        type="button"
        aria-label="清除搜索"
        onClick={() => onChange("")}
        className={cn(
          "absolute top-1/2 right-1.5 inline-flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-solid border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
          ADV_FOCUS_RING,
        )}
      >
        <X aria-hidden="true" className="size-3" />
      </button>
    )}
  </div>
);

interface AdvancedToolbarProps<TData> {
  title?: string;
  description?: string;
  searchable: boolean;
  searchPlaceholder: string;
  showDensityToggle: boolean;
  toolbarActions?: ReactNode;
  query: string;
  onQueryChange: (next: string) => void;
  density: TableDensity;
  onDensityChange: (next: TableDensity) => void;
  columns: AdvancedTableColumn<TData>[];
  hiddenIds: Record<string, boolean>;
  onToggleColumn: (id: string, visible: boolean) => void;
  onExport?: () => void;
}

const AdvancedTopToolbar = <TData extends object>(props: AdvancedToolbarProps<TData>) => (
  <div className="flex flex-col gap-3 border-b border-solid border-border/75 px-5 py-3.5 lg:flex-row lg:items-center lg:justify-between dark:border-white/10">
    {(props.title || props.description) && (
      <div className="min-w-0">
        {props.title && (
          <p className="m-0 text-sm font-semibold tracking-tight text-foreground">{props.title}</p>
        )}
        {props.description && (
          <p className="m-0 mt-0.5 text-xs text-muted-foreground">{props.description}</p>
        )}
      </div>
    )}
    <div className="flex flex-wrap items-center gap-2">
      {props.searchable && (
        <AdvSearchInput
          query={props.query}
          placeholder={props.searchPlaceholder}
          onChange={props.onQueryChange}
        />
      )}
      {props.showDensityToggle && (
        <DensityToggle value={props.density} onChange={props.onDensityChange} />
      )}
      <ColumnVisibilityPopover
        columns={props.columns}
        hiddenIds={props.hiddenIds}
        onToggle={props.onToggleColumn}
      />
      {props.onExport && (
        <button type="button" onClick={props.onExport} className={ADV_CTRL_BTN}>
          <Download aria-hidden="true" className="size-3.5 text-muted-foreground" />
          导出 CSV
        </button>
      )}
      {props.toolbarActions}
    </div>
  </div>
);
const applyFacets = <TData extends object>(
  data: TData[],
  facets: AdvancedTableFacet<TData>[] | undefined,
  active: Record<string, string | null>,
) =>
  facets?.length
    ? data.filter((row) =>
        facets.every((facet) => !active[facet.id] || facet.getValue(row) === active[facet.id]),
      )
    : data;

const buildDefs = <TData extends object>(
  columns: AdvancedTableColumn<TData>[],
): ColumnDef<AdvTableFeatures, TData, unknown>[] =>
  columns.map((col) => ({
    id: col.id,
    accessorFn: (row) => col.accessor?.(row) ?? "",
    enableSorting: Boolean(col.sortable),
    cell: ({ row }) =>
      col.cell ? col.cell(row.original) : String(col.accessor?.(row.original) ?? ""),
  }));

const initHidden = <TData extends object>(columns: AdvancedTableColumn<TData>[]) =>
  Object.fromEntries(columns.filter((c) => c.defaultHidden).map((c) => [c.id, true]));

const useAdvancedTable = <TData extends object>(props: AdvancedDataTableProps<TData>) => {
  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [density, setDensity] = useState<TableDensity>(props.defaultDensity ?? "normal");
  const [activeFacets, setActiveFacets] = useState<Record<string, string | null>>({});
  const [hiddenIds, setHiddenIds] = useState<Record<string, boolean>>(() =>
    initHidden(props.columns),
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const visibleCols = useMemo(
    () => props.columns.filter((c) => !hiddenIds[c.id]),
    [props.columns, hiddenIds],
  );
  const filteredData = useMemo(
    () => applyFacets(props.data, props.facets, activeFacets),
    [props.data, props.facets, activeFacets],
  );
  const defs = useMemo(() => buildDefs(visibleCols), [visibleCols]);

  const table = useTable<AdvTableFeatures, TData>({
    features: ADV_TABLE_FEATURES,
    data: filteredData,
    columns: defs,
    getRowId: props.getRowId ? (row, idx) => props.getRowId!(row, idx) : undefined,
    state: { sorting, globalFilter: query, rowSelection },
    initialState: { pagination: { pageIndex: 0, pageSize: props.pageSize ?? 5 } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setQuery,
    onRowSelectionChange: setRowSelection,
  });

  return {
    table,
    query,
    setQuery,
    density,
    setDensity,
    activeFacets,
    setActiveFacets,
    hiddenIds,
    setHiddenIds,
    setRowSelection,
    visibleCols,
  };
};

const AdvTableGrid = <TData extends object>({
  props,
  state,
  selectable,
}: {
  props: AdvancedDataTableProps<TData>;
  state: ReturnType<typeof useAdvancedTable<TData>>;
  selectable: boolean;
}) => (
  <div
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    tabIndex={0}
    aria-label={props.title ?? "高级数据表格"}
    className="w-full overflow-x-auto outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset"
  >
    <table className="w-full border-collapse">
      <AdvHead
        headers={state.table.getFlatHeaders()}
        visibleCols={state.visibleCols}
        selectable={selectable}
        allSelected={state.table.getIsAllPageRowsSelected()}
        someSelected={state.table.getIsSomePageRowsSelected()}
        onToggleAll={(checked) => state.table.toggleAllPageRowsSelected(checked)}
      />
      <tbody>
        <AdvRows
          rows={state.table.getRowModel().rows}
          visibleCols={state.visibleCols}
          selectable={selectable}
          striped={Boolean(props.striped)}
          loading={Boolean(props.loading)}
          padClass={DENSITY_CELL_PADDING[state.density]}
          emptyMessage={props.emptyMessage ?? "暂无匹配记录"}
          onRowClick={props.onRowClick}
        />
      </tbody>
    </table>
  </div>
);

const AdvHeaderStack = <TData extends object>({
  props,
  state,
  matchedRows,
  selectedRows,
}: {
  props: AdvancedDataTableProps<TData>;
  state: ReturnType<typeof useAdvancedTable<TData>>;
  matchedRows: TData[];
  selectedRows: TData[];
}) => (
  <>
    <AdvancedTopToolbar
      title={props.title}
      description={props.description}
      searchable={props.searchable ?? true}
      searchPlaceholder={props.searchPlaceholder ?? "搜索关键字…"}
      showDensityToggle={props.showDensityToggle ?? true}
      toolbarActions={props.toolbarActions}
      query={state.query}
      onQueryChange={state.setQuery}
      density={state.density}
      onDensityChange={state.setDensity}
      columns={props.columns}
      hiddenIds={state.hiddenIds}
      onToggleColumn={(id, vis) => state.setHiddenIds((prev) => ({ ...prev, [id]: !vis }))}
      onExport={
        props.onExportCsv
          ? () => props.onExportCsv?.(buildCsv(state.visibleCols, matchedRows), matchedRows)
          : undefined
      }
    />
    <FacetFilterBar
      facets={props.facets ?? []}
      activeFacets={state.activeFacets}
      onToggle={(id, val) =>
        state.setActiveFacets((prev) => ({ ...prev, [id]: prev[id] === val ? null : val }))
      }
      onReset={() => state.setActiveFacets({})}
    />
    <BatchActionBar
      selectedRows={selectedRows}
      actions={props.batchActions ?? []}
      onClear={() => state.setRowSelection({})}
    />
  </>
);

export const AdvancedDataTable = <TData extends object>(props: AdvancedDataTableProps<TData>) => {
  const state = useAdvancedTable(props);
  const matchedRows = state.table.getFilteredRowModel().rows.map((r) => r.original);
  const selectedRows = state.table.getSelectedRowModel().rows.map((r) => r.original);
  const variant = props.variant ?? "default";

  return (
    <div
      data-slot="advanced-data-table"
      data-variant={variant}
      className={cn(advancedTableShellVariants({ variant }), props.className)}
    >
      <AdvHeaderStack
        props={props}
        state={state}
        matchedRows={matchedRows}
        selectedRows={selectedRows}
      />
      <AdvTableGrid
        props={props}
        state={state}
        selectable={(props.batchActions?.length ?? 0) > 0}
      />
      <AdvFooter
        pageIndex={state.table.state.pagination.pageIndex}
        pageCount={state.table.getPageCount()}
        totalCount={matchedRows.length}
        canPrev={state.table.getCanPreviousPage()}
        canNext={state.table.getCanNextPage()}
        onPrev={() => state.table.previousPage()}
        onNext={() => state.table.nextPage()}
      />
    </div>
  );
};
