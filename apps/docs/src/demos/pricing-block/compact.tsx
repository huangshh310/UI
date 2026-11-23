"use client";

import { PricingBlock, type PricingTier } from "@matt-ui/motion";
import { useState } from "react";

const TEAM_TIERS: PricingTier[] = [
  {
    id: "open",
    name: "开源社区版",
    description: "MIT 许可，零限制商用与源码二次定制。",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["全部 71 个组件与区块源码", "浅色与深色语义 Token", "社区 Issue 支持"],
    ctaLabel: "立即使用",
    highlightNote: "永久免费开源",
  },
  {
    id: "team",
    name: "团队协作版",
    description: "包含私有 Registry 托管与设计 Token 自动同步。",
    monthlyPrice: 299,
    yearlyPrice: 239,
    recommended: true,
    badge: "团队推荐",
    features: ["私有 Registry 与访问令牌管理", "CI 自动对比度与 axe 门禁", "设计系统架构师支持"],
    ctaLabel: "开通团队版",
    highlightNote: "按年付节省 ¥720 / 年",
  },
  {
    id: "scale",
    name: "规模化定制",
    description: "面向多产品线集团的专属组件工程支持。",
    monthlyPrice: 899,
    yearlyPrice: 719,
    features: ["多品牌主题包统一发版", "专属内网私有化部署", "7×24 SLA 响应"],
    ctaLabel: "预约演示",
    highlightNote: "支持专属合同与私有化交付",
  },
];

export default function PricingBlockCompactDemo() {
  const [picked, setPicked] = useState("");

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <PricingBlock
        tiers={TEAM_TIERS}
        variant="minimal"
        compact
        onSelectPlan={(id, cycle) => setPicked(`已选择 ${id}（${cycle}）`)}
      />
      {picked && <span className="font-mono text-xs text-muted-foreground">{picked}</span>}
    </div>
  );
}
