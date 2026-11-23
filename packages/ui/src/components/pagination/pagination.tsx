"use client";

/**
 * Pagination：语义化分页导航，支持 default / minimal / pills 变体、三档尺寸、省略号与首尾页快捷跳转。
 */
import { cn } from "@matt-ui/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import type { ReactNode } from "react";
import type { PaginationProps, PaginationSize, PaginationVariant } from "./pagination.types.js";
import {
  paginationDotsVariants,
  paginationNavButtonVariants,
  paginationPageButtonVariants,
} from "./pagination.variants.js";

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

const PageToken = ({
  token,
  current,
  variant,
  size,
  onPick,
}: {
  token: number | "dots";
  current: number;
  variant: PaginationVariant;
  size: PaginationSize;
  onPick: (page: number) => void;
}) => {
  if (token === "dots") {
    return (
      <span aria-hidden="true" className={paginationDotsVariants({ size })}>
        <MoreHorizontal className="size-3.5" />
      </span>
    );
  }
  const active = token === current;
  return (
    <button
      type="button"
      aria-label={`第 ${token} 页`}
      aria-current={active ? "page" : undefined}
      onClick={() => onPick(token)}
      className={paginationPageButtonVariants({ variant, size, active })}
    >
      {token}
    </button>
  );
};

const NavControl = ({
  ariaLabel,
  disabled,
  className,
  onClick,
  children,
}: {
  ariaLabel?: string;
  disabled: boolean;
  className: string;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={onClick}
    className={className}
  >
    {children}
  </button>
);

const PageNumbers = ({
  variant,
  size,
  current,
  safeTotal,
  siblingCount,
  onPageChange,
}: {
  variant: PaginationVariant;
  size: PaginationSize;
  current: number;
  safeTotal: number;
  siblingCount: number;
  onPageChange: (page: number) => void;
}) => {
  if (variant === "minimal") {
    return (
      <span
        aria-live="polite"
        className="px-2.5 font-mono text-xs text-muted-foreground tabular-nums"
      >
        <span className="font-semibold text-foreground">{current}</span> / {safeTotal}
      </span>
    );
  }
  return (
    <>
      {buildRange(current, safeTotal, siblingCount).map((token, idx) => (
        <PageToken
          key={token === "dots" ? `dots-${idx}` : token}
          token={token}
          current={current}
          variant={variant}
          size={size}
          onPick={onPageChange}
        />
      ))}
    </>
  );
};

const PaginationPrevGroup = ({
  showEdges,
  disabled,
  navBtn,
  onFirst,
  onPrev,
}: {
  showEdges?: boolean;
  disabled: boolean;
  navBtn: string;
  onFirst: () => void;
  onPrev: () => void;
}) => (
  <>
    {showEdges && (
      <NavControl
        ariaLabel="第一页"
        disabled={disabled}
        className={cn(navBtn, "px-2")}
        onClick={onFirst}
      >
        <ChevronsLeft aria-hidden="true" className="size-3.5" />
      </NavControl>
    )}
    <NavControl disabled={disabled} className={navBtn} onClick={onPrev}>
      <ChevronLeft aria-hidden="true" className="size-3.5" />
      <span>上一页</span>
    </NavControl>
  </>
);

const PaginationNextGroup = ({
  showEdges,
  disabled,
  navBtn,
  onNext,
  onLast,
}: {
  showEdges?: boolean;
  disabled: boolean;
  navBtn: string;
  onNext: () => void;
  onLast: () => void;
}) => (
  <>
    <NavControl disabled={disabled} className={navBtn} onClick={onNext}>
      <span>下一页</span>
      <ChevronRight aria-hidden="true" className="size-3.5" />
    </NavControl>
    {showEdges && (
      <NavControl
        ariaLabel="最后一页"
        disabled={disabled}
        className={cn(navBtn, "px-2")}
        onClick={onLast}
      >
        <ChevronsRight aria-hidden="true" className="size-3.5" />
      </NavControl>
    )}
  </>
);

export const Pagination = (props: PaginationProps) => {
  const { page, totalPages, onPageChange, variant = "default", size = "md" } = props;
  const safeTotal = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), safeTotal);
  const navBtn = paginationNavButtonVariants({ variant, size });

  return (
    <nav
      aria-label={props.ariaLabel ?? "分页导航"}
      data-slot="pagination"
      data-variant={variant}
      data-size={size}
      className={cn(
        "inline-flex max-w-full flex-wrap items-center justify-center gap-1",
        props.className,
      )}
    >
      <PaginationPrevGroup
        showEdges={props.showEdges}
        disabled={current <= 1}
        navBtn={navBtn}
        onFirst={() => onPageChange(1)}
        onPrev={() => onPageChange(current - 1)}
      />
      <PageNumbers
        variant={variant}
        size={size}
        current={current}
        safeTotal={safeTotal}
        siblingCount={props.siblingCount ?? 1}
        onPageChange={onPageChange}
      />
      <PaginationNextGroup
        showEdges={props.showEdges}
        disabled={current >= safeTotal}
        navBtn={navBtn}
        onNext={() => onPageChange(current + 1)}
        onLast={() => onPageChange(safeTotal)}
      />
    </nav>
  );
};
