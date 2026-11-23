"use client";

/**
 * StatsOverviewBlock：组合 NumberFlow 滚动数字、全宽平滑面积微图与周期分段切换的业务 KPI 概览区块。
 */
import { cn } from "@matt-ui/utils";
import { Activity, ArrowDownRight, ArrowUpRight, Layers, TrendingUp, Users } from "lucide-react";
import { useId, useState, type ComponentType } from "react";
import { NumberFlow } from "../number-flow/index.js";
import type {
  StatsOverviewBlockProps,
  StatsOverviewVariant,
  StatsPeriod,
} from "./stats-overview-block.types.js";
import {
  STATS_BAR_TONE_CLASS,
  STATS_CARD_CLASS,
  STATS_GRID_CLASS,
  STATS_METRICS_BY_PERIOD,
  STATS_PERIOD_COMPARE_LABEL,
  STATS_PERIOD_OPTIONS,
  STATS_SPARK_PATHS,
  STATS_SPARK_TONE_CLASS,
  STATS_TREND_BADGE_CLASS,
  STATS_WRAPPER_CLASS,
  type MetricIconKey,
  type MetricTrendTone,
  type StatsMetricItem,
} from "./stats-overview-block.variants.js";

const METRIC_ICONS: Record<MetricIconKey, ComponentType<{ className?: string }>> = {
  mrr: TrendingUp,
  users: Users,
  installs: Layers,
  latency: Activity,
};

/** 独立全宽平滑面积微图，配合 non-scaling-stroke 保证任意列宽下零溢出且线条匀称 */
const AreaSparkline = ({ path, tone }: { path: string; tone: MetricTrendTone }) => {
  const gradId = useId();
  const areaPath = `${path} L120 32 L0 32 Z`;
  return (
    <div className="w-full overflow-hidden">
      <svg
        aria-hidden="true"
        viewBox="0 0 120 32"
        preserveAspectRatio="none"
        className={cn("block h-8 w-full overflow-hidden", STATS_SPARK_TONE_CLASS[tone])}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

const PeriodSwitcher = ({
  period,
  onSelect,
}: {
  period: StatsPeriod;
  onSelect: (next: StatsPeriod) => void;
}) => (
  <fieldset
    aria-label="统计周期"
    className="m-0 inline-flex h-8 items-center gap-0.5 rounded-lg border border-solid border-border bg-muted/70 p-0.5 dark:border-white/10 dark:bg-muted/60"
  >
    {STATS_PERIOD_OPTIONS.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        aria-pressed={period === id}
        onClick={() => onSelect(id)}
        className={cn(
          "inline-flex h-full cursor-pointer items-center justify-center rounded-md border-0 px-2.5 font-sans text-xs font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
          period === id
            ? "bg-card text-foreground shadow-xs"
            : "bg-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        {label}
      </button>
    ))}
  </fieldset>
);

const MetricValueRow = ({ item }: { item: StatsMetricItem }) => {
  const TrendIcon = item.direction === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <div className="flex min-w-0 flex-col items-start gap-1.5">
      <NumberFlow
        value={item.value}
        prefix={item.prefix}
        suffix={item.suffix}
        format={{ maximumFractionDigits: 0 }}
        className="text-2xl font-semibold tracking-tight text-foreground tabular-nums"
      />
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-0.5 rounded-md border border-solid px-1.5 py-0.5 font-mono text-[11px] leading-tight font-medium tabular-nums",
          STATS_TREND_BADGE_CLASS[item.tone],
        )}
      >
        <TrendIcon aria-hidden="true" className="size-3" />
        <span>{item.delta}</span>
      </span>
    </div>
  );
};

const MetricGoalFooter = ({
  item,
  compareLabel,
}: {
  item: StatsMetricItem;
  compareLabel: string;
}) => (
  <div className="flex flex-col gap-1.5 border-t border-solid border-border/70 pt-3 dark:border-white/10">
    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-(--ui-duration-normal) motion-reduce:transition-none",
          STATS_BAR_TONE_CLASS[item.tone],
        )}
        style={{ width: `${item.goalPct}%` }}
      />
    </div>
    <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground tabular-nums">
      <span className="truncate font-mono">{item.goalLabel}</span>
      <span className="shrink-0">{compareLabel}</span>
    </div>
  </div>
);

interface MetricCardProps {
  item: StatsMetricItem;
  sparkPath: string;
  compareLabel: string;
  variant: StatsOverviewVariant;
  compact: boolean;
}

const MetricCard = ({ item, sparkPath, compareLabel, variant, compact }: MetricCardProps) => {
  const Icon = METRIC_ICONS[item.id];
  return (
    <div
      data-slot="stats-metric-card"
      className={cn(
        "flex min-w-0 flex-col justify-between overflow-hidden",
        compact ? "gap-3 p-4" : "gap-3.5 p-4 @4xl:p-5",
        STATS_CARD_CLASS[variant],
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-muted-foreground">{item.label}</span>
        <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      </div>
      <MetricValueRow item={item} />
      <AreaSparkline path={sparkPath} tone={item.tone} />
      {!compact && <MetricGoalFooter item={item} compareLabel={compareLabel} />}
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
  const sparkMap = STATS_SPARK_PATHS[period];
  const compareLabel = STATS_PERIOD_COMPARE_LABEL[period];

  const handleSelectPeriod = (next: StatsPeriod) => {
    setPeriod(next);
    onPeriodChange?.(next);
  };

  return (
    <div
      data-slot="stats-overview-block"
      data-variant={variant}
      className={cn("@container flex w-full flex-col gap-4", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 text-base font-semibold tracking-tight text-foreground">{title}</p>
          <p className="m-0 mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <PeriodSwitcher period={period} onSelect={handleSelectPeriod} />
      </div>
      <div className={cn("grid", STATS_GRID_CLASS[columns], STATS_WRAPPER_CLASS[variant])}>
        {metrics.map((item) => (
          <MetricCard
            key={item.id}
            item={item}
            sparkPath={sparkMap[item.id]}
            compareLabel={compareLabel}
            variant={variant}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
};
