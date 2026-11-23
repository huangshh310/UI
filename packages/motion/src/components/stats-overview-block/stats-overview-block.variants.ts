import type {
  StatsOverviewColumns,
  StatsOverviewVariant,
  StatsPeriod,
} from "./stats-overview-block.types.js";

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
