"use client";

import { PricingBlock, type PricingTier } from "@matt-ui/motion";
import { useState } from "react";

const SAAS_TIERS: PricingTier[] = [
  {
    id: "hobby",
    name: "Hobby",
    description: "独立开发者与个人实验项目起步首选。",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["100 GB 全球边缘流量", "自动 HTTPS 与预览部署", "社区论坛与文档支持"],
    ctaLabel: "免费部署",
    highlightNote: "个人项目永久免费",
  },
  {
    id: "pro",
    name: "Pro",
    description: "高速迭代的产品团队与正式商业站点。",
    monthlyPrice: 24,
    yearlyPrice: 19,
    recommended: true,
    badge: "最具性价比",
    features: ["1 TB 边缘网络与函数并发", "自定义团队协作与回滚快照", "实时性能追踪与告警集成"],
    ctaLabel: "开启 14 天试用",
    highlightNote: "按席位计费 · 随时升降档",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "金融与大型组织级安全合规与专属集群。",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: ["独立边缘隔离与多活容灾", "SAML SSO 与细粒度审计日志", "99.99% SLA 与专属架构师"],
    ctaLabel: "联系企业顾问",
    highlightNote: "支持年度框架协议",
  },
];

export default function PricingBlockSpotlightDemo() {
  const [picked, setPicked] = useState("");

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <PricingBlock
        tiers={SAAS_TIERS}
        variant="spotlight"
        defaultCycle="yearly"
        currency="$"
        discountBadge="年付立省 20%"
        onSelectPlan={(id, cycle) => setPicked(`已选择 ${id}（${cycle}）`)}
      />
      {picked && <span className="font-mono text-xs text-muted-foreground">{picked}</span>}
    </div>
  );
}
