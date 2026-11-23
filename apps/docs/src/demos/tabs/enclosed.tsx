"use client";

import { Tabs } from "@matt-ui/ui";
import { Activity, Cpu, Database } from "lucide-react";

const PANEL_CARD =
  "rounded-xl border border-solid border-border/80 bg-card p-3.5 text-xs text-muted-foreground dark:border-white/12";

const ENCLOSED_ITEMS = [
  {
    value: "compute",
    label: "计算节点",
    icon: <Cpu className="size-3.5" />,
    badge: "4",
    content: <div className={PANEL_CARD}>东京 / 新加坡 4 个边缘节点在线，平均冷启动 38ms。</div>,
  },
  {
    value: "storage",
    label: "向量存储",
    icon: <Database className="size-3.5" />,
    content: <div className={PANEL_CARD}>已索引 128 万条文档切片，命中延迟稳定在 11ms。</div>,
  },
  {
    value: "metrics",
    label: "实时指标",
    icon: <Activity className="size-3.5" />,
    content: <div className={PANEL_CARD}>近 24 小时 P99 响应 92ms，错误率 0.00%。</div>,
  },
];

const LINE_ITEMS = [
  { value: "hour", label: "近 1 小时", content: "紧凑底线模式（sm），适合卡片头部筛选。" },
  { value: "day", label: "近 24 小时", badge: "99.9%", content: "全天稳定运行，无告警。" },
  { value: "month", label: "近 30 天", content: "月度 SLA 达标率 99.98%。" },
];

export default function TabsEnclosedDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <Tabs variant="enclosed" size="md" fullWidth defaultValue="compute" items={ENCLOSED_ITEMS} />
      <Tabs variant="line" size="sm" defaultValue="hour" items={LINE_ITEMS} />
    </div>
  );
}
