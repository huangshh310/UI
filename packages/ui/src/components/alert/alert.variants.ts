import { cva } from "class-variance-authority";

export const alertVariants = cva(
  "relative flex items-start gap-3 rounded-xl border border-solid px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        neutral: "border-border bg-card text-foreground",
        info: "border-signal/25 bg-signal/6 text-foreground [&_[data-slot=alert-icon]]:text-signal",
        success:
          "border-emerald-600/25 bg-emerald-600/6 text-foreground [&_[data-slot=alert-icon]]:text-emerald-600 dark:[&_[data-slot=alert-icon]]:text-emerald-400",
        warning:
          "border-amber-600/25 bg-amber-500/8 text-foreground [&_[data-slot=alert-icon]]:text-amber-700 dark:[&_[data-slot=alert-icon]]:text-amber-400",
        destructive:
          "border-destructive/25 bg-destructive/6 text-foreground [&_[data-slot=alert-icon]]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);
