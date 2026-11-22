import PricingBlockBasicDemo from "@/demos/pricing-block/basic";
import PricingBlockCompactDemo from "@/demos/pricing-block/compact";
import type { ComponentDoc } from "./registry.types";

export const PRICING_BLOCK_DOC: ComponentDoc = {
  slug: "pricing-block",
  name: "Pricing Block",
  description: "由 StretchSwitch 计费周期开关与 NumberFlow 滚动数字组合的三档定价区块。",
  category: "blocks",
  registryName: "pricing-block",
  dependencies: ["lucide-react", "motion"],
  usage: `import { PricingBlock } from "@/components/ui/pricing-block";

<PricingBlock onSelectPlan={(id, cycle) => console.log(id, cycle)} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "三档订阅对比与年付折扣",
      description: "切换按月/按年时价格按位平滑滚动，推荐档采用克制钴蓝细边与徽章高亮。",
      file: "pricing-block/basic.tsx",
      Demo: PricingBlockBasicDemo,
    },
    {
      slug: "compact",
      name: "开源与企业定制三档方案",
      description: "通过自定义 tiers 传入差异化套餐文案、权益列表与推荐档位。",
      file: "pricing-block/compact.tsx",
      Demo: PricingBlockCompactDemo,
      directory: false,
    },
  ],
  api: [
    { name: "tiers", type: "PricingTier[]", defaultValue: "内置三档", description: "套餐配置数组" },
    {
      name: "onSelectPlan",
      type: "(tierId, cycle) => void",
      defaultValue: "—",
      description: "点击 CTA 回调",
    },
  ],
  accessibility: ["周期开关复用 StretchSwitch 完整 switch 语义，价格滚动同时提供完整无障碍读数。"],
};
