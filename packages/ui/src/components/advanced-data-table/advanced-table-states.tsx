"use client";

/**
 * AdvancedDataTable 加载骨架行与空状态行子部件。
 */
import { cn } from "@matt-ui/utils";
import { Inbox } from "lucide-react";
import type { AdvancedTableColumn } from "./advanced-data-table.types.js";
import { ADV_FOCUS_RING } from "./advanced-data-table.variants.js";

const SKELETON_WIDTHS = ["w-28", "w-24", "w-16", "w-20", "w-32"] as const;

export const AdvLoadingRows = <TData extends object>({
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

export const AdvEmptyRow = ({
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
