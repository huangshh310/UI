"use client";

/**
 * DataTable 内部子部件：分层工具栏、表头排序单元格、多列加载骨架与分页底栏。
 */
import { cn } from "@matt-ui/utils";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import type { DataTableColumn } from "./data-table.types.js";

const FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const PAGE_BTN_CLASSES = cn(
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-solid border-border bg-card text-muted-foreground shadow-xs dark:border-white/12",
  "transition-colors duration-(--ui-duration-fast) hover:border-foreground/20 hover:bg-accent/60 hover:text-foreground",
  FOCUS_RING,
  "disabled:pointer-events-none disabled:opacity-40",
);

const SKELETON_WIDTHS = ["w-28", "w-24", "w-16", "w-20", "w-32"] as const;

export const ALIGN_CLASS = {
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
  <div className="relative w-full min-w-0 sm:w-56">
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
        "h-8 w-full rounded-lg border border-solid border-border bg-background pr-7 pl-8 font-sans text-xs text-foreground shadow-xs transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) placeholder:text-muted-foreground/80 hover:border-foreground/20 dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22",
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
      {description && (
        <p className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

interface TableToolbarProps {
  title?: string;
  description?: string;
  searchable: boolean;
  searchPlaceholder: string;
  query: string;
  onQueryChange: (next: string) => void;
  totalCount: number;
  toolbarActions?: ReactNode;
}

const SplitTableToolbar = (p: TableToolbarProps) => (
  <>
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-solid border-border/75 px-5 py-4 dark:border-white/10">
      <ToolbarTitle title={p.title} description={p.description} />
      <div className="flex shrink-0 flex-wrap items-center gap-2">{p.toolbarActions}</div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-solid border-border/75 px-5 py-3 dark:border-white/10">
      <TableSearchInput
        query={p.query}
        placeholder={p.searchPlaceholder}
        onChange={p.onQueryChange}
      />
      <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
        共 {p.totalCount} 条
      </span>
    </div>
  </>
);

export const TableToolbar = (p: TableToolbarProps) => {
  const hasHeading = Boolean(p.title || p.description);
  const hasControls = Boolean(p.searchable || p.toolbarActions);
  if (!hasHeading && !hasControls) return null;
  if (hasHeading && p.searchable && p.toolbarActions) return <SplitTableToolbar {...p} />;

  return (
    <div className="flex flex-col gap-3 border-b border-solid border-border/75 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
      <ToolbarTitle title={p.title} description={p.description} />
      {hasControls && (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          {p.searchable && (
            <>
              <TableSearchInput
                query={p.query}
                placeholder={p.searchPlaceholder}
                onChange={p.onQueryChange}
              />
              <span className="shrink-0 rounded-md bg-muted px-2 py-1 font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
                {p.totalCount} 条
              </span>
            </>
          )}
          {p.toolbarActions}
        </div>
      )}
    </div>
  );
};

export const SortHeaderButton = ({
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
      "group -mx-1.5 inline-flex cursor-pointer items-center gap-1 rounded-md border border-solid border-transparent bg-transparent px-1.5 py-1 font-sans text-xs font-medium text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent/70 hover:text-foreground",
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
      <ChevronsUpDown
        aria-hidden="true"
        className="size-3.5 opacity-40 transition-opacity group-hover:opacity-80"
      />
    )}
  </button>
);

export const TableLoadingRows = <TData extends object>({
  columns,
  selectable,
  cellClass,
}: {
  columns: DataTableColumn<TData>[];
  selectable: boolean;
  cellClass: string;
}) => (
  <>
    {[0, 1, 2, 3].map((rowIdx) => (
      <tr key={rowIdx}>
        {selectable && (
          <td aria-label="加载中" className="w-11 py-3 pr-2 pl-5">
            <div className="size-4 animate-pulse rounded bg-secondary/80 motion-reduce:animate-none" />
          </td>
        )}
        {columns.map((col, colIdx) => (
          <td key={col.id} className={cellClass}>
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

interface TablePaginationProps {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  totalCount: number;
  selectedCount: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const TablePagination = (props: TablePaginationProps) => {
  if (props.totalCount <= props.pageSize && props.pageCount <= 1) return null;
  const start = props.totalCount === 0 ? 0 : props.pageIndex * props.pageSize + 1;
  const end = Math.min(props.totalCount, (props.pageIndex + 1) * props.pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-solid border-border/75 bg-muted/25 px-5 py-3 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/[0.015]">
      <div className="flex items-center gap-2 tabular-nums">
        <span>
          显示{" "}
          <strong className="font-medium text-foreground">
            {start}–{end}
          </strong>{" "}
          条，共 <strong className="font-medium text-foreground">{props.totalCount}</strong> 条
        </span>
        {props.selectedCount > 0 && (
          <span className="rounded bg-signal/12 px-1.5 py-0.5 text-[11px] font-medium text-foreground">
            已选 {props.selectedCount} 项
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="pr-1.5 font-mono text-xs tabular-nums">
          第 {props.pageIndex + 1} / {Math.max(1, props.pageCount)} 页
        </span>
        <button
          type="button"
          aria-label="上一页"
          disabled={!props.canPrev}
          onClick={props.onPrev}
          className={PAGE_BTN_CLASSES}
        >
          <ChevronLeft aria-hidden="true" className="size-3.5" />
        </button>
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
