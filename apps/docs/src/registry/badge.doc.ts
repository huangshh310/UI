import BadgeBasicDemo from "@/demos/badge/basic";
import BadgeShapesDemo from "@/demos/badge/shapes";
import BadgeSoftAndSizesDemo from "@/demos/badge/soft-and-sizes";
import BadgeStatusDemo from "@/demos/badge/status";
import type { ComponentDoc } from "./registry.types";

export const BADGE_DOC: ComponentDoc = {
  slug: "badge",
  name: "Badge",
  description: "柔和语义徽章与状态标签，支持 8 种双主题高对比度色调、呼吸状态圆点与两种尺寸/形态。",
  category: "display",
  registryName: "badge",
  dependencies: ["class-variance-authority"],
  usage: `import { Badge } from "@/components/ui/badge";

<Badge variant="soft" dot pulse>实时运行</Badge>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "语义变体与圆点",
      description: "在亮/暗双主题下均保持清晰对比度的状态胶囊与分类标签。",
      file: "badge/basic.tsx",
      Demo: BadgeBasicDemo,
    },
    {
      slug: "status",
      name: "语义状态圆点徽章",
      description: "通过 dot 属性为成功、信号、警告、错误与待审状态添加状态小圆点。",
      file: "badge/status.tsx",
      Demo: BadgeStatusDemo,
      directory: false,
    },
    {
      slug: "shapes",
      name: "胶囊与轻量标签规格",
      description: "对比 pill 与 tag 两种外形，适配版本号、技术栈与状态标签场景。",
      file: "badge/shapes.tsx",
      Demo: BadgeShapesDemo,
      directory: false,
    },
    {
      slug: "soft-and-sizes",
      name: "柔和浅色、呼吸圆点与尺寸",
      description: "展示 soft 品牌浅蓝变体、pulse 呼吸状态指示以及 sm / md 两种高度规格。",
      file: "badge/soft-and-sizes.tsx",
      Demo: BadgeSoftAndSizesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"default" | "secondary" | "soft" | "outline" | "signal" | "success" | "warning" | "destructive"',
      defaultValue: '"secondary"',
      description: "语义色调",
    },
    { name: "shape", type: '"pill" | "tag"', defaultValue: '"pill"', description: "圆角形态" },
    { name: "size", type: '"sm" | "md"', defaultValue: '"md"', description: "徽章高度规格" },
    { name: "dot", type: "boolean", defaultValue: "false", description: "是否展示状态圆点" },
    {
      name: "pulse",
      type: "boolean",
      defaultValue: "false",
      description: "状态圆点呼吸脉冲动效（配合 dot 使用）",
    },
    { name: "icon", type: "ReactNode", defaultValue: "—", description: "左侧自定义图标" },
  ],
  accessibility: [
    "状态圆点与装饰图标自动附带 aria-hidden，脉冲动画在 prefers-reduced-motion 下自动隐藏。",
  ],
};
