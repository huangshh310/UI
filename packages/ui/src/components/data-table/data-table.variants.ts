/**
 * DataTable 的样式定义：极简发丝卡片外壳、三种行密度与单焦点环。
 */
import { cva } from "class-variance-authority";

export const dataTableShellVariants = cva("w-full overflow-hidden font-sans text-card-foreground", {
  variants: {
    variant: {
      default:
        "rounded-2xl border border-solid border-border/85 bg-card shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/10 dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]",
      minimal:
        "rounded-xl border border-solid border-border/70 bg-background shadow-none dark:border-white/10 dark:bg-card/60",
      ghost: "border-0 bg-transparent shadow-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const dataTableCellVariants = cva("text-foreground", {
  variants: {
    density: {
      compact: "px-3.5 py-2 text-xs",
      normal: "px-4 py-3 text-[13px]",
      comfortable: "px-4 py-4 text-sm",
    },
  },
  defaultVariants: {
    density: "normal",
  },
});

export const dataTableHeadCellVariants = cva(
  "font-medium whitespace-nowrap text-muted-foreground",
  {
    variants: {
      density: {
        compact: "px-3.5 py-2 text-[11px]",
        normal: "px-4 py-2.5 text-xs",
        comfortable: "px-4 py-3 text-xs",
      },
    },
    defaultVariants: {
      density: "normal",
    },
  },
);
