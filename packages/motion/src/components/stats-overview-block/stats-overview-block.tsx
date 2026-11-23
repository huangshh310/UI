"use client";

/**
 * StatsOverviewBlock：组合 NumberFlow 滚动数字与周期分段切换的业务 KPI 概览区块。
 */
import { cn } from "@matt-ui/utils";
import { Activity, ArrowDownRight, ArrowUpRight, Layers, Users } from "lucide-react";
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
  STATS_PERIOD_OPTIONS,
  STATS_SPARK_PATHS,
  STATS_SPARK_TONE_CLASS,
  STATS_TREND_PILL_CLASS,
  STATS_WRAPPER_CLASS,
  type MetricIconKey,
  type MetricTrendTone,
  type StatsMetricItem,
} from "./stats-overview-block.variants.js";

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
