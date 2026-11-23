/**
 * AdvancedDataTable 的样式定义：极简发丝卡片、毛玻璃列控制弹层与单焦点环。
 */
import { cva } from "class-variance-authority";
import type { TableDensity } from "./advanced-data-table.types.js";

export const advancedTableShellVariants = cva(
  "w-full overflow-hidden font-sans text-card-foreground",
  {
    variants: {
      variant: {
        default:
          "rounded-2xl border border-solid border-border/85 bg-card shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/10 dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]",
        minimal:
          "rounded-xl border border-solid border-border/70 bg-background shadow-none dark:border-white/10 dark:bg-card/60",
        elevated:
          "rounded-2xl border border-solid border-border/80 bg-card shadow-[0_12px_32px_-10px_rgba(0,0,0,0.1),0_2px_6px_-1px_rgba(0,0,0,0.04)] dark:border-white/12 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const ADV_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const ADV_CTRL_BTN =
  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-solid border-input/55 bg-background px-2.5 font-sans text-xs font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors duration-(--ui-duration-fast) hover:border-foreground/25 hover:bg-accent/50 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/12 dark:bg-card dark:hover:border-white/22";

export const ADV_POPOVER_CLASSES =
  "min-w-44 origin-(--transform-origin) rounded-xl border border-solid border-border/80 bg-popover/96 p-2.5 text-popover-foreground backdrop-blur-xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.04)] outline-none transition-[transform,opacity] duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)] data-starting-style:-translate-y-1 data-starting-style:scale-[0.97] data-starting-style:opacity-0 data-ending-style:-translate-y-0.5 data-ending-style:scale-[0.98] data-ending-style:opacity-0 dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]";

export const DENSITY_CELL_PADDING: Record<TableDensity, string> = {
  compact: "py-2 text-xs",
  normal: "py-3 text-[13px]",
  comfortable: "py-4 text-sm",
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
