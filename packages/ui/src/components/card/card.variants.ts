import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "relative flex flex-col rounded-[22px] border border-solid text-card-foreground",
  {
    variants: {
      variant: {
        default: "border-border/90 bg-card shadow-xs dark:border-border/80",
        elevated: "border-border/80 bg-card shadow-md dark:border-foreground/[0.09]",
        interactive:
          "border-border/90 bg-card shadow-xs transition-[border-color,box-shadow,transform] duration-(--ui-duration-fast) ease-out hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md active:translate-y-0 motion-reduce:transform-none dark:border-border/80 dark:hover:border-foreground/22",
        glass:
          "border-border/70 bg-card/72 shadow-sm backdrop-blur-xl backdrop-saturate-150 dark:border-foreground/12 dark:bg-card/65",
        subtle: "border-border/65 bg-muted/55 shadow-none dark:border-border/70 dark:bg-muted/45",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
