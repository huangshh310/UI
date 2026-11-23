"use client";

/**
 * DataTable 内部子部件：工具栏、表头排序单元格、加载骨架与分页底栏。
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

const FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const PAGE_BTN_CLASSES = cn(
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-solid border-input/55 bg-background text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/12 dark:bg-card",
  "transition-colors duration-(--ui-duration-fast) hover:border-foreground/25 hover:text-foreground",
  FOCUS_RING,
  "disabled:pointer-events-none disabled:opacity-40",
);

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

export const TableToolbar = ({
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

export const TableLoadingRows = ({ colSpan }: { colSpan: number }) => (
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

export const TablePagination = (props: TablePaginationProps) => {
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
