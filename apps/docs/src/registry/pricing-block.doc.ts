import PricingBlockBasicDemo from "@/demos/pricing-block/basic";
import PricingBlockCompactDemo from "@/demos/pricing-block/compact";
import PricingBlockSpotlightDemo from "@/demos/pricing-block/spotlight";
import type { ComponentDoc } from "./registry.types";

export const PRICING_BLOCK_DOC: ComponentDoc = {
  slug: "pricing-block",
  name: "Pricing Block",
  description:
    "由 StretchSwitch 计费周期开关与 NumberFlow 滚动数字组合的三档定价区块，支持反色主推、品牌蓝聚光与极简发丝三种视觉变体。",
  category: "blocks",
  registryName: "pricing-block",
  dependencies: ["lucide-react", "motion"],
  usage: `import { PricingBlock } from "@/components/ui/pricing-block";

<PricingBlock variant="spotlight" defaultCycle="yearly" onSelectPlan={(id, cycle) => console.log(id, cycle)} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "三档订阅对比与年付折扣",
      description: "切换按月/按年时价格按位平滑滚动，推荐档采用高对比反色卡片与胶囊优惠条。",
      file: "pricing-block/basic.tsx",
      Demo: PricingBlockBasicDemo,
    },
    {
      slug: "compact",
      name: "开源与企业定制三档方案",
      description: '通过自定义 tiers、variant="minimal" 与 compact 紧凑间距展示团队定制方案。',
      file: "pricing-block/compact.tsx",
      Demo: PricingBlockCompactDemo,
      directory: false,
    },
    {
      slug: "spotlight",
      name: "品牌蓝描边聚光与美元计费",
      description:
        '使用 variant="spotlight"、defaultCycle="yearly" 与 currency="$"，呈现 Stripe / Linear 风格聚光主推档。',
      file: "pricing-block/spotlight.tsx",
      Demo: PricingBlockSpotlightDemo,
      directory: false,
    },
  ],
  api: [
    { name: "tiers", type: "PricingTier[]", defaultValue: "内置三档", description: "套餐配置数组" },
    {
      name: "variant",
      type: '"default" | "spotlight" | "minimal"',
      defaultValue: '"default"',
      description: "推荐档视觉呈现风格（反色主推 / 品牌蓝聚光 / 极简发丝）",
    },
    {
      name: "defaultCycle",
      type: '"monthly" | "yearly"',
      defaultValue: '"monthly"',
      description: "默认计费周期",
    },
    { name: "currency", type: "string", defaultValue: '"¥"', description: "价格货币前缀" },
    {
      name: "discountBadge",
      type: "string",
      defaultValue: '"年付省 20%"',
      description: "计费开关旁的年付优惠角标文案",
    },
    {
      name: "compact",
      type: "boolean",
      defaultValue: "false",
      description: "紧凑密度模式，缩小内边距与间距",
    },
    {
      name: "onSelectPlan",
      type: "(tierId: string, cycle: BillingCycle) => void",
      defaultValue: "—",
      description: "点击 CTA 回调",
    },
  ],
  accessibility: [
    "周期开关复用 StretchSwitch 完整 switch 语义，价格滚动由 NumberFlow 提供完整无障碍读数。",
    "所有套餐 CTA 按钮使用单层高对比焦点环，浅深双主题下均通过 WCAG AA 对比度检查。",
  ],
};
