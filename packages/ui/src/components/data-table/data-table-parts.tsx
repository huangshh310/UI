"use client";

/**
 * DataTable 内部子部件：工具栏、表头排序单元格、加载骨架与分页底栏。
 */
import { cn } from "@matt-ui/utils";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

const PAGE_BTN_CLASSES = cn(
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-solid border-border bg-background text-muted-foreground shadow-sm dark:bg-card",
  "transition-colors duration-(--ui-duration-fast) hover:border-foreground/22 hover:text-foreground",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
);

export const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const TableToolbar = ({
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

export const TableLoadingRows = ({ colSpan }: { colSpan: number }) => (
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

export const TablePagination = (props: TablePaginationProps) => {
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
