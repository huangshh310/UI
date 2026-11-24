import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "relative flex flex-col rounded-2xl border border-solid text-card-foreground",
  {
    variants: {
      variant: {
        default: "border-border bg-card shadow-xs",
        elevated: "border-border bg-card shadow-md",
        interactive:
          "border-border bg-card shadow-xs transition-[border-color,box-shadow,transform] duration-(--ui-duration-fast) ease-out hover:-translate-y-0.5 hover:border-input hover:shadow-md active:translate-y-0 motion-reduce:transform-none",
        glass: "border-border bg-card/76 shadow-sm backdrop-blur-xl backdrop-saturate-150",
        subtle: "border-transparent bg-muted/65 shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
