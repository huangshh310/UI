/**
 * Breadcrumb 的样式定义：支持 chevron / slash / pill 三种风格与 sm / md 尺寸。
 */
import { cva } from "class-variance-authority";

export const breadcrumbNavVariants = cva("font-sans", {
  variants: {
    variant: {
      chevron: "",
      slash: "",
      pill: "inline-flex max-w-full rounded-full border border-solid border-border/80 bg-card px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/12",
    },
    size: {
      sm: "text-xs",
      md: "text-[13px]",
    },
  },
  defaultVariants: {
    variant: "chevron",
    size: "md",
  },
});

export const breadcrumbLinkVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md text-muted-foreground no-underline transition-colors duration-(--ui-duration-fast) outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        chevron: "",
        slash: "",
        pill: "rounded-full px-1.5 py-0.5 hover:bg-secondary/80 dark:hover:bg-white/[0.06]",
      },
    },
    defaultVariants: {
      variant: "chevron",
    },
  },
);

export const breadcrumbCurrentVariants = cva(
  "inline-flex items-center gap-1.5 font-medium text-foreground",
  {
    variants: {
      variant: {
        chevron: "",
        slash: "",
        pill: "rounded-full bg-secondary/85 px-2 py-0.5 dark:bg-white/[0.08]",
      },
    },
    defaultVariants: {
      variant: "chevron",
    },
  },
);
