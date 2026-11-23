import StaggeredListBasicDemo from "@/demos/staggered-list/basic";
import StaggeredListChecklistDemo from "@/demos/staggered-list/checklist";
import StaggeredListVariantsDemo from "@/demos/staggered-list/variants";
import type { ComponentDoc } from "./registry.types";

export const STAGGERED_LIST_DOC: ComponentDoc = {
  slug: "staggered-list",
  name: "Staggered List",
  description:
    "紧凑的列表错峰入场与弹簧布局过渡容器，支持 fade-up / scale / slide-left 编排、自定义错峰间距与位移距离，以及视口滚入触发。",
  category: "motion",
  registryName: "staggered-list",
  dependencies: ["motion", "clsx", "tailwind-merge"],
  usage: `import { StaggeredList } from "@/components/ui/staggered-list";

<StaggeredList variant="fade-up" staggerMs={45} distance={12}>
  {items}
</StaggeredList>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "筛选联动与弹簧布局过渡",
      description: "支持按标签实时筛选条目，保留的条目平滑补位，新入场条目错峰浮现。",
      file: "staggered-list/basic.tsx",
      Demo: StaggeredListBasicDemo,
    },
    {
      slug: "checklist",
      name: "动态增删核查清单",
      description: "以 slide-left 编排与 60ms 错峰间隔响应列表增删，适合发布检查清单与任务流。",
      file: "staggered-list/checklist.tsx",
      Demo: StaggeredListChecklistDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "三种入场编排风格对比",
      description: "交互切换 fade-up / scale / slide-left 并点击重播，直观体验不同入场张力。",
      file: "staggered-list/variants.tsx",
      Demo: StaggeredListVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"fade-up" | "scale" | "slide-left"',
      defaultValue: '"fade-up"',
      description: "列表项入场与退场的动效编排风格。",
    },
    {
      name: "staggerMs",
      type: "number",
      defaultValue: "45",
      description: "相邻条目错峰延迟间隔（毫秒）。",
    },
    {
      name: "distance",
      type: "number",
      defaultValue: "12",
      description: "入场位移距离（像素，作用于 fade-up 与 slide-left）。",
    },
    {
      name: "maxDelayMs",
      type: "number",
      defaultValue: "360",
      description: "错峰延迟总上限（毫秒），避免长列表入场拖沓。",
    },
    {
      name: "layout",
      type: "boolean",
      defaultValue: "true",
      description: "是否启用条目筛选与增删时的弹簧布局补位动画。",
    },
    {
      name: "revealOnScroll",
      type: "boolean",
      defaultValue: "false",
      description: "是否进入视口后再触发错峰显现（自动清理 Observer）。",
    },
    {
      name: "animateOnMount",
      type: "boolean",
      defaultValue: "false",
      description: "非滚入模式下是否在首次挂载时立即执行入场动画。",
    },
  ],
  accessibility: [
    '包裹在 MotionConfig reducedMotion="user" 中，减弱动效偏好开启时自动关闭位移、缩放与布局动画。',
    "使用 IntersectionObserver 触发滚入显现并在组件卸载时自动清理，无内存泄漏。",
  ],
};
