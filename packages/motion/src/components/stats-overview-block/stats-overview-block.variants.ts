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

export const STATS_PERIOD_COMPARE_LABEL: Record<StatsPeriod, string> = {
  "7d": "较上期",
  "30d": "较上期",
  quarter: "较上季",
};

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

/** 适配 viewBox="0 0 120 32" 的平滑三次贝塞尔趋势曲线，上下预留安全内距防裁切 */
export const STATS_SPARK_PATHS: Record<StatsPeriod, Record<MetricIconKey, string>> = {
  "7d": {
    mrr: "M0 24 C18 22, 30 25, 48 18 C66 11, 84 15, 102 9 C110 7, 115 6, 120 5",
    users: "M0 23 C16 21, 28 19, 44 20 C60 21, 74 13, 92 12 C104 11, 112 8, 120 7",
    installs: "M0 26 C20 25, 36 22, 54 19 C72 16, 88 12, 104 8 C111 6, 116 5, 120 4",
    latency: "M0 8 C20 10, 38 11, 56 14 C74 17, 92 18, 108 20 C114 21, 117 21, 120 22",
  },
  "30d": {
    mrr: "M0 26 C18 24, 32 18, 48 19 C64 20, 78 11, 96 10 C106 9, 113 6, 120 4",
    users: "M0 25 C18 22, 34 21, 50 15 C66 9, 82 12, 98 7 C108 5, 114 4, 120 4",
    installs: "M0 27 C22 25, 40 21, 58 15 C76 9, 92 7, 108 5 C114 4, 117 3, 120 3",
    latency: "M0 7 C20 10, 38 14, 56 16 C74 18, 92 21, 108 23 C114 24, 117 24, 120 25",
  },
  quarter: {
    mrr: "M0 28 C20 25, 34 21, 52 16 C70 11, 86 9, 104 6 C112 5, 116 4, 120 3",
    users: "M0 27 C18 26, 36 18, 54 14 C72 10, 88 8, 106 5 C113 4, 116 4, 120 3",
    installs: "M0 28 C24 27, 44 22, 64 14 C84 6, 98 5, 112 4 C116 3, 118 3, 120 3",
    latency: "M0 6 C22 10, 40 16, 60 19 C80 22, 96 24, 110 26 C115 26, 118 27, 120 27",
  },
};

export const STATS_GRID_CLASS: Record<StatsOverviewColumns, string> = {
  2: "grid-cols-1 @md:grid-cols-2",
  4: "grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-4",
};

/**
 * bento 变体通过外层 bg-border + gap-px + overflow-hidden 形成 1px 发丝内分割线，
 * 无论 1/2/4 列都能保持无缝对齐，不产生多余外边或双倍边框。
 */
export const STATS_WRAPPER_CLASS: Record<StatsOverviewVariant, string> = {
  cards: "gap-3.5",
  bento:
    "gap-px overflow-hidden rounded-xl border border-solid border-border bg-border shadow-xs dark:border-white/10 dark:bg-white/10",
  minimal: "gap-3",
};

export const STATS_CARD_CLASS: Record<StatsOverviewVariant, string> = {
  cards:
    "rounded-xl border border-solid border-border bg-card shadow-xs transition-[border-color,box-shadow] duration-(--ui-duration-fast) hover:border-foreground/18 dark:border-white/10 dark:hover:border-white/20",
  bento:
    "bg-card transition-colors duration-(--ui-duration-fast) hover:bg-muted/40 dark:hover:bg-white/[0.03]",
  minimal:
    "rounded-xl border border-solid border-transparent bg-muted/55 transition-colors duration-(--ui-duration-fast) hover:border-border hover:bg-muted/80 dark:bg-muted/45 dark:hover:border-white/10 dark:hover:bg-muted/65",
};

export const STATS_TREND_BADGE_CLASS: Record<MetricTrendTone, string> = {
  positive:
    "border-emerald-600/20 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/15 dark:text-emerald-300",
  warning:
    "border-amber-600/20 bg-amber-500/10 text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/15 dark:text-amber-200",
  negative:
    "border-rose-600/20 bg-rose-500/10 text-rose-800 dark:border-rose-400/20 dark:bg-rose-500/15 dark:text-rose-300",
};

export const STATS_SPARK_TONE_CLASS: Record<MetricTrendTone, string> = {
  positive: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  negative: "text-rose-600 dark:text-rose-400",
};

export const STATS_BAR_TONE_CLASS: Record<MetricTrendTone, string> = {
  positive: "bg-signal/85 dark:bg-signal",
  warning: "bg-amber-500/85 dark:bg-amber-400",
  negative: "bg-destructive/85 dark:bg-destructive",
};
