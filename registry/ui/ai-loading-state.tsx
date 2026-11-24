// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiLoadingState：对标 BeautifulUI 01 Loading State 的 3×3 像素矩阵智能体状态加载器，
 * 搭配扫光渐变动词与 tabular-nums 实时计时器。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type ComponentProps, useEffect, useState } from "react";

export const aiLoadingStateVariants = cva(
  "inline-flex items-center font-sans tracking-tight select-none",
  {
    variants: {
      variant: {
        inline: "",
        pill: "rounded-full border border-solid border-border bg-card/90 shadow-xs dark:border-white/10 dark:bg-card/80",
      },
      size: {
        sm: "gap-2 text-xs",
        md: "gap-2.5 text-[13px]",
        lg: "gap-3 text-sm",
      },
    },
    compoundVariants: [
      { variant: "pill", size: "sm", className: "px-2.5 py-1" },
      { variant: "pill", size: "md", className: "px-3.5 py-1.5" },
      { variant: "pill", size: "lg", className: "px-4 py-2" },
    ],
    defaultVariants: {
      variant: "inline",
      size: "md",
    },
  },
);

export const AI_LOADING_GRID_CLASS: Record<AiLoadingSize, string> = {
  sm: "size-3 gap-[1.5px]",
  md: "size-3.5 gap-[2px]",
  lg: "size-4 gap-[2px]",
};

/** 3×3 网格外圈顺时针索引顺序 */
const ORBIT_RING = [0, 1, 2, 5, 8, 7, 6, 3] as const;

/** 计算 3×3 矩阵中每个单元在当前节拍下的亮度（0.16 – 1） */
export const computeMatrixOpacities = (
  pattern: AiLoadingPattern,
  step: number,
  paused: boolean,
): number[] => {
  if (paused) return [0.35, 0.75, 0.35, 0.75, 1, 0.75, 0.35, 0.75, 0.35];

  if (pattern === "orbit") {
    const out = Array<number>(9).fill(0.14);
    out[4] = 0.22;
    const head = step % ORBIT_RING.length;
    out[ORBIT_RING[head]!] = 1;
    out[ORBIT_RING[(head + 7) % 8]!] = 0.58;
    out[ORBIT_RING[(head + 6) % 8]!] = 0.28;
    return out;
  }

  if (pattern === "surfer") {
    const wave = step % 6;
    return Array.from({ length: 9 }, (_, i) => {
      const diag = Math.floor(i / 3) + (i % 3);
      const dist = Math.abs(diag - wave);
      if (dist === 0) return 1;
      if (dist === 1) return 0.52;
      return 0.16;
    });
  }

  if (pattern === "dots") {
    const order = [0, 4, 8, 2, 6, 1, 7, 3, 5];
    const activeA = order[step % 9]!;
    const activeB = order[(step + 3) % 9]!;
    const activeC = order[(step + 6) % 9]!;
    return Array.from({ length: 9 }, (_, i) => {
      if (i === activeA) return 1;
      if (i === activeB) return 0.62;
      if (i === activeC) return 0.34;
      return 0.14;
    });
  }

  // drive：上下对称驱动推演节奏
  const phase = step % 4;
  const colBright = [
    phase === 0 ? 1 : 0.24,
    phase === 1 || phase === 3 ? 0.95 : 0.32,
    phase === 2 ? 1 : 0.24,
  ];
  return Array.from({ length: 9 }, (_, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const centerBoost = row === 1 ? 0.16 : 0;
    return Math.min(1, colBright[col]! + centerBoost);
  });
};
/** 3×3 像素矩阵加载器的 4 种经典运动编排（对标 BeautifulUI 01 Loading State） */
export type AiLoadingPattern = "drive" | "dots" | "orbit" | "surfer";

/** 展示形态：inline 无框内联、pill 发丝圆胶囊 */
export type AiLoadingVariant = "inline" | "pill";

/** 尺寸阶梯 */
export type AiLoadingSize = "sm" | "md" | "lg";

export interface AiLoadingStateProps extends Omit<ComponentProps<"output">, "children"> {
  /** 像素矩阵编排模式，默认 "drive" */
  pattern?: AiLoadingPattern;
  /** 外观变体，默认 "inline" */
  variant?: AiLoadingVariant;
  /** 尺寸大小，默认 "md" */
  size?: AiLoadingSize;
  /** 状态动词文案，默认 "思考中" */
  label?: string;
  /** 是否展示实时耗时计时器，默认 true */
  showElapsed?: boolean;
  /** 受控耗时秒数；省略时自动从 0.0s 实时递增 */
  elapsedSeconds?: number;
  /** 暂停动画与计时，默认 false */
  paused?: boolean;
}
const useMatrixTick = (paused: boolean) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setStep((n) => (n + 1) % 36), 130);
    return () => window.clearInterval(id);
  }, [paused]);
  return step;
};

const useElapsedTimer = (enabled: boolean, controlled: number | undefined, paused: boolean) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!enabled || controlled !== undefined || paused) return;
    const start = performance.now();
    const id = window.setInterval(() => {
      setElapsed((performance.now() - start) / 1000);
    }, 100);
    return () => window.clearInterval(id);
  }, [enabled, controlled, paused]);
  return controlled ?? elapsed;
};

const PixelMatrixIcon = ({
  pattern,
  size,
  step,
  paused,
}: {
  pattern: AiLoadingPattern;
  size: AiLoadingSize;
  step: number;
  paused: boolean;
}) => {
  const opacities = computeMatrixOpacities(pattern, step, paused);
  return (
    <span
      aria-hidden="true"
      className={cn("grid shrink-0 grid-cols-3 grid-rows-3", AI_LOADING_GRID_CLASS[size])}
    >
      {opacities.map((opacity, idx) => (
        <span
          key={idx}
          data-slot="ai-loading-cell"
          className="rounded-[1px] bg-foreground"
          style={{ opacity }}
        />
      ))}
    </span>
  );
};

export const AiLoadingState = ({
  pattern = "drive",
  variant = "inline",
  size = "md",
  label = "思考中",
  showElapsed = true,
  elapsedSeconds,
  paused = false,
  className,
  ...props
}: AiLoadingStateProps) => {
  const step = useMatrixTick(paused);
  const seconds = useElapsedTimer(showElapsed, elapsedSeconds, paused);

  return (
    <output
      data-slot="ai-loading-state"
      data-pattern={pattern}
      data-variant={variant}
      aria-live="polite"
      className={cn(aiLoadingStateVariants({ variant, size }), className)}
      {...props}
    >
      <PixelMatrixIcon pattern={pattern} size={size} step={step} paused={paused} />
      <span className="font-medium text-foreground">{label}</span>
      {showElapsed && (
        <span
          data-slot="ai-loading-elapsed"
          className="font-mono text-[0.9em] text-muted-foreground tabular-nums"
        >
          {seconds.toFixed(1)}s
        </span>
      )}
    </output>
  );
};
