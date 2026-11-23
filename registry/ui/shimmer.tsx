// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
/**
 * Shimmer：面向流式推理与回复等待态的微光扫掠文字与段落占位骨架。
 * 底层文本保持实色语义对比度，装饰高光层标记 aria-hidden 并自动响应减少动态效果设置。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

export const SHIMMER_SPEED_DURATION: Record<ShimmerSpeed, string> = {
  slow: "duration-(--ui-duration-slow)",
  normal: "duration-(--ui-duration-normal)",
  fast: "duration-(--ui-duration-fast)",
};

export const SHIMMER_LINE_WIDTHS = ["w-[88%]", "w-[74%]", "w-[60%]", "w-[81%]", "w-[48%]"] as const;

export const shimmerTextVariants = cva(
  "relative inline-block overflow-hidden font-sans font-medium",
  {
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
        pill: "rounded-full border border-solid border-border/80 bg-card/85 px-3 py-1 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-card/75",
      },
    },
    defaultVariants: {
      size: "xs",
      tone: "muted",
      variant: "default",
    },
  },
);

export const shimmerLinesContainerVariants = cva("flex w-full flex-col", {
  variants: {
    size: {
      sm: "gap-2",
      md: "gap-2.5",
      lg: "gap-3",
    },
    variant: {
      default: "py-1",
      card: "rounded-2xl border border-solid border-border/80 bg-card/80 p-4 shadow-xs dark:border-white/10 dark:bg-card/70",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export const shimmerLineBarVariants = cva(
  "block animate-pulse rounded-full motion-reduce:animate-none",
  {
    variants: {
      size: {
        sm: "h-2.5",
        md: "h-3",
        lg: "h-3.5",
      },
      tone: {
        muted: "bg-secondary/95 dark:bg-white/10",
        subtle: "bg-muted/85 dark:bg-white/7",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "muted",
    },
  },
);
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
