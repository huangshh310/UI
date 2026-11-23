// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Pagination：语义化分页导航，支持 default / minimal / pills 变体、三档尺寸、省略号与首尾页快捷跳转。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { type ReactNode } from "react";

export const paginationNavButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 border border-solid font-sans font-medium whitespace-nowrap text-muted-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "rounded-lg border-transparent bg-transparent",
        minimal:
          "rounded-lg border-border/80 bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-foreground/20 dark:border-white/12 dark:bg-card",
        pills: "rounded-full border-transparent bg-transparent",
      },
      size: {
        sm: "h-7 px-2 text-xs",
        md: "h-8 px-2.5 text-xs",
        lg: "h-9.5 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const paginationPageButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center border border-solid font-mono tabular-nums transition-colors duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "rounded-lg",
        minimal: "rounded-lg",
        pills: "rounded-full",
      },
      size: {
        sm: "size-7 text-xs",
        md: "size-8 text-xs",
        lg: "size-9.5 text-sm",
      },
      active: {
        true: "",
        false:
          "border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        active: true,
        class:
          "border-border/85 bg-background font-semibold text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:border-white/15 dark:bg-card",
      },
      {
        variant: "pills",
        active: true,
        class: "border-transparent bg-primary font-semibold text-primary-foreground shadow-xs",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      active: false,
    },
  },
);

export const paginationDotsVariants = cva(
  "inline-flex shrink-0 items-center justify-center text-muted-foreground",
  {
    variants: {
      size: {
        sm: "size-7",
        md: "size-8",
        lg: "size-9.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
export type PaginationVariant = "default" | "minimal" | "pills";

export type PaginationSize = "sm" | "md" | "lg";

export interface PaginationProps {
  /** 当前页码（从 1 开始） */
  page: number;
  /** 总页数 */
  totalPages: number;
  /** 切换页码回调 */
  onPageChange: (page: number) => void;
  /** 外观变体：默认发丝页码 / 极简页码读数 / 胶囊实底 */
  variant?: PaginationVariant;
  /** 按钮尺寸规格 */
  size?: PaginationSize;
  /** 是否显示跳至首页 / 末页按钮 */
  showEdges?: boolean;
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
