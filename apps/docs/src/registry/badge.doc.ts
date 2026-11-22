import BadgeBasicDemo from "@/demos/badge/basic";
import BadgeStatusDemo from "@/demos/badge/status";
import BadgeShapesDemo from "@/demos/badge/shapes";
import type { ComponentDoc } from "./registry.types";

export const BADGE_DOC: ComponentDoc = {
  slug: "badge",
  name: "Badge",
  description: "柔和语义徽章与状态标签，支持 7 种色调、状态圆点与胶囊/标签两种形态。",
  category: "display",
  registryName: "badge",
  dependencies: ["class-variance-authority"],
  usage: `import { Badge } from "@/components/ui/badge";

<Badge variant="signal" dot>运行中</Badge>`,
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
      name: "胶囊与圆角方块规格",
      description: "对比 pill 与 rounded 两种外形，适配版本号、技术栈与状态标签场景。",
      file: "badge/shapes.tsx",
      Demo: BadgeShapesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"default" | "secondary" | "outline" | "signal" | "success" | "warning" | "destructive"',
      defaultValue: '"secondary"',
      description: "语义色调",
    },
    { name: "shape", type: '"pill" | "tag"', defaultValue: '"pill"', description: "圆角形态" },
    { name: "dot", type: "boolean", defaultValue: "false", description: "是否展示状态圆点" },
  ],
  accessibility: ["状态圆点与装饰图标自动附带 aria-hidden，不干扰屏幕阅读器朗读正文。"],
};
