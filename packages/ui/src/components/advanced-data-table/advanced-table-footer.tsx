"use client";

/**
 * AdvancedDataTable 分页底栏子部件。
 */
import { cn } from "@matt-ui/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ADV_FOCUS_RING } from "./advanced-data-table.variants.js";

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

export const AdvFooter = (props: {
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
