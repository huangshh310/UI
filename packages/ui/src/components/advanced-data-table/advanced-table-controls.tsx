"use client";

/**
 * AdvancedDataTable 顶部控制部件：卡片标题头、单行筛选/视图工具栏、列显隐毛玻璃弹层、行密度切换与批量操作栏。
 */
import { Popover } from "@base-ui/react/popover";
import { cn } from "@matt-ui/utils";
import { Columns3, Download, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { DrawCheckbox } from "../draw-checkbox/index.js";
import type {
  AdvancedTableBatchAction,
  AdvancedTableColumn,
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

export const BatchActionBar = <TData extends object>(p: {
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
export const AdvancedHeaderBar = ({
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
export const AdvancedControlBar = <TData extends object>(p: AdvancedControlBarProps<TData>) => {
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
