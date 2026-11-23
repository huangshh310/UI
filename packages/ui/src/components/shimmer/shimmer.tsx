/**
 * Shimmer：面向流式推理与回复等待态的微光扫掠文字与段落占位骨架。
 * 底层文本保持实色语义对比度，装饰高光层标记 aria-hidden 并自动响应减少动态效果设置。
 */
import { cn } from "@matt-ui/utils";
import type { ShimmerLinesProps, ShimmerProps, ShimmerSpeed } from "./shimmer.types.js";

const SPEED_DURATION: Record<ShimmerSpeed, string> = {
  slow: "duration-(--ui-duration-slow)",
  normal: "duration-(--ui-duration-normal)",
  fast: "duration-(--ui-duration-fast)",
};

const LINE_WIDTHS = ["w-[86%]", "w-[72%]", "w-[58%]", "w-[79%]", "w-[46%]"] as const;

export const Shimmer = ({
  as: Tag = "span",
  speed = "normal",
  active = true,
  className,
  children,
  ...props
}: ShimmerProps) => (
  <Tag
    data-slot="shimmer"
    data-active={active ? "true" : "false"}
    className={cn(
      "relative inline-block font-sans text-xs font-medium text-muted-foreground",
      className,
    )}
    {...props}
  >
    <span>{children}</span>
    {active && (
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-card/55 to-transparent select-none",
          SPEED_DURATION[speed],
          "motion-reduce:hidden",
        )}
      />
    )}
  </Tag>
);

export const ShimmerLines = ({
  lines = 3,
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
      className={cn("flex w-full flex-col gap-2.5 py-1", className)}
      {...props}
    >
      {Array.from({ length: safeCount }, (_, idx) => (
        <span
          key={idx}
          data-slot="shimmer-line"
          aria-hidden="true"
          className={cn(
            "block h-3 animate-pulse rounded-full bg-secondary motion-reduce:animate-none",
            LINE_WIDTHS[idx % LINE_WIDTHS.length],
          )}
        />
      ))}
    </output>
  );
};
