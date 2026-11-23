import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border border-solid font-sans font-medium leading-none tracking-[-0.005em] whitespace-nowrap transition-colors duration-(--ui-duration-fast) [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary: "border-border/60 bg-secondary text-secondary-foreground",
        soft: "border-signal/20 bg-signal/10 text-blue-700 dark:border-signal/30 dark:bg-signal/18 dark:text-blue-300",
        outline:
          "border-border bg-card text-foreground shadow-xs dark:border-foreground/15 dark:bg-card/85",
        signal:
          "border-transparent bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]",
        success:
          "border-emerald-600/20 bg-emerald-500/12 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/16 dark:text-emerald-300",
        warning:
          "border-amber-600/25 bg-amber-500/14 text-amber-900 dark:border-amber-400/25 dark:bg-amber-500/16 dark:text-amber-200",
        destructive:
          "border-rose-600/20 bg-rose-500/12 text-rose-800 dark:border-rose-400/25 dark:bg-rose-500/16 dark:text-rose-300",
      },
      shape: {
        pill: "rounded-full",
        tag: "rounded-md",
      },
      size: {
        sm: "h-5 px-2 text-[10px]",
        md: "h-6 px-2.5 text-[11px]",
      },
    },
    defaultVariants: {
      variant: "secondary",
      shape: "pill",
      size: "md",
    },
  },
);
