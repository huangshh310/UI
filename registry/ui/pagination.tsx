// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface PaginationProps {
  /** 当前页码（从 1 开始） */
  page: number;
  /** 总页数 */
  totalPages: number;
  /** 切换页码回调 */
  onPageChange: (page: number) => void;
  /** 当前页两侧各展示几个页码 */
  siblingCount?: number;
  /** 导航区域无障碍名称 */
  ariaLabel?: string;
  /** 自定义类名 */
  className?: string;
}
const buildRange = (page: number, total: number, siblings: number): (number | "dots")[] => {
  if (total <= siblings * 2 + 5) return Array.from({ length: total }, (_, i) => i + 1);
  const left = Math.max(page - siblings, 2);
  const right = Math.min(page + siblings, total - 1);
  const list: (number | "dots")[] = [1];
  if (left > 2) list.push("dots");
  for (let i = left; i <= right; i += 1) list.push(i);
  if (right < total - 1) list.push("dots");
  list.push(total);
  return list;
};

const NAV_BTN = cn(
  "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border border-solid border-transparent px-2 font-sans text-xs font-medium text-muted-foreground",
  "transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40 outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

const PageToken = ({
  token,
  current,
  onPick,
}: {
  token: number | "dots";
  current: number;
  onPick: (page: number) => void;
}) => {
  if (token === "dots") {
    return (
      <span
        aria-hidden="true"
        className="inline-flex size-8 shrink-0 items-center justify-center text-muted-foreground"
      >
        <MoreHorizontal className="size-3.5" />
      </span>
    );
  }
  return (
    <button
      type="button"
      aria-label={`第 ${token} 页`}
      aria-current={token === current ? "page" : undefined}
      onClick={() => onPick(token)}
      className={cn(
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-solid font-mono text-xs tabular-nums transition-colors duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
        token === current
          ? "border-border bg-background font-semibold text-foreground shadow-sm dark:bg-card"
          : "border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {token}
    </button>
  );
};

export const Pagination = ({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  ariaLabel = "分页导航",
  className,
}: PaginationProps) => {
  const safeTotal = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), safeTotal);
  const tokens = buildRange(current, safeTotal, siblingCount);

  return (
    <nav
      aria-label={ariaLabel}
      data-slot="pagination"
      className={cn(
        "inline-flex max-w-full flex-wrap items-center justify-center gap-1",
        className,
      )}
    >
      <button
        type="button"
        disabled={current <= 1}
        onClick={() => onPageChange(current - 1)}
        className={NAV_BTN}
      >
        <ChevronLeft aria-hidden="true" className="size-3.5" />
        <span>上一页</span>
      </button>
      {tokens.map((token, idx) => (
        <PageToken
          key={token === "dots" ? `dots-${idx}` : token}
          token={token}
          current={current}
          onPick={onPageChange}
        />
      ))}
      <button
        type="button"
        disabled={current >= safeTotal}
        onClick={() => onPageChange(current + 1)}
        className={NAV_BTN}
      >
        <span>下一页</span>
        <ChevronRight aria-hidden="true" className="size-3.5" />
      </button>
    </nav>
  );
};
