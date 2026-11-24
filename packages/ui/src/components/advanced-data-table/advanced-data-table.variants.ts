/**
 * AdvancedDataTable 的样式定义：利落发丝边框卡片、统一 32px 控件体系、毛玻璃弹层与单焦点环。
 */
import { cva } from "class-variance-authority";
import type { TableDensity } from "./advanced-data-table.types.js";

export const advancedTableShellVariants = cva(
  "w-full overflow-hidden font-sans text-card-foreground",
  {
    variants: {
      variant: {
        default:
          "rounded-xl border border-solid border-border bg-card shadow-xs dark:border-white/10 dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]",
        minimal:
          "rounded-xl border border-solid border-border/80 bg-background shadow-none dark:border-white/10 dark:bg-card/60",
        elevated:
          "rounded-xl border border-solid border-border bg-card shadow-[0_12px_32px_-12px_rgba(0,0,0,0.08),0_2px_6px_-1px_rgba(0,0,0,0.04)] dark:border-white/12 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const ADV_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

/** 工具栏统一 32px（h-8）发丝描边按钮，与 Button outline 保持一致 */
export const ADV_CTRL_BTN =
  "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-solid border-border bg-card px-2.5 font-sans text-xs font-medium whitespace-nowrap text-foreground shadow-xs transition-[background-color,border-color,color] duration-(--ui-duration-fast) hover:border-foreground/20 hover:bg-accent/60 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/12 dark:bg-card/90 dark:hover:border-white/22 dark:hover:bg-accent";

/** 分面筛选虚线触发按钮样式 */
export const ADV_FACET_BTN =
  "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-border bg-background px-2.5 font-sans text-xs font-medium whitespace-nowrap text-foreground shadow-xs transition-[background-color,border-color,color] duration-(--ui-duration-fast) hover:border-foreground/25 hover:bg-accent/55 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/15 dark:bg-card/75 dark:hover:border-white/25 dark:hover:bg-accent";

export const ADV_POPOVER_CLASSES =
  "min-w-48 origin-(--transform-origin) rounded-xl border border-solid border-border bg-popover/98 p-1.5 text-popover-foreground backdrop-blur-xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.04)] outline-none transition-[transform,opacity] duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)] data-starting-style:-translate-y-1 data-starting-style:scale-[0.97] data-starting-style:opacity-0 data-ending-style:-translate-y-0.5 data-ending-style:scale-[0.98] data-ending-style:opacity-0 dark:border-white/10 dark:bg-popover/96 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]";

export const DENSITY_CELL_PADDING: Record<TableDensity, string> = {
  compact: "py-2 text-xs",
  normal: "py-3 text-[13px]",
  comfortable: "py-3.5 text-sm",
};

const escapeCsv = (value: unknown) => {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export const buildCsv = <TData extends object>(
  columns: { header: string; accessor?: (row: TData) => unknown }[],
  rows: TData[],
): string => {
  const header = columns.map((col) => escapeCsv(col.header)).join(",");
  const lines = rows.map((row) =>
    columns.map((col) => escapeCsv(col.accessor ? col.accessor(row) : "")).join(","),
  );
  return [header, ...lines].join("\n");
};
