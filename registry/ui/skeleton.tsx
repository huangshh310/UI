// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

export type SkeletonVariant = "pulse" | "shimmer";
export type SkeletonShape = "line" | "circle" | "card";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** 动画形态 */
  variant?: SkeletonVariant;
  /** 预设几何形态 */
  shape?: SkeletonShape;
}
const SHAPE_CLASS: Record<SkeletonShape, string> = {
  line: "h-4 w-full rounded-md",
  circle: "size-10 rounded-full",
  card: "h-28 w-full rounded-xl",
};

export const Skeleton = ({
  variant = "pulse",
  shape = "line",
  className,
  ...props
}: SkeletonProps) => (
  <div
    aria-hidden="true"
    data-slot="skeleton"
    data-variant={variant}
    className={cn(
      "relative overflow-hidden bg-foreground/[0.08] dark:bg-foreground/[0.12]",
      SHAPE_CLASS[shape],
      variant === "pulse"
        ? "animate-pulse motion-reduce:animate-none"
        : "after:absolute after:inset-0 after:-translate-x-full after:animate-[pulse_1.6s_ease-in-out_infinite] after:bg-gradient-to-r after:from-transparent after:via-background/55 after:to-transparent motion-reduce:after:animate-none",
      className,
    )}
    {...props}
  />
);
