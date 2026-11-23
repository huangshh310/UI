import { cn } from "@matt-ui/utils";
import type { HTMLAttributes } from "react";
import type { CardFooterProps, CardProps } from "./card.types.js";
import { cardVariants } from "./card.variants.js";

export const Card = ({ variant = "default", className, ...props }: CardProps) => (
  <div
    data-slot="card"
    data-variant={variant}
    className={cn(cardVariants({ variant }), className)}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="card-header"
    className={cn("flex flex-col gap-1.5 px-6 pt-6 pb-3", className)}
    {...props}
  />
);

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    data-slot="card-title"
    className={cn(
      "m-0 font-sans text-[17px] leading-snug font-semibold tracking-[-0.02em] text-foreground",
      className,
    )}
    {...props}
  />
);

export const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    data-slot="card-description"
    className={cn("m-0 text-[13px] leading-relaxed text-muted-foreground", className)}
    {...props}
  />
);

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="card-content" className={cn("px-6 py-2.5 text-sm", className)} {...props} />
);

export const CardFooter = ({ muted = false, className, ...props }: CardFooterProps) => (
  <div
    data-slot="card-footer"
    className={cn(
      "mt-auto flex items-center justify-between gap-2 px-6 py-4",
      muted && "rounded-b-[22px] border-t border-solid border-border/75 bg-secondary/50 py-3.5",
      className,
    )}
    {...props}
  />
);
