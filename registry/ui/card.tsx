// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type HTMLAttributes } from "react";

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
export type CardVariant = "default" | "elevated" | "interactive" | "glass" | "subtle";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 视觉层级变体 */
  variant?: CardVariant;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** 是否使用浅灰底托盘样式并带顶部发丝分隔线 */
  muted?: boolean;
}
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
    className={cn(
      "grid auto-rows-min items-start gap-1.5 px-6 pt-6 pb-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-action]:gap-x-3",
      className,
    )}
    {...props}
  />
);

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    data-slot="card-title"
    className={cn(
      "m-0 font-sans text-[16px] leading-snug font-semibold tracking-[-0.02em] text-card-foreground",
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

export const CardAction = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="card-action"
    className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
    {...props}
  />
);

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="card-content" className={cn("px-6 py-3 text-sm", className)} {...props} />
);

export const CardFooter = ({ muted = false, className, ...props }: CardFooterProps) => (
  <div
    data-slot="card-footer"
    className={cn(
      "mt-auto flex items-center justify-between gap-2 px-6 py-4",
      muted &&
        "rounded-b-[21px] border-t border-solid border-border/75 bg-muted/55 py-3.5 dark:bg-secondary/45",
      className,
    )}
    {...props}
  />
);
