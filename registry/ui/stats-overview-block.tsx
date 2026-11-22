// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * StatsOverviewBlock：组合 NumberFlow 滚动数字与周期分段切换的业务 KPI 概览区块。
 */

import { NumberFlow } from "@/components/ui/number-flow";
import { cn } from "@/lib/utils";
import { Activity, ArrowUpRight, Layers, Users } from "lucide-react";
import { type ComponentType, useState } from "react";

export type StatsPeriod = "7d" | "30d" | "quarter";

export interface StatsOverviewBlockProps {
  /** 默认周期 */
  defaultPeriod?: StatsPeriod;
  /** 自定义类名 */
  className?: string;
}
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

const MetricCard = ({ item }: { item: MetricItem }) => {
  const { Icon } = item;
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-solid border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
        <span className="inline-flex size-7 items-center justify-center rounded-lg border border-solid border-border bg-secondary/50 text-foreground">
          <Icon className="size-3.5" />
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <NumberFlow
          value={item.value}
          prefix={item.prefix}
          suffix={item.suffix}
          format={{ maximumFractionDigits: 0 }}
          className="text-2xl font-semibold tracking-tight text-foreground"
        />
        <span className="rounded-full bg-signal px-2 py-0.5 font-mono text-[11px] font-medium text-signal-foreground">
          {item.delta}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-signal transition-[width] duration-(--ui-duration-normal)"
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
    <div data-slot="stats-overview-block" className={cn("flex w-full flex-col gap-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-base font-semibold tracking-tight text-foreground">核心业务指标</p>
          <p className="m-0 mt-0.5 text-xs text-muted-foreground">
            切换时间周期，观察 NumberFlow 按位滚轮平滑过渡。
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-xl border border-solid border-border bg-secondary/60 p-1">
          {PERIOD_LABELS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={period === id}
              onClick={() => setPeriod(id)}
              className={cn(
                "h-7 cursor-pointer rounded-lg border-0 px-3 font-sans text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                period === id
                  ? "bg-background text-foreground shadow-xs dark:bg-card"
                  : "bg-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item) => (
          <MetricCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
