// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type HTMLAttributes } from "react";

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
export type CardVariant = "default" | "elevated" | "interactive";

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
    className={cn("flex flex-col gap-1 px-6 pt-5 pb-3", className)}
    {...props}
  />
);

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    data-slot="card-title"
    className={cn(
      "m-0 font-sans text-base font-semibold tracking-tight text-foreground",
      className,
    )}
    {...props}
  />
);

export const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    data-slot="card-description"
    className={cn("m-0 text-xs leading-relaxed text-muted-foreground", className)}
    {...props}
  />
);

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="card-content" className={cn("px-6 py-2 text-sm", className)} {...props} />
);

export const CardFooter = ({ muted = false, className, ...props }: CardFooterProps) => (
  <div
    data-slot="card-footer"
    className={cn(
      "mt-auto flex items-center justify-between gap-2 px-6 py-4",
      muted && "rounded-b-2xl border-t border-solid border-border/75 bg-secondary/35 py-3",
      className,
    )}
    {...props}
  />
);
