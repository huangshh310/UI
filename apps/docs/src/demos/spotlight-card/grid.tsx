"use client";

import { Badge, SpotlightCard } from "@matt-ui/ui";

const TONE_ITEMS = [
  {
    tone: "signal" as const,
    badge: "Signal",
    badgeVariant: "signal" as const,
    title: "钴蓝径向微光",
    desc: "适合主推特性与高价值入口卡片。",
  },
  {
    tone: "neutral" as const,
    badge: "Neutral",
    badgeVariant: "secondary" as const,
    title: "中性柔和聚光",
    desc: "克制低噪的中性明度反馈，深浅双主题通透自然。",
  },
  {
    tone: "emerald" as const,
    badge: "Emerald",
    badgeVariant: "success" as const,
    title: "翡翠状态高光",
    desc: "用于健康监控、在线节点与成功转化指标。",
  },
  {
    tone: "violet" as const,
    badge: "Violet",
    badgeVariant: "outline" as const,
    title: "紫罗兰灵感微光",
    desc: "契合 AI 创作工具、实验室能力与灵感画布。",
  },
];

export default function SpotlightCardGridDemo() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
      {TONE_ITEMS.map((item) => (
        <SpotlightCard
          key={item.tone}
          glowBorder
          tone={item.tone}
          padding="sm"
          className="flex flex-col gap-2"
        >
          <Badge variant={item.badgeVariant} className="w-fit">
            {item.badge}
          </Badge>
          <p className="m-0 text-sm font-semibold tracking-tight text-foreground">{item.title}</p>
          <p className="m-0 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
        </SpotlightCard>
      ))}
    </div>
  );
}
