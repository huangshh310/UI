import { cn } from "@matt-ui/utils";
import type { SkeletonProps, SkeletonShape, SkeletonVariant } from "./skeleton.types.js";

const SHAPE_CLASS: Record<SkeletonShape, string> = {
  line: "h-4 w-full rounded-md",
  text: "h-3.5 w-full rounded-md",
  circle: "size-10 rounded-full",
  card: "h-28 w-full rounded-2xl",
  rounded: "h-10 w-full rounded-xl",
};

const VARIANT_CLASS: Record<SkeletonVariant, string> = {
  pulse: "bg-foreground/[0.08] animate-pulse motion-reduce:animate-none dark:bg-foreground/[0.12]",
  shimmer:
    "bg-foreground/[0.07] dark:bg-foreground/[0.10] after:pointer-events-none after:absolute after:inset-0 after:animate-[pulse_1.5s_ease-in-out_infinite] after:bg-gradient-to-r after:from-transparent after:via-card/85 after:to-transparent dark:after:via-foreground/[0.14] motion-reduce:after:animate-none",
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
    data-shape={shape}
    className={cn(
      "relative overflow-hidden",
      SHAPE_CLASS[shape],
      VARIANT_CLASS[variant],
      className,
    )}
    {...props}
  />
);
