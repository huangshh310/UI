import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex h-5.5 items-center gap-1.5 border border-solid px-2 font-sans text-[11px] font-medium leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground",
        secondary: "border-border/60 bg-secondary text-secondary-foreground",
        outline: "border-border bg-background text-muted-foreground dark:bg-card",
        signal: "border-signal bg-signal text-signal-foreground",
        success: "border-emerald-600/25 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
        warning: "border-amber-600/25 bg-amber-500/12 text-amber-800 dark:text-amber-300",
        destructive: "border-destructive/25 bg-destructive/10 text-destructive",
      },
      shape: {
        pill: "rounded-full",
        tag: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "secondary",
      shape: "pill",
    },
  },
);
