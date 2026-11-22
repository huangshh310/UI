import { cn } from "@matt-ui/utils";
import type { SkeletonProps, SkeletonShape } from "./skeleton.types.js";

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
      "relative overflow-hidden bg-secondary/85",
      SHAPE_CLASS[shape],
      variant === "pulse"
        ? "animate-pulse motion-reduce:animate-none"
        : "after:absolute after:inset-0 after:-translate-x-full after:animate-[pulse_1.6s_ease-in-out_infinite] after:bg-gradient-to-r after:from-transparent after:via-background/55 after:to-transparent motion-reduce:after:animate-none",
      className,
    )}
    {...props}
  />
);
