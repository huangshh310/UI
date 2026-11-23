"use client";

/**
 * StatsOverviewBlock：组合 NumberFlow 滚动数字与周期分段切换的业务 KPI 概览区块。
 */
import { cn } from "@matt-ui/utils";
import { Activity, ArrowUpRight, Layers, Users } from "lucide-react";
import { useState, type ComponentType } from "react";
import { NumberFlow } from "../number-flow/index.js";
import type { StatsOverviewBlockProps, StatsPeriod } from "./stats-overview-block.types.js";

interface MetricItem {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta: string;
  goalPct: number;
  goalLabel: string;
  Icon: ComponentType<{ className?: string }>;
}

const PERIOD_LABELS: { id: StatsPeriod; label: string }[] = [
  { id: "7d", label: "近 7 天" },
  { id: "30d", label: "近 30 天" },
  { id: "quarter", label: "本季度" },
];

const METRICS_BY_PERIOD: Record<StatsPeriod, MetricItem[]> = {
  "7d": [
    {
      id: "mrr",
      label: "月度经常性收入",
      value: 48200,
      prefix: "¥",
      delta: "+6.4%",
      goalPct: 72,
      goalLabel: "周目标 72%",
      Icon: ArrowUpRight,
    },
    {
      id: "users",
      label: "活跃开发者",
      value: 3420,
      delta: "+11.2%",
      goalPct: 81,
      goalLabel: "留存率 81%",
      Icon: Users,
    },
    {
      id: "installs",
      label: "Registry 安装次数",
      value: 18640,
      delta: "+22.8%",
      goalPct: 88,
      goalLabel: "周增长 88%",
      Icon: Layers,
    },
    {
      id: "latency",
      label: "P95 响应耗时",
      value: 16,
      suffix: "ms",
      delta: "-3ms",
      goalPct: 94,
      goalLabel: "SLA 达标 94%",
      Icon: Activity,
    },
  ],
  "30d": [
    {
      id: "mrr",
      label: "月度经常性收入",
      value: 186500,
      prefix: "¥",
      delta: "+14.2%",
      goalPct: 86,
      goalLabel: "月目标 86%",
      Icon: ArrowUpRight,
    },
    {
      id: "users",
      label: "活跃开发者",
      value: 12840,
      delta: "+19.5%",
      goalPct: 84,
      goalLabel: "留存率 84%",
      Icon: Users,
    },
    {
      id: "installs",
      label: "Registry 安装次数",
      value: 74920,
      delta: "+31.4%",
      goalPct: 92,
      goalLabel: "月增长 92%",
      Icon: Layers,
    },
    {
      id: "latency",
      label: "P95 响应耗时",
      value: 15,
      suffix: "ms",
      delta: "-5ms",
      goalPct: 97,
      goalLabel: "SLA 达标 97%",
      Icon: Activity,
    },
  ],
  quarter: [
    {
      id: "mrr",
      label: "月度经常性收入",
      value: 542800,
      prefix: "¥",
      delta: "+38.6%",
      goalPct: 95,
      goalLabel: "季目标 95%",
      Icon: ArrowUpRight,
    },
    {
      id: "users",
      label: "活跃开发者",
      value: 36400,
      delta: "+42.1%",
      goalPct: 89,
      goalLabel: "留存率 89%",
      Icon: Users,
    },
    {
      id: "installs",
      label: "Registry 安装次数",
      value: 238400,
      delta: "+64.0%",
      goalPct: 98,
      goalLabel: "季增长 98%",
      Icon: Layers,
    },
    {
      id: "latency",
      label: "P95 响应耗时",
      value: 14,
      suffix: "ms",
      delta: "-7ms",
      goalPct: 99,
      goalLabel: "SLA 达标 99%",
      Icon: Activity,
    },
  ],
};

const SPARK_PATHS: Record<string, string> = {
  mrr: "M2 24 C16 22, 24 14, 38 15 C52 16, 62 7, 78 4",
  users: "M2 23 C14 21, 28 19, 40 13 C52 7, 64 9, 78 3",
  installs: "M2 25 C18 22, 30 18, 44 12 C58 6, 68 5, 78 2",
  latency: "M2 8 C18 11, 30 13, 44 16 C58 19, 68 20, 78 22",
};

const Sparkline = ({ path }: { path: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 80 28"
    className="h-7 w-20 shrink-0 overflow-visible text-foreground/75"
  >
    <path d={path} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const MetricCard = ({ item }: { item: MetricItem }) => {
  const { Icon } = item;
  const spark = SPARK_PATHS[item.id] ?? SPARK_PATHS.mrr ?? "";
  return (
    <div className="flex flex-col justify-between gap-4 rounded-[22px] border border-solid border-border/90 bg-card p-5 shadow-xs transition-[border-color,box-shadow] hover:border-foreground/15 hover:shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-muted-foreground">{item.label}</span>
        <span className="inline-flex size-8 items-center justify-center rounded-xl bg-secondary text-foreground/75">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <NumberFlow
            value={item.value}
            prefix={item.prefix}
            suffix={item.suffix}
            format={{ maximumFractionDigits: 0 }}
            className="text-3xl font-semibold tracking-tight text-foreground"
          />
          <span className="w-fit rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
            {item.delta}
          </span>
        </div>
        <Sparkline path={spark} />
      </div>
      <div className="flex flex-col gap-1.5 border-t border-solid border-border/70 pt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-foreground/80 transition-[width] duration-(--ui-duration-normal)"
            style={{ width: `${item.goalPct}%` }}
          />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {item.goalLabel}
        </span>
      </div>
    </div>
  );
};

export const StatsOverviewBlock = ({
  defaultPeriod = "30d",
  className,
}: StatsOverviewBlockProps) => {
  const [period, setPeriod] = useState<StatsPeriod>(defaultPeriod);
  const metrics = METRICS_BY_PERIOD[period];

  return (
    <div
      data-slot="stats-overview-block"
      className={cn("@container flex w-full flex-col gap-5", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-[17px] font-semibold tracking-tight text-foreground">数据概览</p>
          <p className="m-0 mt-0.5 text-xs text-muted-foreground">按周期查看增长与订阅健康度</p>
        </div>
        <div className="inline-flex items-center gap-0.5 rounded-full bg-secondary p-1 ring-1 ring-border/70">
          {PERIOD_LABELS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={period === id}
              onClick={() => setPeriod(id)}
              className={cn(
                "h-7 cursor-pointer rounded-full border-0 px-3 font-sans text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                period === id
                  ? "bg-card text-foreground shadow-xs"
                  : "bg-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @3xl:grid-cols-4">
        {metrics.map((item) => (
          <MetricCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
