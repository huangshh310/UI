import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border border-solid font-sans font-medium leading-none tracking-[-0.005em] whitespace-nowrap transition-colors duration-(--ui-duration-fast) [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        soft: "border-transparent bg-signal/12 text-info dark:bg-signal/22",
        outline: "border-input bg-card text-foreground",
        signal:
          "border-transparent bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]",
        success:
          "border-transparent bg-emerald-500/12 text-emerald-800 dark:bg-emerald-500/16 dark:text-emerald-300",
        warning:
          "border-transparent bg-amber-500/14 text-amber-900 dark:bg-amber-500/16 dark:text-amber-200",
        destructive:
          "border-transparent bg-rose-500/12 text-rose-800 dark:bg-rose-500/16 dark:text-rose-300",
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
