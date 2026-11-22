import StaggeredListBasicDemo from "@/demos/staggered-list/basic";
import StaggeredListChecklistDemo from "@/demos/staggered-list/checklist";
import type { ComponentDoc } from "./registry.types";

export const STAGGERED_LIST_DOC: ComponentDoc = {
  slug: "staggered-list",
  name: "Staggered List",
  description: "紧凑的列表错峰入场与视口滚入显现包装器，自动清理 IntersectionObserver。",
  category: "motion",
  registryName: "staggered-list",
  dependencies: ["motion"],
  usage: `import { StaggeredList } from "@/components/ui/staggered-list";

<StaggeredList staggerMs={45}>{items}</StaggeredList>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "错峰入场列表",
      description: "限制总入场序列时长在 400ms 内，避免列表拖沓，支持 revealOnScroll 滚入触发。",
      file: "staggered-list/basic.tsx",
      Demo: StaggeredListBasicDemo,
    },
    {
      slug: "checklist",
      name: "紧凑核查清单错峰显现",
      description: "以 70ms 间隔依次显现质量门禁条目，适合落地页特性说明。",
      file: "staggered-list/checklist.tsx",
      Demo: StaggeredListChecklistDemo,
      directory: false,
    },
  ],
  api: [
    { name: "staggerMs", type: "number", defaultValue: "45", description: "相邻项错峰毫秒间隔" },
    {
      name: "revealOnScroll",
      type: "boolean",
      defaultValue: "false",
      description: "是否进入视口后再显现",
    },
  ],
  accessibility: ['包裹在 MotionConfig reducedMotion="user" 中，减弱动效时零位立即显现。'],
};
