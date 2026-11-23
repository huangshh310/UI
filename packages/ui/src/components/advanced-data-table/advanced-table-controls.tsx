"use client";

/**
 * AdvancedDataTable 顶部控制部件：列显隐毛玻璃弹层、行密度切换、分面筛选胶囊、批量操作栏与 CSV 导出。
 */
import { Popover } from "@base-ui/react/popover";
import { cn } from "@matt-ui/utils";
import { Columns3, Download, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { DrawCheckbox } from "../draw-checkbox/index.js";
import type {
  AdvancedTableBatchAction,
  AdvancedTableColumn,
  AdvancedTableFacet,
  TableDensity,
} from "./advanced-data-table.types.js";
import {
  ADV_CTRL_BTN,
  ADV_FOCUS_RING,
  ADV_POPOVER_CLASSES,
} from "./advanced-data-table.variants.js";

const DENSITIES: { id: TableDensity; label: string }[] = [
  { id: "compact", label: "紧凑" },
  { id: "normal", label: "标准" },
  { id: "comfortable", label: "宽松" },
];

export const DensityToggle = ({
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

export const ColumnVisibilityPopover = <TData extends object>({
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

export const FacetFilterBar = <TData extends object>(p: {
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

export const BatchActionBar = <TData extends object>(p: {
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

export const AdvancedTopToolbar = <TData extends object>(props: AdvancedToolbarProps<TData>) => (
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
