/**
 * DataTable 的样式定义：利落发丝卡片外壳、三种行密度、统一对齐基线与单焦点环。
 */
import { cva } from "class-variance-authority";

export const dataTableShellVariants = cva("w-full overflow-hidden font-sans text-card-foreground", {
  variants: {
    variant: {
      default:
        "rounded-xl border border-solid border-border bg-card shadow-xs dark:border-white/10 dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]",
      minimal:
        "rounded-xl border border-solid border-border/80 bg-background shadow-none dark:border-white/10 dark:bg-card/60",
      ghost: "border-0 bg-transparent shadow-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const dataTableCellVariants = cva("text-foreground first:pl-5 last:pr-5", {
  variants: {
    density: {
      compact: "px-3.5 py-2 text-xs",
      normal: "px-4 py-3 text-[13px]",
      comfortable: "px-4 py-3.5 text-sm",
    },
  },
  defaultVariants: {
    density: "normal",
  },
});

export const dataTableHeadCellVariants = cva(
  "font-medium whitespace-nowrap text-muted-foreground first:pl-5 last:pr-5",
  {
    variants: {
      density: {
        compact: "h-9 px-3.5 text-[11px]",
        normal: "h-10 px-4 text-xs",
        comfortable: "h-11 px-4 text-xs",
      },
    },
    defaultVariants: {
      density: "normal",
    },
  },
);
