"use client";

/**
 * AdvancedDataTable 顶部控制部件：列显隐弹层、行密度切换、分面筛选胶囊、批量操作栏与 CSV 导出。
 */
import { Popover } from "@base-ui/react/popover";
import { cn } from "@matt-ui/utils";
import { Columns3, Download, Search, X } from "lucide-react";
import { DrawCheckbox } from "../draw-checkbox/index.js";
import type {
  AdvancedTableBatchAction,
  AdvancedTableColumn,
  AdvancedTableFacet,
  TableDensity,
} from "./advanced-data-table.types.js";

const CTRL_BTN = cn(
  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-solid border-border bg-background px-2.5 font-sans text-xs font-medium text-foreground shadow-sm dark:bg-card",
  "transition-colors duration-(--ui-duration-fast) hover:border-foreground/22 hover:bg-accent/50 outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

const DENSITIES: { id: TableDensity; label: string }[] = [
  { id: "compact", label: "紧凑" },
  { id: "normal", label: "标准" },
  { id: "comfortable", label: "宽松" },
];

export const DENSITY_CELL_PADDING: Record<TableDensity, string> = {
  compact: "py-2",
  normal: "py-3",
  comfortable: "py-4",
};

const escapeCsv = (value: unknown) => {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export const buildCsv = <TData,>(columns: AdvancedTableColumn<TData>[], rows: TData[]): string => {
  const header = columns.map((col) => escapeCsv(col.header)).join(",");
  const lines = rows.map((row) =>
    columns.map((col) => escapeCsv(col.accessor ? col.accessor(row) : "")).join(","),
  );
  return [header, ...lines].join("\n");
};

export const DensityToggle = ({
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

export const ColumnVisibilityPopover = <TData,>({
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

export const FacetFilterBar = <TData,>({
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

export const BatchActionBar = <TData,>({
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

export const AdvancedTopToolbar = <TData,>(props: AdvancedToolbarProps<TData>) => (
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
          className="h-8 w-full rounded-lg border border-solid border-border bg-secondary/45 pr-3 pl-8 font-sans text-xs text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) placeholder:text-muted-foreground/80 hover:border-foreground/22 focus:border-ring focus:bg-background focus:ring-1 focus:ring-ring focus:ring-inset dark:focus:bg-card"
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
