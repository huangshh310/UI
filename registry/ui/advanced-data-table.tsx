// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AdvancedDataTable：在 TanStack Table v9 之上扩展分面筛选、列显隐（Base UI Popover）、
 * 行密度切换、批量操作栏与 CSV 导出钩子的高级数据表格。
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
import { useMemo, useState } from "react";

export type TableDensity = "compact" | "normal" | "comfortable";

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

const AdvRows = <TData extends object>({
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

const AdvFooter = ({
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
const CTRL_BTN = cn(
  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-solid border-border bg-background px-2.5 font-sans text-xs font-medium text-foreground shadow-sm dark:bg-card",
  "transition-colors duration-(--ui-duration-fast) hover:border-foreground/22 hover:bg-accent/50 outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

const DENSITIES: { id: TableDensity; label: string }[] = [
  { id: "compact", label: "紧凑" },
  { id: "normal", label: "标准" },
  { id: "comfortable", label: "宽松" },
];

const DENSITY_CELL_PADDING: Record<TableDensity, string> = {
  compact: "py-2",
  normal: "py-3",
  comfortable: "py-4",
};

const escapeCsv = (value: unknown) => {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const buildCsv = <TData,>(columns: AdvancedTableColumn<TData>[], rows: TData[]): string => {
  const header = columns.map((col) => escapeCsv(col.header)).join(",");
  const lines = rows.map((row) =>
    columns.map((col) => escapeCsv(col.accessor ? col.accessor(row) : "")).join(","),
  );
  return [header, ...lines].join("\n");
};

const DensityToggle = ({
  value,
  onChange,
}: {
  value: TableDensity;
  onChange: (next: TableDensity) => void;
}) => (
  <div className="inline-flex items-center gap-0.5 rounded-lg border border-solid border-border bg-secondary/55 p-0.5">
    {DENSITIES.map((item) => (
      <button
        key={item.id}
        type="button"
        aria-pressed={value === item.id}
        onClick={() => onChange(item.id)}
        className={cn(
          "h-7 cursor-pointer rounded-md border-0 px-2 font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
          value === item.id
            ? "bg-background text-foreground shadow-sm dark:bg-popover dark:ring-1 dark:ring-border"
            : "bg-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        {item.label}
      </button>
    ))}
  </div>
);

const ColumnVisibilityPopover = <TData,>({
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
      <Popover.Trigger className={CTRL_BTN}>
        <Columns3 aria-hidden="true" className="size-3.5 text-muted-foreground" />
        列显隐
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6} align="end" className="z-(--ui-z-popover) outline-none">
          <Popover.Popup className="min-w-40 rounded-xl border border-solid border-border bg-popover p-2.5 text-popover-foreground shadow-lg outline-none">
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

const FacetGroup = <TData,>({
  facet,
  selected,
  onToggle,
}: {
  facet: AdvancedTableFacet<TData>;
  selected: string | null | undefined;
  onToggle: (value: string) => void;
}) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <span className="text-xs font-medium text-muted-foreground">{facet.label}</span>
    {facet.options.map((opt) => {
      const active = selected === opt.value;
      return (
        <button
          key={opt.value}
          type="button"
          aria-pressed={active}
          onClick={() => onToggle(opt.value)}
          className={cn(
            "h-6 cursor-pointer rounded-full border border-solid px-2.5 font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active
              ? "border-signal/40 bg-signal/12 text-foreground"
              : "border-border bg-background text-muted-foreground hover:border-foreground/22 hover:text-foreground dark:bg-card",
          )}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

const FacetFilterBar = <TData,>({
  facets,
  activeFacets,
  onToggle,
  onReset,
}: {
  facets: AdvancedTableFacet<TData>[];
  activeFacets: Record<string, string | null>;
  onToggle: (facetId: string, optionValue: string) => void;
  onReset: () => void;
}) => {
  if (facets.length === 0) return null;
  const hasActive = Object.values(activeFacets).some(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-solid border-border/70 bg-secondary/20 px-5 py-2.5">
      {facets.map((facet) => (
        <FacetGroup
          key={facet.id}
          facet={facet}
          selected={activeFacets[facet.id]}
          onToggle={(val) => onToggle(facet.id, val)}
        />
      ))}
      {hasActive && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <X aria-hidden="true" className="size-3" />
          重置筛选
        </button>
      )}
    </div>
  );
};

const BatchActionBar = <TData,>({
  selectedRows,
  actions,
  onClear,
}: {
  selectedRows: TData[];
  actions: AdvancedTableBatchAction<TData>[];
  onClear: () => void;
}) => {
  if (selectedRows.length === 0 || actions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-solid border-signal/25 bg-signal/8 px-5 py-2.5">
      <div className="flex items-center gap-2 text-xs text-foreground">
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-signal font-mono text-[11px] font-semibold text-signal-foreground tabular-nums">
          {selectedRows.length}
        </span>
        <span className="font-medium">已选 {selectedRows.length} 项</span>
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer border-0 bg-transparent text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          取消选择
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => action.onAction(selectedRows)}
            className={cn(
              "h-7 cursor-pointer rounded-lg border border-solid px-2.5 font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
              action.tone === "destructive"
                ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/18"
                : "border-border bg-background text-foreground shadow-sm hover:bg-accent dark:bg-card",
            )}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

interface AdvancedToolbarProps<TData> {
  title?: string;
  description?: string;
  query: string;
  onQueryChange: (next: string) => void;
  density: TableDensity;
  onDensityChange: (next: TableDensity) => void;
  columns: AdvancedTableColumn<TData>[];
  hiddenIds: Record<string, boolean>;
  onToggleColumn: (id: string, visible: boolean) => void;
  onExport?: () => void;
}

const AdvancedTopToolbar = <TData,>(props: AdvancedToolbarProps<TData>) => (
  <div className="flex flex-col gap-3 border-b border-solid border-border/80 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
    {(props.title || props.description) && (
      <div className="min-w-0">
        {props.title && <p className="m-0 text-sm font-semibold text-foreground">{props.title}</p>}
        {props.description && (
          <p className="m-0 mt-0.5 text-xs text-muted-foreground">{props.description}</p>
        )}
      </div>
    )}
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full sm:w-52">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          aria-label="搜索高级表格"
          value={props.query}
          onChange={(event) => props.onQueryChange(event.target.value)}
          placeholder="搜索关键字…"
          className="h-8 w-full rounded-lg border border-solid border-border bg-secondary/45 pr-3 pl-8 font-sans text-xs text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) placeholder:text-muted-foreground/80 hover:border-foreground/22 focus:border-ring focus:bg-background focus:ring-3 focus:ring-ring/20 dark:focus:bg-card"
        />
      </div>
      <DensityToggle value={props.density} onChange={props.onDensityChange} />
      <ColumnVisibilityPopover
        columns={props.columns}
        hiddenIds={props.hiddenIds}
        onToggle={props.onToggleColumn}
      />
      {props.onExport && (
        <button type="button" onClick={props.onExport} className={CTRL_BTN}>
          <Download aria-hidden="true" className="size-3.5 text-muted-foreground" />
          导出 CSV
        </button>
      )}
    </div>
  </div>
);
const applyFacets = <TData,>(
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

const initHidden = <TData,>(columns: AdvancedTableColumn<TData>[]) =>
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
    className="w-full overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
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
          padClass={DENSITY_CELL_PADDING[state.density]}
          emptyMessage={props.emptyMessage ?? "暂无匹配记录"}
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

  return (
    <div
      data-slot="advanced-data-table"
      className={cn(
        "w-full overflow-hidden rounded-[22px] border border-solid border-border/85 bg-card font-sans text-card-foreground shadow-md",
        props.className,
      )}
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
