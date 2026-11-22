import SkeletonBasicDemo from "@/demos/skeleton/basic";
import SkeletonTableDemo from "@/demos/skeleton/table";
import type { ComponentDoc } from "./registry.types";

export const SKELETON_DOC: ComponentDoc = {
  slug: "skeleton",
  name: "Skeleton",
  description: "低对比中性骨架占位块，支持脉冲与流光两种形态，遵守减弱动效偏好。",
  category: "display",
  registryName: "skeleton",
  dependencies: [],
  usage: `import { Skeleton } from "@/components/ui/skeleton";

<Skeleton shape="circle" className="size-10" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "组合卡片骨架",
      description: "支持 line / circle / card 预设尺寸及 pulse / shimmer 动效变体。",
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
  ],
  api: [
    {
      name: "variant",
      type: '"pulse" | "shimmer"',
      defaultValue: '"pulse"',
      description: "动画样式",
    },
    {
      name: "shape",
      type: '"line" | "circle" | "card"',
      defaultValue: '"line"',
      description: "几何形态预设",
    },
  ],
  accessibility: ['自动标记 aria-hidden="true"，并在 prefers-reduced-motion 环境下静止显示。'],
};
