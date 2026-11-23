import { cva } from "class-variance-authority";

export const emptyStateVariants = cva(
  "flex w-full flex-col items-center justify-center text-center",
  {
    variants: {
      variant: {
        default: "rounded-2xl border border-solid border-transparent bg-transparent px-6 py-12",
        card: "rounded-2xl border border-solid border-border/90 bg-card px-6 py-11 shadow-xs dark:border-border/80",
        dashed: "rounded-2xl border border-dashed border-border bg-card/60 px-6 py-11",
        compact: "rounded-xl border border-dashed border-border/85 bg-muted/40 px-5 py-7",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
