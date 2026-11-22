// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { cn } from "@/lib/utils";
import { Progress as BaseProgress } from "@base-ui/react/progress";

export type ProgressTone = "signal" | "primary" | "success";
export type ProgressSize = "sm" | "md";

export interface ProgressProps {
  /** 当前进度值；传 null 表示不确定加载状态 */
  value: number | null;
  /** 最大值，默认 100 */
  max?: number;
  /** 顶部左侧标签 */
  label?: string;
  /** 是否在右侧展示等宽百分比读数 */
  showValue?: boolean;
  /** 指示条色调 */
  tone?: ProgressTone;
  /** 轨道高度 */
  size?: ProgressSize;
  /** 自定义容器类名 */
  className?: string;
}
const TONE_CLASS: Record<ProgressTone, string> = {
  signal: "bg-signal",
  primary: "bg-primary",
  success: "bg-emerald-600 dark:bg-emerald-400",
};

const SIZE_CLASS: Record<ProgressSize, string> = {
  sm: "h-1.5",
  md: "h-2",
};

const ProgressHeader = ({ label, pct }: { label?: string; pct: number | null }) => {
  if (!label && pct === null) return null;
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      {label ? (
        <BaseProgress.Label className="font-medium text-foreground">{label}</BaseProgress.Label>
      ) : (
        <span />
      )}
      {pct !== null && <span className="font-mono text-muted-foreground tabular-nums">{pct}%</span>}
    </div>
  );
};

export const Progress = ({
  value,
  max = 100,
  label,
  showValue = false,
  tone = "signal",
  size = "sm",
  className,
}: ProgressProps) => {
  const pct =
    showValue && value !== null
      ? Math.round((Math.min(Math.max(value, 0), max) / max) * 100)
      : null;

  return (
    <BaseProgress.Root
      value={value}
      max={max}
      data-slot="progress"
      className={cn("flex w-full flex-col gap-1.5", className)}
    >
      <ProgressHeader label={label} pct={pct} />
      <BaseProgress.Track
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-secondary",
          SIZE_CLASS[size],
        )}
      >
        <BaseProgress.Indicator
          className={cn(
            "h-full rounded-full transition-[width] duration-(--ui-duration-normal) ease-(--ui-ease-out) motion-reduce:transition-none",
            TONE_CLASS[tone],
            value === null && "w-1/3 animate-pulse motion-reduce:animate-none",
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
};
