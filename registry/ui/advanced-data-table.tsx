// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AdvancedDataTable：在 TanStack Table v9 之上扩展多选分面筛选弹层、毛玻璃列显隐（Base UI Popover）、
 * 行密度切换、斑马纹、多列骨架态、批量操作栏与 CSV 导出钩子的高级数据表格。
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
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Columns3,
  Download,
  Inbox,
  PlusCircle,
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
          "rounded-xl border border-solid border-border bg-card shadow-xs dark:border-white/10 dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]",
        minimal:
          "rounded-xl border border-solid border-border/80 bg-background shadow-none dark:border-white/10 dark:bg-card/60",
        elevated:
          "rounded-xl border border-solid border-border bg-card shadow-[0_12px_32px_-12px_rgba(0,0,0,0.08),0_2px_6px_-1px_rgba(0,0,0,0.04)] dark:border-white/12 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const ADV_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

/** 工具栏统一 32px（h-8）发丝描边按钮，与 Button outline 保持一致 */
export const ADV_CTRL_BTN =
  "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-solid border-border bg-card px-2.5 font-sans text-xs font-medium whitespace-nowrap text-foreground shadow-xs transition-[background-color,border-color,color] duration-(--ui-duration-fast) hover:border-foreground/20 hover:bg-accent/60 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/12 dark:bg-card/90 dark:hover:border-white/22 dark:hover:bg-accent";

/** 分面筛选虚线触发按钮：对齐 shadcn/ui 与 Linear 工具栏范式 */
export const ADV_FACET_BTN =
  "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-border bg-background px-2.5 font-sans text-xs font-medium whitespace-nowrap text-foreground shadow-xs transition-[background-color,border-color,color] duration-(--ui-duration-fast) hover:border-foreground/25 hover:bg-accent/55 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/15 dark:bg-card/75 dark:hover:border-white/25 dark:hover:bg-accent";

export const ADV_POPOVER_CLASSES =
  "min-w-48 origin-(--transform-origin) rounded-xl border border-solid border-border bg-popover/98 p-1.5 text-popover-foreground backdrop-blur-xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.04)] outline-none transition-[transform,opacity] duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)] data-starting-style:-translate-y-1 data-starting-style:scale-[0.97] data-starting-style:opacity-0 data-ending-style:-translate-y-0.5 data-ending-style:scale-[0.98] data-ending-style:opacity-0 dark:border-white/10 dark:bg-popover/96 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]";

export const DENSITY_CELL_PADDING: Record<TableDensity, string> = {
  compact: "py-2 text-xs",
  normal: "py-3 text-[13px]",
  comfortable: "py-3.5 text-sm",
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

const AdvRows = <TData extends object>(p: AdvRowsProps<TData>) => {
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
  <div className="inline-flex h-8 shrink-0 items-center gap-0.5 rounded-lg border border-solid border-border bg-muted/70 p-0.5 dark:border-white/10 dark:bg-white/[0.05]">
    {DENSITIES.map((item) => (
      <button
        key={item.id}
        type="button"
        aria-pressed={value === item.id}
        onClick={() => onChange(item.id)}
        className={cn(
          "inline-flex h-full cursor-pointer items-center rounded-md border border-solid border-transparent px-2 font-sans text-xs font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-(--ui-duration-fast)",
          ADV_FOCUS_RING,
          value === item.id
            ? "bg-card text-foreground shadow-xs dark:border-white/10 dark:bg-card"
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
  const hiddenCount = toggleable.filter((col) => hiddenIds[col.id]).length;

  return (
    <Popover.Root>
      <Popover.Trigger className={ADV_CTRL_BTN}>
        <Columns3 aria-hidden="true" className="size-3.5 text-muted-foreground" />
        <span>列显隐</span>
        {hiddenCount > 0 && (
          <span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-secondary px-1 font-mono text-[10px] font-semibold text-secondary-foreground tabular-nums">
            -{hiddenCount}
          </span>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6} align="end" className="z-(--ui-z-popover) outline-none">
          <Popover.Popup className={cn(ADV_POPOVER_CLASSES, "p-2.5")}>
            <p className="m-0 mb-2 px-0.5 text-[11px] font-medium text-muted-foreground">显示列</p>
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

const BatchActionBar = <TData extends object>(p: {
  selectedRows: TData[];
  actions: AdvancedTableBatchAction<TData>[];
  onClear: () => void;
}) => {
  if (p.selectedRows.length === 0 || p.actions.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-solid border-signal/20 bg-signal/[0.06] px-5 py-2.5 dark:border-signal/30 dark:bg-signal/12">
      <div className="flex items-center gap-2 text-xs text-foreground">
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-signal font-mono text-[11px] font-semibold text-signal-foreground tabular-nums">
          {p.selectedRows.length}
        </span>
        <span className="font-medium">已选 {p.selectedRows.length} 项</span>
        <button
          type="button"
          onClick={p.onClear}
          className={cn(
            "cursor-pointer rounded border border-solid border-transparent bg-transparent px-1 text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground",
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
              "inline-flex h-7 cursor-pointer items-center rounded-lg border border-solid px-2.5 font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast)",
              ADV_FOCUS_RING,
              action.tone === "destructive"
                ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/18 dark:border-destructive/60"
                : "border-border bg-card text-foreground shadow-xs hover:border-foreground/20 hover:bg-accent/60 dark:border-white/12",
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
  <div className="relative w-full min-w-0 sm:w-44 xl:w-52">
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
      className="h-8 w-full rounded-lg border border-solid border-border bg-background pr-7 pl-8 font-sans text-xs text-foreground shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) placeholder:text-muted-foreground/80 hover:border-foreground/20 focus:border-ring focus:bg-card focus:ring-1 focus:ring-ring focus:ring-inset dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22"
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

const ExportButton = ({ onExport }: { onExport?: () => void }) =>
  onExport ? (
    <button type="button" onClick={onExport} className={ADV_CTRL_BTN}>
      <Download aria-hidden="true" className="size-3.5 text-muted-foreground" />
      导出 CSV
    </button>
  ) : null;

/** 卡片标题层：仅在存在 title 或 description 时呈现，承载主操作以防工具栏拥挤 */
const AdvancedHeaderBar = ({
  title,
  description,
  toolbarActions,
  onExport,
}: {
  title?: string;
  description?: string;
  toolbarActions?: ReactNode;
  onExport?: () => void;
}) => {
  if (!title && !description) return null;
  const hasActions = Boolean(toolbarActions || onExport);
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-solid border-border/75 px-5 py-4 dark:border-white/10">
      <div className="min-w-0">
        {title && (
          <p className="m-0 text-sm font-semibold tracking-tight text-foreground">{title}</p>
        )}
        {description && (
          <p className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {hasActions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <ExportButton onExport={onExport} />
          {toolbarActions}
        </div>
      )}
    </div>
  );
};

interface AdvancedControlBarProps<TData> {
  hasHeader: boolean;
  searchable: boolean;
  searchPlaceholder: string;
  showDensityToggle: boolean;
  toolbarActions?: ReactNode;
  facetControls?: ReactNode;
  query: string;
  onQueryChange: (next: string) => void;
  density: TableDensity;
  onDensityChange: (next: TableDensity) => void;
  columns: AdvancedTableColumn<TData>[];
  hiddenIds: Record<string, boolean>;
  onToggleColumn: (id: string, visible: boolean) => void;
  onExport?: () => void;
}

const ControlBarRight = <TData extends object>(
  p: AdvancedControlBarProps<TData> & { showFallbackActions: boolean },
) => (
  <div className="flex shrink-0 flex-wrap items-center gap-2">
    {p.showDensityToggle && <DensityToggle value={p.density} onChange={p.onDensityChange} />}
    <ColumnVisibilityPopover
      columns={p.columns}
      hiddenIds={p.hiddenIds}
      onToggle={p.onToggleColumn}
    />
    {p.showFallbackActions && (
      <>
        <ExportButton onExport={p.onExport} />
        {p.toolbarActions}
      </>
    )}
  </div>
);

const ControlBarLeft = <TData extends object>(p: AdvancedControlBarProps<TData>) => (
  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
    {p.searchable && (
      <AdvSearchInput
        query={p.query}
        placeholder={p.searchPlaceholder}
        onChange={p.onQueryChange}
      />
    )}
    {p.facetControls}
  </div>
);

/** 操作工具栏层：左侧搜索与分面筛选，右侧视图控制（密度、列显隐） */
const AdvancedControlBar = <TData extends object>(p: AdvancedControlBarProps<TData>) => {
  const showFallbackActions = !p.hasHeader && Boolean(p.onExport || p.toolbarActions);
  const hasLeft = Boolean(p.searchable || p.facetControls);
  const hasRight =
    p.showDensityToggle || showFallbackActions || p.columns.some((c) => c.hideable !== false);
  if (!hasLeft && !hasRight) return null;

  return (
    <div className="flex flex-wrap items-start justify-between gap-2.5 border-b border-solid border-border/75 px-5 py-3 dark:border-white/10">
      {hasLeft && <ControlBarLeft {...p} />}
      {hasRight && <ControlBarRight {...p} showFallbackActions={showFallbackActions} />}
    </div>
  );
};
const countOptionMatches = <TData extends object>(
  data: TData[],
  facets: AdvancedTableFacet<TData>[],
  activeFacets: Record<string, string[]>,
  targetFacet: AdvancedTableFacet<TData>,
) => {
  const counts = new Map<string, number>();
  for (const row of data) {
    const passesOthers = facets.every((f) => {
      if (f.id === targetFacet.id) return true;
      const picked = activeFacets[f.id];
      return !picked?.length || picked.includes(f.getValue(row));
    });
    if (!passesOthers) continue;
    const val = targetFacet.getValue(row);
    counts.set(val, (counts.get(val) ?? 0) + 1);
  }
  return counts;
};

const SelectedBadges = ({
  options,
  selected,
}: {
  options: { value: string; label: string }[];
  selected: string[];
}) => {
  if (selected.length === 0) return null;
  const labels = options.filter((o) => selected.includes(o.value)).map((o) => o.label);
  return (
    <>
      <span aria-hidden="true" className="mx-0.5 h-3.5 w-px bg-border dark:bg-white/15" />
      {labels.length > 2 ? (
        <span className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-[11px] leading-none font-medium text-secondary-foreground tabular-nums">
          已选 {labels.length} 项
        </span>
      ) : (
        <span className="inline-flex items-center gap-1">
          {labels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-[11px] leading-none font-medium text-secondary-foreground"
            >
              {label}
            </span>
          ))}
        </span>
      )}
    </>
  );
};

const FacetOptionRow = ({
  label,
  checked,
  count,
  onSelect,
}: {
  label: string;
  checked: boolean;
  count: number;
  onSelect: () => void;
}) => (
  <button
    type="button"
    aria-pressed={checked}
    onClick={onSelect}
    className={cn(
      "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-solid border-transparent bg-transparent px-2 py-1.5 text-left font-sans text-xs text-foreground transition-colors duration-(--ui-duration-instant) hover:bg-accent/70",
      ADV_FOCUS_RING,
    )}
  >
    <span className="flex min-w-0 items-center gap-2">
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border border-solid transition-colors duration-(--ui-duration-instant)",
          checked
            ? "border-signal bg-signal text-signal-foreground"
            : "border-input/70 bg-background dark:border-white/25",
        )}
      >
        {checked && <Check className="size-2.5 stroke-[2.75]" />}
      </span>
      <span className="truncate font-medium">{label}</span>
    </span>
    <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
      {count}
    </span>
  </button>
);

const FacetClearFooter = ({ onClear }: { onClear: () => void }) => (
  <div className="mt-1.5 border-t border-solid border-border/80 pt-1.5 dark:border-white/10">
    <button
      type="button"
      onClick={onClear}
      className={cn(
        "flex w-full cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent py-1.5 font-sans text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground",
        ADV_FOCUS_RING,
      )}
    >
      清除此项筛选
    </button>
  </div>
);

const FacetPopoverItem = <TData extends object>(p: {
  facet: AdvancedTableFacet<TData>;
  selected: string[];
  counts: Map<string, number>;
  onToggle: (value: string) => void;
  onClearFacet: () => void;
}) => (
  <Popover.Root>
    <Popover.Trigger
      className={cn(
        ADV_FACET_BTN,
        p.selected.length > 0 && "border-solid border-foreground/20 bg-card dark:border-white/20",
      )}
    >
      <PlusCircle aria-hidden="true" className="size-3.5 text-muted-foreground" />
      <span>{p.facet.label}</span>
      <SelectedBadges options={p.facet.options} selected={p.selected} />
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner sideOffset={6} align="start" className="z-(--ui-z-popover) outline-none">
        <Popover.Popup className={ADV_POPOVER_CLASSES}>
          <p className="m-0 px-2 pt-1 pb-1.5 text-[11px] font-medium text-muted-foreground">
            按{p.facet.label}筛选
          </p>
          <div className="flex flex-col gap-0.5">
            {p.facet.options.map((opt) => (
              <FacetOptionRow
                key={opt.value}
                label={opt.label}
                checked={p.selected.includes(opt.value)}
                count={p.counts.get(opt.value) ?? 0}
                onSelect={() => p.onToggle(opt.value)}
              />
            ))}
          </div>
          {p.selected.length > 0 && <FacetClearFooter onClear={p.onClearFacet} />}
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
);

const FacetFilterGroup = <TData extends object>(p: {
  data: TData[];
  facets: AdvancedTableFacet<TData>[];
  activeFacets: Record<string, string[]>;
  onToggle: (facetId: string, optionValue: string) => void;
  onClearFacet: (facetId: string) => void;
  onResetAll: () => void;
}) => {
  if (p.facets.length === 0) return null;
  const hasActive = Object.values(p.activeFacets).some((list) => list.length > 0);
  return (
    <>
      {p.facets.map((facet) => (
        <FacetPopoverItem
          key={facet.id}
          facet={facet}
          selected={p.activeFacets[facet.id] ?? []}
          counts={countOptionMatches(p.data, p.facets, p.activeFacets, facet)}
          onToggle={(val) => p.onToggle(facet.id, val)}
          onClearFacet={() => p.onClearFacet(facet.id)}
        />
      ))}
      {hasActive && (
        <button
          type="button"
          onClick={p.onResetAll}
          className={cn(
            "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-solid border-transparent bg-transparent px-2 font-sans text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
            ADV_FOCUS_RING,
          )}
        >
          重置
          <X aria-hidden="true" className="size-3.5" />
        </button>
      )}
    </>
  );
};
const PAGE_BTN = cn(
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-solid border-border bg-card text-muted-foreground shadow-xs transition-colors duration-(--ui-duration-fast) hover:border-foreground/20 hover:bg-accent/60 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 dark:border-white/12",
  ADV_FOCUS_RING,
);

const AdvFooterSummary = ({
  start,
  end,
  totalCount,
  selectedCount,
}: {
  start: number;
  end: number;
  totalCount: number;
  selectedCount: number;
}) => (
  <div className="flex items-center gap-2 tabular-nums">
    {totalCount > 0 ? (
      <span>
        显示{" "}
        <strong className="font-medium text-foreground">
          {start}–{end}
        </strong>{" "}
        条，共 <strong className="font-medium text-foreground">{totalCount}</strong> 条
      </span>
    ) : (
      <span>共 0 条匹配记录</span>
    )}
    {selectedCount > 0 && (
      <span className="rounded bg-signal/12 px-1.5 py-0.5 text-[11px] font-medium text-foreground">
        已选 {selectedCount} 项
      </span>
    )}
  </div>
);

const AdvFooter = (props: {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  totalCount: number;
  selectedCount: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const start = props.totalCount === 0 ? 0 : props.pageIndex * props.pageSize + 1;
  const end = Math.min(props.totalCount, (props.pageIndex + 1) * props.pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-solid border-border/75 bg-muted/25 px-5 py-3 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/[0.015]">
      <AdvFooterSummary
        start={start}
        end={end}
        totalCount={props.totalCount}
        selectedCount={props.selectedCount}
      />
      <div className="flex items-center gap-1.5">
        <span className="pr-1.5 font-mono text-xs tabular-nums">
          第 {props.pageIndex + 1} / {Math.max(1, props.pageCount)} 页
        </span>
        <button
          type="button"
          aria-label="上一页"
          disabled={!props.canPrev}
          onClick={props.onPrev}
          className={PAGE_BTN}
        >
          <ChevronLeft aria-hidden="true" className="size-3.5" />
        </button>
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
};
const SKELETON_WIDTHS = ["w-28", "w-24", "w-16", "w-20", "w-32"] as const;

const AdvLoadingRows = <TData extends object>({
  visibleCols,
  selectable,
  padClass,
}: {
  visibleCols: AdvancedTableColumn<TData>[];
  selectable: boolean;
  padClass: string;
}) => (
  <>
    {[0, 1, 2, 3].map((rowIdx) => (
      <tr key={rowIdx}>
        {selectable && (
          <td aria-label="加载中" className={cn("w-11 pr-2 pl-5", padClass)}>
            <div className="size-4 animate-pulse rounded bg-secondary/80 motion-reduce:animate-none" />
          </td>
        )}
        {visibleCols.map((col, colIdx) => (
          <td key={col.id} className={cn("px-4 first:pl-5 last:pr-5", padClass)}>
            <div
              className={cn(
                "h-3.5 animate-pulse rounded-md bg-secondary/80 motion-reduce:animate-none",
                SKELETON_WIDTHS[(rowIdx + colIdx) % SKELETON_WIDTHS.length],
                col.align === "right" && "ml-auto",
                col.align === "center" && "mx-auto",
              )}
            />
            {rowIdx === 0 && colIdx === 0 && <span className="sr-only">加载中</span>}
          </td>
        ))}
      </tr>
    ))}
  </>
);

const AdvEmptyRow = ({
  colSpan,
  emptyMessage,
  hasActiveFilters,
  onClearAllFilters,
}: {
  colSpan: number;
  emptyMessage: string;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
}) => (
  <tr>
    <td colSpan={colSpan} aria-label={emptyMessage} className="px-5 py-12 text-center">
      <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
        <span className="inline-flex size-9 items-center justify-center rounded-full border border-solid border-border bg-muted/60 text-muted-foreground">
          <Inbox aria-hidden="true" className="size-4" />
        </span>
        <p className="m-0 text-sm font-medium text-foreground">{emptyMessage}</p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAllFilters}
            className={cn(
              "mt-1 inline-flex h-7 cursor-pointer items-center rounded-lg border border-solid border-border bg-card px-2.5 font-sans text-xs font-medium text-foreground shadow-xs hover:bg-accent/60",
              ADV_FOCUS_RING,
            )}
          >
            清空搜索与筛选
          </button>
        )}
      </div>
    </td>
  </tr>
);
const applyFacets = <TData extends object>(
  data: TData[],
  facets: AdvancedTableFacet<TData>[] | undefined,
  active: Record<string, string[]>,
) =>
  facets?.length
    ? data.filter((row) =>
        facets.every((facet) => {
          const picked = active[facet.id];
          return !picked?.length || picked.includes(facet.getValue(row));
        }),
      )
    : data;

const toggleFacetOption = (
  prev: Record<string, string[]>,
  facetId: string,
  val: string,
): Record<string, string[]> => {
  const current = prev[facetId] ?? [];
  const next = current.includes(val) ? current.filter((item) => item !== val) : [...current, val];
  return { ...prev, [facetId]: next };
};

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
  const [activeFacets, setActiveFacets] = useState<Record<string, string[]>>({});
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
  hasActiveFilters,
}: {
  props: AdvancedDataTableProps<TData>;
  state: ReturnType<typeof useAdvancedTable<TData>>;
  selectable: boolean;
  hasActiveFilters: boolean;
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
      <tbody className="divide-y divide-border/70 dark:divide-white/7">
        <AdvRows
          rows={state.table.getRowModel().rows}
          visibleCols={state.visibleCols}
          selectable={selectable}
          striped={Boolean(props.striped)}
          loading={Boolean(props.loading)}
          padClass={DENSITY_CELL_PADDING[state.density]}
          emptyMessage={props.emptyMessage ?? "暂无匹配记录"}
          hasActiveFilters={hasActiveFilters}
          onClearAllFilters={() => {
            state.setQuery("");
            state.setActiveFacets({});
          }}
          onRowClick={props.onRowClick}
        />
      </tbody>
    </table>
  </div>
);

const renderFacetControls = <TData extends object>(
  props: AdvancedDataTableProps<TData>,
  state: ReturnType<typeof useAdvancedTable<TData>>,
) =>
  props.facets?.length ? (
    <FacetFilterGroup
      data={props.data}
      facets={props.facets}
      activeFacets={state.activeFacets}
      onToggle={(id, val) => state.setActiveFacets((prev) => toggleFacetOption(prev, id, val))}
      onClearFacet={(id) => state.setActiveFacets((prev) => ({ ...prev, [id]: [] }))}
      onResetAll={() => state.setActiveFacets({})}
    />
  ) : undefined;

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
}) => {
  const onExport = props.onExportCsv
    ? () => props.onExportCsv?.(buildCsv(state.visibleCols, matchedRows), matchedRows)
    : undefined;

  return (
    <>
      <AdvancedHeaderBar
        title={props.title}
        description={props.description}
        toolbarActions={props.toolbarActions}
        onExport={onExport}
      />
      <AdvancedControlBar
        hasHeader={Boolean(props.title || props.description)}
        searchable={props.searchable ?? true}
        searchPlaceholder={props.searchPlaceholder ?? "搜索关键字…"}
        showDensityToggle={props.showDensityToggle ?? true}
        toolbarActions={props.toolbarActions}
        facetControls={renderFacetControls(props, state)}
        query={state.query}
        onQueryChange={state.setQuery}
        density={state.density}
        onDensityChange={state.setDensity}
        columns={props.columns}
        hiddenIds={state.hiddenIds}
        onToggleColumn={(id, vis) => state.setHiddenIds((prev) => ({ ...prev, [id]: !vis }))}
        onExport={onExport}
      />
      <BatchActionBar
        selectedRows={selectedRows}
        actions={props.batchActions ?? []}
        onClear={() => state.setRowSelection({})}
      />
    </>
  );
};

export const AdvancedDataTable = <TData extends object>(props: AdvancedDataTableProps<TData>) => {
  const state = useAdvancedTable(props);
  const matchedRows = state.table.getFilteredRowModel().rows.map((r) => r.original);
  const selectedRows = state.table.getSelectedRowModel().rows.map((r) => r.original);
  const variant = props.variant ?? "default";
  const hasActiveFilters =
    state.query.length > 0 || Object.values(state.activeFacets).some((list) => list.length > 0);

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
        hasActiveFilters={hasActiveFilters}
      />
      <AdvFooter
        pageIndex={state.table.state.pagination.pageIndex}
        pageCount={state.table.getPageCount()}
        pageSize={state.table.state.pagination.pageSize}
        totalCount={matchedRows.length}
        selectedCount={selectedRows.length}
        canPrev={state.table.getCanPreviousPage()}
        canNext={state.table.getCanNextPage()}
        onPrev={() => state.table.previousPage()}
        onNext={() => state.table.nextPage()}
      />
    </div>
  );
};
