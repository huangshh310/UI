// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Shimmer：面向流式推理与回复等待态的真实水平流光扫掠文字与段落占位骨架。
 * 底层文本保持实色语义对比度，装饰扫光层标记 aria-hidden 并通过 Web Animations API 驱动，
 * 自动响应 prefers-reduced-motion 与无动画运行环境。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
} from "react";

/** 扫光动画时长（毫秒），供 Web Animations API 直接驱动 */
export const SHIMMER_SPEED_MS: Record<ShimmerSpeed, number> = {
  slow: 2800,
  normal: 1800,
  fast: 1100,
};

/** 扫光装饰层按语义色调区分的线性渐变高光带 */
export const SHIMMER_SWEEP_GRADIENT: Record<ShimmerTone, string> = {
  muted: "linear-gradient(110deg, transparent 28%, var(--ui-foreground) 50%, transparent 72%)",
  foreground:
    "linear-gradient(110deg, transparent 28%, color-mix(in oklab, var(--ui-background) 78%, transparent) 50%, transparent 72%)",
  signal:
    "linear-gradient(110deg, transparent 28%, color-mix(in oklab, var(--ui-signal-foreground) 82%, var(--ui-signal)) 50%, transparent 72%)",
};

/** 段落骨架条水平流光渐变 */
export const SHIMMER_LINE_SWEEP_GRADIENT =
  "linear-gradient(110deg, transparent 25%, color-mix(in oklab, var(--ui-background) 72%, transparent) 50%, transparent 75%)";

export const SHIMMER_LINE_WIDTHS = ["w-[88%]", "w-[74%]", "w-[60%]", "w-[81%]", "w-[48%]"] as const;

export const shimmerTextVariants = cva("relative inline-flex items-center font-sans font-medium", {
  variants: {
    size: {
      xs: "text-xs leading-5",
      sm: "text-sm leading-5",
      md: "text-base leading-6",
    },
    tone: {
      muted: "text-muted-foreground",
      foreground: "text-foreground",
      signal: "text-signal",
    },
    variant: {
      default: "",
      pill: "rounded-full border border-solid border-border bg-card px-3 py-1 shadow-xs dark:border-white/10",
    },
  },
  defaultVariants: {
    size: "xs",
    tone: "muted",
    variant: "default",
  },
});

export const shimmerLinesContainerVariants = cva("flex w-full flex-col", {
  variants: {
    size: {
      sm: "gap-2",
      md: "gap-2.5",
      lg: "gap-3",
    },
    variant: {
      default: "py-1",
      card: "rounded-xl border border-solid border-border bg-card p-4 shadow-xs dark:border-white/10",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export const shimmerLineBarVariants = cva("block rounded-full", {
  variants: {
    size: {
      sm: "h-2.5",
      md: "h-3",
      lg: "h-3.5",
    },
    tone: {
      muted: "bg-secondary dark:bg-white/10",
      subtle: "bg-muted dark:bg-white/6",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "muted",
  },
});
export type ShimmerAs = "span" | "p" | "div";
export type ShimmerSpeed = "slow" | "normal" | "fast";
export type ShimmerSize = "xs" | "sm" | "md";
export type ShimmerTone = "muted" | "foreground" | "signal";
export type ShimmerVariant = "default" | "pill";

export type ShimmerLinesSize = "sm" | "md" | "lg";
export type ShimmerLinesVariant = "default" | "card";
export type ShimmerLinesTone = "muted" | "subtle";

export interface ShimmerProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /** 渲染的语义标签，默认 span */
  as?: ShimmerAs;
  /** 微光脉冲节奏，默认 normal */
  speed?: ShimmerSpeed;
  /** 字号尺寸，默认 xs */
  size?: ShimmerSize;
  /** 文本语义色调，默认 muted */
  tone?: ShimmerTone;
  /** 展示形态：default 内联文案、pill 发丝边框胶囊，默认 default */
  variant?: ShimmerVariant;
  /** 是否处于激活扫掠态，false 时退化为普通静态文字 */
  active?: boolean;
  children: ReactNode;
}

export interface ShimmerLinesProps extends ComponentPropsWithoutRef<"output"> {
  /** 骨架行数（1–8），默认 3 */
  lines?: number;
  /** 行高与间距密度，默认 md */
  size?: ShimmerLinesSize;
  /** 外观容器：default 无框、card 发丝圆角容器，默认 default */
  variant?: ShimmerLinesVariant;
  /** 骨架条色彩明暗层次，默认 muted */
  tone?: ShimmerLinesTone;
  /** 屏幕阅读器播报的状态文案，默认「正在生成回复…」 */
  label?: string;
}
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
