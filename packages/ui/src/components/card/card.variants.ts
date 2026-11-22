import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "flex flex-col rounded-2xl border border-solid border-border bg-card text-card-foreground",
  {
    variants: {
      variant: {
        default: "shadow-sm",
        elevated: "shadow-md",
        interactive:
          "shadow-sm transition-[border-color,box-shadow,transform] duration-(--ui-duration-fast) hover:-translate-y-0.5 hover:border-foreground/22 hover:shadow-md motion-reduce:transform-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
