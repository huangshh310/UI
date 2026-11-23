import CardBasicDemo from "@/demos/card/basic";
import CardElevatedDemo from "@/demos/card/elevated";
import CardMetricsDemo from "@/demos/card/metrics";
import CardVariantsDemo from "@/demos/card/variants";
import type { ComponentDoc } from "./registry.types";

export const CARD_DOC: ComponentDoc = {
  slug: "card",
  name: "Card",
  description:
    "圆角发丝边线卡片容器，提供 default / elevated / interactive / glass / subtle 五种材质层级与页头操作插槽。",
  category: "display",
  registryName: "card",
  dependencies: ["class-variance-authority"],
  usage: `import { Card, CardAction, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card variant="elevated">
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardAction>状态</CardAction>
  </CardHeader>
  <CardContent>正文</CardContent>
</Card>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "指标卡片与托盘页脚",
      description: "支持五种视觉材质层级与浅灰底部操作托盘。",
      file: "card/basic.tsx",
      Demo: CardBasicDemo,
    },
    {
      slug: "metrics",
      name: "可交互指标卡片组",
      description: '使用 variant="interactive" 呈现三列业务核心指标卡与悬停抬升反馈。',
      file: "card/metrics.tsx",
      Demo: CardMetricsDemo,
      directory: false,
    },
    {
      slug: "elevated",
      name: "微抬升状态与吸底页脚卡",
      description: '组合 variant="elevated"、状态徽章与柔和灰底 CardFooter 展示服务摘要。',
      file: "card/elevated.tsx",
      Demo: CardElevatedDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "五种表面层级与 CardAction 插槽",
      description: "对比 default / elevated / subtle / glass 材质并展示右上角操作位对齐。",
      file: "card/variants.tsx",
      Demo: CardVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"default" | "elevated" | "interactive" | "glass" | "subtle"',
      defaultValue: '"default"',
      description: "卡片表面材质与悬停反馈层级",
    },
    {
      name: "CardAction",
      type: "HTMLDivElement",
      defaultValue: "—",
      description: "置于 CardHeader 右上角的徽章或快捷操作槽",
    },
    {
      name: "CardFooter.muted",
      type: "boolean",
      defaultValue: "false",
      description: "启用带顶部分隔线的托盘页脚",
    },
  ],
  accessibility: ["使用非标题段落标签承载 CardTitle，嵌入任意页面层级都不会破坏标题大纲顺序。"],
};
