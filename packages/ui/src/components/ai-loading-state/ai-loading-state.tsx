"use client";

/**
 * AiLoadingState：对标 BeautifulUI 01 Loading State 的 3×3 像素矩阵智能体状态加载器，
 * 搭配扫光渐变动词与 tabular-nums 实时计时器。
 */
import { cn } from "@matt-ui/utils";
import { useEffect, useState } from "react";
import type {
  AiLoadingPattern,
  AiLoadingSize,
  AiLoadingStateProps,
} from "./ai-loading-state.types.js";
import {
  AI_LOADING_GRID_CLASS,
  aiLoadingStateVariants,
  computeMatrixOpacities,
} from "./ai-loading-state.variants.js";

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
