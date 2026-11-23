import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "flex flex-col rounded-[22px] border border-solid border-border/90 bg-card text-card-foreground",
  {
    variants: {
      variant: {
        default: "shadow-xs",
        elevated: "shadow-md",
        interactive:
          "shadow-xs transition-[border-color,box-shadow,transform] duration-(--ui-duration-fast) hover:-translate-y-0.5 hover:border-foreground/18 hover:shadow-md motion-reduce:transform-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
