import SkeletonBasicDemo from "@/demos/skeleton/basic";
import SkeletonShapesDemo from "@/demos/skeleton/shapes";
import SkeletonTableDemo from "@/demos/skeleton/table";
import type { ComponentDoc } from "./registry.types";

export const SKELETON_DOC: ComponentDoc = {
  slug: "skeleton",
  name: "Skeleton",
  description:
    "低对比中性骨架占位块，支持 pulse 脉冲与 shimmer 柔光波纹，提供 text / circle / card / rounded 等预设形态。",
  category: "display",
  registryName: "skeleton",
  dependencies: [],
  usage: `import { Skeleton } from "@/components/ui/skeleton";

<Skeleton shape="card" variant="shimmer" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "组合卡片骨架",
      description:
        "支持 line / text / circle / card / rounded 预设尺寸及 pulse / shimmer 动效变体。",
      file: "skeleton/basic.tsx",
      Demo: SkeletonBasicDemo,
    },
    {
      slug: "table",
      name: "流光列表行加载占位",
      description: "组合圆形头像、双行文本与胶囊状态骨架，呈现列表首屏加载过渡。",
      file: "skeleton/table.tsx",
      Demo: SkeletonTableDemo,
      directory: false,
    },
    {
      slug: "shapes",
      name: "几何形态与脉冲/柔光对比",
      description: "组合展示 circle、text、card 与 rounded 四种常见页面加载占位几何形态。",
      file: "skeleton/shapes.tsx",
      Demo: SkeletonShapesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"pulse" | "shimmer"',
      defaultValue: '"pulse"',
      description: "动画样式（呼吸脉冲或柔光扫掠）",
    },
    {
      name: "shape",
      type: '"line" | "text" | "circle" | "card" | "rounded"',
      defaultValue: '"line"',
      description: "几何形态预设",
    },
  ],
  accessibility: ['自动标记 aria-hidden="true"，并在 prefers-reduced-motion 环境下静止显示。'],
};
