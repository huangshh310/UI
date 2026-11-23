import SpotlightCardBasicDemo from "@/demos/spotlight-card/basic";
import SpotlightCardGridDemo from "@/demos/spotlight-card/grid";
import SpotlightCardSurfacesDemo from "@/demos/spotlight-card/surfaces";
import type { ComponentDoc } from "./registry.types";

export const SPOTLIGHT_CARD_DOC: ComponentDoc = {
  slug: "spotlight-card",
  name: "Spotlight Card",
  description:
    "纯 CSS 指针径向高光与 1px 镜面微光边框卡片，提供四套材质、四色高光与多档内边距，零动画库依赖。",
  category: "motion",
  registryName: "spotlight-card",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  usage: `import { SpotlightCard } from "@/components/ui/spotlight-card";

<SpotlightCard variant="elevated" tone="signal">卡片内容</SpotlightCard>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "钴蓝径向高光与镜面边框",
      description: "通过局部 CSS 变量 --spot-x / --spot-y 驱动高光与 1px 边框反光，性能开销极低。",
      file: "spotlight-card/basic.tsx",
      Demo: SpotlightCardBasicDemo,
    },
    {
      slug: "grid",
      name: "四色聚光色调矩阵",
      description: "并排对比 signal / neutral / emerald / violet 四种径向高光与微光边框质感。",
      file: "spotlight-card/grid.tsx",
      Demo: SpotlightCardGridDemo,
      directory: false,
    },
    {
      slug: "surfaces",
      name: "四种卡片材质与层级变体",
      description: "展示 default / elevated / glass / dark 四种表面材质在不同高光色调下的表现。",
      file: "spotlight-card/surfaces.tsx",
      Demo: SpotlightCardSurfacesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"default" | "elevated" | "glass" | "dark"',
      defaultValue: '"default"',
      description: "卡片表面材质与层级风格。",
    },
    {
      name: "tone",
      type: '"neutral" | "signal" | "emerald" | "violet"',
      defaultValue: '"neutral"',
      description: "径向高光与镜面边框色调。",
    },
    {
      name: "padding",
      type: '"none" | "sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "预设卡片内边距档位。",
    },
    {
      name: "glowBorder",
      type: "boolean",
      defaultValue: "true",
      description: "是否启用指针跟随 1px 镜面微光边框。",
    },
    {
      name: "spotlightSize",
      type: "number",
      defaultValue: "260",
      description: "径向高光扩散半径（像素）。",
    },
  ],
  accessibility: [
    "高光层与微光边框层均标记 pointer-events-none 与 aria-hidden，不干扰交互与屏幕阅读器。",
    "在 prefers-reduced-motion 环境下通过 motion-reduce:hidden 自动关闭指针高光层。",
  ],
};
