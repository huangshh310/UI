import CardBasicDemo from "@/demos/card/basic";
import CardMetricsDemo from "@/demos/card/metrics";
import CardElevatedDemo from "@/demos/card/elevated";
import type { ComponentDoc } from "./registry.types";

export const CARD_DOC: ComponentDoc = {
  slug: "card",
  name: "Card",
  description: "圆角发丝边线卡片容器，提供页头、标题、说明、主体与托盘页脚组合插槽。",
  category: "display",
  registryName: "card",
  dependencies: ["class-variance-authority"],
  usage: `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader><CardTitle>标题</CardTitle></CardHeader>
  <CardContent>正文</CardContent>
</Card>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "指标卡片与托盘页脚",
      description: "支持 default / elevated / interactive 三种视觉层级与浅灰底部操作托盘。",
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
  ],
  api: [
    {
      name: "variant",
      type: '"default" | "elevated" | "interactive"',
      defaultValue: '"default"',
      description: "视觉层级与悬停反馈",
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
