// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * StatsOverviewBlock：组合 NumberFlow 滚动数字与周期分段切换的业务 KPI 概览区块。
 */

import { NumberFlow } from "@/components/ui/number-flow";
import { cn } from "@/lib/utils";
import { Activity, ArrowDownRight, ArrowUpRight, Layers, Users } from "lucide-react";
import { type ComponentType, useId, useState } from "react";

export type MetricTrendTone = "positive" | "warning" | "negative";

export type MetricIconKey = "mrr" | "users" | "installs" | "latency";

export interface StatsMetricItem {
  id: MetricIconKey;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta: string;
  tone: MetricTrendTone;
  direction: "up" | "down";
  goalPct: number;
  goalLabel: string;
}

export const STATS_PERIOD_OPTIONS: { id: StatsPeriod; label: string }[] = [
  { id: "7d", label: "近 7 天" },
  { id: "30d", label: "近 30 天" },
  { id: "quarter", label: "本季度" },
];

export const STATS_METRICS_BY_PERIOD: Record<StatsPeriod, StatsMetricItem[]> = {
  "7d": [
    {
      id: "mrr",
      label: "月度经常性收入",
      value: 48200,
      prefix: "¥",
      delta: "+6.4%",
      tone: "positive",
      direction: "up",
      goalPct: 72,
      goalLabel: "周目标 72%",
    },
    {
      id: "users",
      label: "活跃开发者",
      value: 3420,
      delta: "+11.2%",
      tone: "positive",
      direction: "up",
      goalPct: 81,
      goalLabel: "留存率 81%",
    },
    {
      id: "installs",
      label: "Registry 安装次数",
      value: 18640,
      delta: "+22.8%",
      tone: "positive",
      direction: "up",
      goalPct: 88,
      goalLabel: "周增长 88%",
    },
    {
      id: "latency",
      label: "P95 响应耗时",
      value: 16,
      suffix: "ms",
      delta: "-3ms",
      tone: "positive",
      direction: "down",
      goalPct: 94,
      goalLabel: "SLA 达标 94%",
    },
  ],
  "30d": [
    {
      id: "mrr",
      label: "月度经常性收入",
      value: 186500,
      prefix: "¥",
      delta: "+14.2%",
      tone: "positive",
      direction: "up",
      goalPct: 86,
      goalLabel: "月目标 86%",
    },
    {
      id: "users",
      label: "活跃开发者",
      value: 12840,
      delta: "+19.5%",
      tone: "positive",
      direction: "up",
      goalPct: 84,
      goalLabel: "留存率 84%",
    },
    {
      id: "installs",
      label: "Registry 安装次数",
      value: 74920,
      delta: "+31.4%",
      tone: "positive",
      direction: "up",
      goalPct: 92,
      goalLabel: "月增长 92%",
    },
    {
      id: "latency",
      label: "P95 响应耗时",
      value: 15,
      suffix: "ms",
      delta: "-5ms",
      tone: "positive",
      direction: "down",
      goalPct: 97,
      goalLabel: "SLA 达标 97%",
    },
  ],
  quarter: [
    {
      id: "mrr",
      label: "月度经常性收入",
      value: 542800,
      prefix: "¥",
      delta: "+38.6%",
      tone: "positive",
      direction: "up",
      goalPct: 95,
      goalLabel: "季目标 95%",
    },
    {
      id: "users",
      label: "活跃开发者",
      value: 36400,
      delta: "+42.1%",
      tone: "positive",
      direction: "up",
      goalPct: 89,
      goalLabel: "留存率 89%",
    },
    {
      id: "installs",
      label: "Registry 安装次数",
      value: 238400,
      delta: "+64.0%",
      tone: "positive",
      direction: "up",
      goalPct: 98,
      goalLabel: "季增长 98%",
    },
    {
      id: "latency",
      label: "P95 响应耗时",
      value: 14,
      suffix: "ms",
      delta: "-7ms",
      tone: "positive",
      direction: "down",
      goalPct: 99,
      goalLabel: "SLA 达标 99%",
    },
  ],
};

export const STATS_SPARK_PATHS: Record<MetricIconKey, string> = {
  mrr: "M2 24 C16 22, 24 14, 38 15 C52 16, 62 7, 78 4",
  users: "M2 23 C14 21, 28 19, 40 13 C52 7, 64 9, 78 3",
  installs: "M2 25 C18 22, 30 18, 44 12 C58 6, 68 5, 78 2",
  latency: "M2 8 C18 11, 30 13, 44 16 C58 19, 68 20, 78 22",
};

export const STATS_GRID_CLASS: Record<StatsOverviewColumns, string> = {
  2: "grid-cols-1 @md:grid-cols-2",
  4: "grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-4",
};

export const STATS_WRAPPER_CLASS: Record<StatsOverviewVariant, string> = {
  cards: "gap-4",
  bento:
    "gap-0 overflow-hidden rounded-[22px] border border-solid border-border/80 bg-card shadow-xs dark:border-white/10",
  minimal: "gap-3",
};

export const STATS_CARD_CLASS: Record<StatsOverviewVariant, string> = {
  cards:
    "rounded-[22px] border border-solid border-border/80 bg-card shadow-xs transition-[border-color,box-shadow] duration-(--ui-duration-fast) hover:border-foreground/18 hover:shadow-sm dark:border-white/10 dark:hover:border-white/20",
  bento:
    "border-b border-solid border-border/75 bg-transparent transition-colors hover:bg-secondary/25 last:border-b-0 @md:border-r @md:border-border/75 dark:border-white/10 dark:@md:border-white/10",
  minimal:
    "rounded-2xl border border-solid border-border/70 bg-secondary/35 transition-colors hover:border-border dark:border-white/10 dark:bg-secondary/25",
};

export const STATS_TREND_PILL_CLASS: Record<MetricTrendTone, string> = {
  positive:
    "border-emerald-600/20 bg-emerald-500/12 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/16 dark:text-emerald-300",
  warning:
    "border-amber-600/25 bg-amber-500/14 text-amber-900 dark:border-amber-400/25 dark:bg-amber-500/16 dark:text-amber-200",
  negative:
    "border-rose-600/20 bg-rose-500/12 text-rose-800 dark:border-rose-400/25 dark:bg-rose-500/16 dark:text-rose-300",
};

export const STATS_SPARK_TONE_CLASS: Record<MetricTrendTone, string> = {
  positive: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  negative: "text-rose-600 dark:text-rose-400",
};

export const STATS_BAR_TONE_CLASS: Record<MetricTrendTone, string> = {
  positive: "bg-foreground/85 dark:bg-foreground/90",
  warning: "bg-amber-500 dark:bg-amber-400",
  negative: "bg-destructive",
};
export type StatsPeriod = "7d" | "30d" | "quarter";

export type StatsOverviewVariant = "cards" | "bento" | "minimal";

export type StatsOverviewColumns = 2 | 4;

export interface StatsOverviewBlockProps {
  /** 默认周期 */
  defaultPeriod?: StatsPeriod;
  /** 视觉呈现变体 */
  variant?: StatsOverviewVariant;
  /** 桌面端网格列数 */
  columns?: StatsOverviewColumns;
  /** 是否启用紧凑密度 */
  compact?: boolean;
  /** 区块标题 */
  title?: string;
  /** 区块副标题 */
  description?: string;
  /** 切换周期时的回调 */
  onPeriodChange?: (period: StatsPeriod) => void;
  /** 自定义类名 */
  className?: string;
}
const METRIC_ICONS: Record<MetricIconKey, ComponentType<{ className?: string }>> = {
  mrr: ArrowUpRight,
  users: Users,
  installs: Layers,
  latency: Activity,
};

const Sparkline = ({ path, tone }: { path: string; tone: MetricTrendTone }) => {
  const gradId = useId();
  const areaPath = `${path} L78 28 L2 28 Z`;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 28"
      className={cn("h-7 w-20 shrink-0 overflow-visible", STATS_SPARK_TONE_CLASS[tone])}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
};

const PeriodSwitcher = ({
  period,
  onSelect,
}: {
  period: StatsPeriod;
  onSelect: (next: StatsPeriod) => void;
}) => (
  <div className="inline-flex items-center gap-0.5 rounded-full border border-solid border-border/80 bg-secondary/65 p-1 dark:border-white/10 dark:bg-secondary/45">
    {STATS_PERIOD_OPTIONS.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        aria-pressed={period === id}
        onClick={() => onSelect(id)}
        className={cn(
          "h-7 cursor-pointer rounded-full border-0 px-3 font-sans text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
          period === id
            ? "bg-card text-foreground shadow-xs ring-1 ring-border/70 dark:ring-white/12"
            : "bg-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        {label}
      </button>
    ))}
  </div>
);

const MetricGoalFooter = ({ item }: { item: StatsMetricItem }) => (
  <div className="flex flex-col gap-1.5 border-t border-solid border-border/70 pt-3 dark:border-white/10">
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-(--ui-duration-normal) motion-reduce:transition-none",
          STATS_BAR_TONE_CLASS[item.tone],
        )}
        style={{ width: `${item.goalPct}%` }}
      />
    </div>
    <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground tabular-nums">
      <span>{item.goalLabel}</span>
      <span>{item.goalPct}%</span>
    </div>
  </div>
);

const MetricValueRow = ({ item, compact }: { item: StatsMetricItem; compact: boolean }) => {
  const TrendIcon = item.direction === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <div className="flex items-end justify-between gap-2">
      <div className="flex flex-col gap-1.5">
        <NumberFlow
          value={item.value}
          prefix={item.prefix}
          suffix={item.suffix}
          format={{ maximumFractionDigits: 0 }}
          className={cn(
            "font-semibold tracking-tight text-foreground",
            compact ? "text-2xl" : "text-3xl",
          )}
        />
        <span
          className={cn(
            "inline-flex w-fit items-center gap-0.5 rounded-full border border-solid px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums",
            STATS_TREND_PILL_CLASS[item.tone],
          )}
        >
          <TrendIcon aria-hidden="true" className="size-3" />
          <span>{item.delta}</span>
        </span>
      </div>
      <Sparkline path={STATS_SPARK_PATHS[item.id]} tone={item.tone} />
    </div>
  );
};

const MetricCard = ({
  item,
  variant,
  compact,
}: {
  item: StatsMetricItem;
  variant: StatsOverviewVariant;
  compact: boolean;
}) => {
  const Icon = METRIC_ICONS[item.id];
  return (
    <div
      data-slot="stats-metric-card"
      className={cn(
        "flex flex-col justify-between",
        compact ? "gap-3 p-4" : "gap-4 p-5",
        STATS_CARD_CLASS[variant],
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-muted-foreground">{item.label}</span>
        <span className="inline-flex size-8 items-center justify-center rounded-xl border border-solid border-border/60 bg-secondary/75 text-foreground/80 dark:border-white/10 dark:bg-secondary/50">
          <Icon className="size-4" />
        </span>
      </div>
      <MetricValueRow item={item} compact={compact} />
      {!compact && <MetricGoalFooter item={item} />}
    </div>
  );
};

export const StatsOverviewBlock = ({
  defaultPeriod = "30d",
  variant = "cards",
  columns = 4,
  compact = false,
  title = "数据概览",
  description = "按周期查看增长与订阅健康度",
  onPeriodChange,
  className,
}: StatsOverviewBlockProps) => {
  const [period, setPeriod] = useState<StatsPeriod>(defaultPeriod);
  const metrics = STATS_METRICS_BY_PERIOD[period];

  const handleSelectPeriod = (next: StatsPeriod) => {
    setPeriod(next);
    onPeriodChange?.(next);
  };

  return (
    <div
      data-slot="stats-overview-block"
      data-variant={variant}
      className={cn("@container flex w-full flex-col gap-5", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-[17px] font-semibold tracking-tight text-foreground">{title}</p>
          <p className="m-0 mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <PeriodSwitcher period={period} onSelect={handleSelectPeriod} />
      </div>
      <div className={cn("grid", STATS_GRID_CLASS[columns], STATS_WRAPPER_CLASS[variant])}>
        {metrics.map((item) => (
          <MetricCard key={item.id} item={item} variant={variant} compact={compact} />
        ))}
      </div>
    </div>
  );
};
