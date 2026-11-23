/**
 * Pagination 的样式定义：支持 default / minimal / pills 三种风格与 sm / md / lg 尺寸。
 */
import { cva } from "class-variance-authority";

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
