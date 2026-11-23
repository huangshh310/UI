import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex h-6 items-center gap-1.5 border border-solid px-2.5 font-sans text-[11px] font-medium leading-none tracking-[-0.005em] whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border bg-card text-muted-foreground",
        signal: "border-transparent bg-signal text-signal-foreground",
        success: "border-emerald-600/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
        warning: "border-amber-600/20 bg-amber-500/12 text-amber-800 dark:text-amber-300",
        destructive: "border-rose-600/20 bg-rose-500/10 text-rose-800 dark:text-rose-300",
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
