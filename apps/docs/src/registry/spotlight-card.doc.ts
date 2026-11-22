import SpotlightCardBasicDemo from "@/demos/spotlight-card/basic";
import SpotlightCardGridDemo from "@/demos/spotlight-card/grid";
import type { ComponentDoc } from "./registry.types";

export const SPOTLIGHT_CARD_DOC: ComponentDoc = {
  slug: "spotlight-card",
  name: "Spotlight Card",
  description: "纯 CSS 局部指针径向高光与微光边框卡片，零额外动画库依赖。",
  category: "motion",
  registryName: "spotlight-card",
  dependencies: [],
  usage: `import { SpotlightCard } from "@/components/ui/spotlight-card";

<SpotlightCard tone="signal">卡片内容</SpotlightCard>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "钴蓝径向高光卡片",
      description: "通过局部 CSS 变量 --spot-x / --spot-y 驱动高光跟随，性能开销极低。",
      file: "spotlight-card/basic.tsx",
      Demo: SpotlightCardBasicDemo,
    },
    {
      slug: "grid",
      name: "信号色与中性聚光双卡对比",
      description: '并排对比 tone="signal" 与 tone="neutral" 配合 glowBorder 的高光质感。',
      file: "spotlight-card/grid.tsx",
      Demo: SpotlightCardGridDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "tone",
      type: '"signal" | "neutral"',
      defaultValue: '"signal"',
      description: "径向高光色调",
    },
    {
      name: "glowBorder",
      type: "boolean",
      defaultValue: "true",
      description: "悬停启用钴蓝微光边框",
    },
  ],
  accessibility: ["高光层带有 pointer-events-none 与 aria-hidden，并在减弱动效环境下自动隐藏。"],
};
