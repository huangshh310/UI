/**
 * Shimmer：面向流式推理与回复等待态的微光扫掠文字与段落占位骨架。
 * 底层文本保持实色语义对比度，装饰高光层标记 aria-hidden 并自动响应减少动态效果设置。
 */
import { cn } from "@matt-ui/utils";
import type { ShimmerLinesProps, ShimmerProps } from "./shimmer.types.js";
import {
  SHIMMER_LINE_WIDTHS,
  SHIMMER_SPEED_DURATION,
  shimmerLineBarVariants,
  shimmerLinesContainerVariants,
  shimmerTextVariants,
} from "./shimmer.variants.js";

export const Shimmer = ({
  as: Tag = "span",
  speed = "normal",
  size = "xs",
  tone = "muted",
  variant = "default",
  active = true,
  className,
  children,
  ...props
}: ShimmerProps) => (
  <Tag
    data-slot="shimmer"
    data-active={active ? "true" : "false"}
    data-variant={variant}
    data-tone={tone}
    className={cn(shimmerTextVariants({ size, tone, variant }), className)}
    {...props}
  >
    <span className="relative">{children}</span>
    {active && (
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-background/75 to-transparent select-none dark:via-white/16",
          SHIMMER_SPEED_DURATION[speed],
          "motion-reduce:hidden",
        )}
      />
    )}
  </Tag>
);

export const ShimmerLines = ({
  lines = 3,
  size = "md",
  variant = "default",
  tone = "muted",
  label = "正在生成回复…",
  className,
  ...props
}: ShimmerLinesProps) => {
  const safeCount = Math.max(1, Math.min(8, lines));
  return (
    <output
      aria-busy="true"
      aria-label={label}
      data-slot="shimmer-lines"
      data-variant={variant}
      className={cn(shimmerLinesContainerVariants({ size, variant }), className)}
      {...props}
    >
      {Array.from({ length: safeCount }, (_, idx) => (
        <span
          key={idx}
          data-slot="shimmer-line"
          aria-hidden="true"
          className={cn(
            shimmerLineBarVariants({ size, tone }),
            SHIMMER_LINE_WIDTHS[idx % SHIMMER_LINE_WIDTHS.length],
          )}
        />
      ))}
    </output>
  );
};
