"use client";

/**
 * Shimmer：面向流式推理与回复等待态的真实水平流光扫掠文字与段落占位骨架。
 * 底层文本保持实色语义对比度，装饰扫光层标记 aria-hidden 并通过 Web Animations API 驱动，
 * 自动响应 prefers-reduced-motion 与无动画运行环境。
 */
import { cn } from "@matt-ui/utils";
import { useEffect, useRef, type RefObject } from "react";
import type {
  ShimmerLinesProps,
  ShimmerLinesSize,
  ShimmerLinesTone,
  ShimmerProps,
} from "./shimmer.types.js";
import {
  SHIMMER_LINE_SWEEP_GRADIENT,
  SHIMMER_LINE_WIDTHS,
  SHIMMER_SPEED_MS,
  SHIMMER_SWEEP_GRADIENT,
  shimmerLineBarVariants,
  shimmerLinesContainerVariants,
  shimmerTextVariants,
} from "./shimmer.variants.js";

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** 使用 Web Animations API 驱动从左到右的真实背景流光扫掠 */
const useShimmerSweep = (
  ref: RefObject<HTMLSpanElement | null>,
  active: boolean,
  duration: number,
  delay = 0,
) => {
  useEffect(() => {
    const el = ref.current;
    if (!active || !el || typeof el.animate !== "function" || prefersReducedMotion()) return;
    const animation = el.animate(
      [{ backgroundPosition: "150% 0" }, { backgroundPosition: "-150% 0" }],
      { duration, delay, iterations: Infinity, easing: "linear" },
    );
    return () => animation.cancel();
  }, [ref, active, duration, delay]);
};

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
}: ShimmerProps) => {
  const sweepRef = useRef<HTMLSpanElement>(null);
  useShimmerSweep(sweepRef, active, SHIMMER_SPEED_MS[speed]);

  return (
    <Tag
      data-slot="shimmer"
      data-active={active ? "true" : "false"}
      data-variant={variant}
      data-tone={tone}
      className={cn(shimmerTextVariants({ size, tone, variant }), className)}
      {...props}
    >
      <span className="relative inline-block">
        <span>{children}</span>
        {active && (
          <span
            ref={sweepRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-clip-text text-transparent select-none motion-reduce:hidden"
            style={{
              backgroundImage: SHIMMER_SWEEP_GRADIENT[tone],
              backgroundSize: "260% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "150% 0",
            }}
          >
            {children}
          </span>
        )}
      </span>
    </Tag>
  );
};

const ShimmerLineBar = ({
  index,
  size,
  tone,
}: {
  index: number;
  size: ShimmerLinesSize;
  tone: ShimmerLinesTone;
}) => {
  const barRef = useRef<HTMLSpanElement>(null);
  useShimmerSweep(barRef, true, 1900, index * 120);

  return (
    <span
      ref={barRef}
      data-slot="shimmer-line"
      aria-hidden="true"
      className={cn(
        shimmerLineBarVariants({ size, tone }),
        SHIMMER_LINE_WIDTHS[index % SHIMMER_LINE_WIDTHS.length],
      )}
      style={{
        backgroundImage: SHIMMER_LINE_SWEEP_GRADIENT,
        backgroundSize: "240% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "150% 0",
      }}
    />
  );
};

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
        <ShimmerLineBar key={idx} index={idx} size={size} tone={tone} />
      ))}
    </output>
  );
};
