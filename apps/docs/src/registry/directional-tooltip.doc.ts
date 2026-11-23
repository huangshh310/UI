import DirectionalTooltipBasicDemo from "@/demos/directional-tooltip/basic";
import DirectionalTooltipToolbarDemo from "@/demos/directional-tooltip/toolbar";
import DirectionalTooltipVariantsDemo from "@/demos/directional-tooltip/variants";
import type { ComponentDoc } from "./registry.types";

export const DIRECTIONAL_TOOLTIP_DOC: ComponentDoc = {
  slug: "directional-tooltip",
  name: "Directional Tooltip",
  description:
    "方向感知提示气泡，沿弹出轴线平滑滑入，内置快捷键键帽、共享延迟组与磨砂/反色/轻透三种风格。",
  category: "overlays",
  registryName: "directional-tooltip",
  dependencies: ["@base-ui/react", "class-variance-authority"],
  usage: `import { DirectionalTooltip } from "@/components/ui/directional-tooltip";

<DirectionalTooltip content="复制链接" shortcut="⌘C" variant="inverted" side="top">
  <button>复制</button>
</DirectionalTooltip>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "四方向滑入",
      description: "同一 Provider 组内快速切换相邻按钮时无需重复等待延迟。",
      file: "directional-tooltip/basic.tsx",
      Demo: DirectionalTooltipBasicDemo,
    },
    {
      slug: "toolbar",
      name: "工具栏快捷键提示",
      description: "共享 TooltipProvider 实现图标工具栏间零延迟连续切换与反色快捷键键帽标注。",
      file: "directional-tooltip/toolbar.tsx",
      Demo: DirectionalTooltipToolbarDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "风格变体对比",
      description: "对比 default 磨砂、inverted 高对比反色与 glass 轻透玻璃三种提示气泡质感。",
      file: "directional-tooltip/variants.tsx",
      Demo: DirectionalTooltipVariantsDemo,
      directory: false,
    },
  ],
  api: [
    { name: "content", type: "ReactNode", defaultValue: "必填", description: "提示内容" },
    {
      name: "shortcut",
      type: "string",
      defaultValue: "—",
      description: "快捷键标注，以等宽键帽渲染在提示右侧",
    },
    {
      name: "variant / size",
      type: '"default" | "inverted" | "glass" / "sm" | "md"',
      defaultValue: '"default" / "sm"',
      description: "气泡视觉风格与尺寸密度",
    },
    {
      name: "side / align",
      type: '"top" | "right" | "bottom" | "left" / "start" | "center" | "end"',
      defaultValue: '"top" / "center"',
      description: "弹出方向（决定入场轴线）与对齐方式",
    },
    {
      name: "delay / showArrow",
      type: "number / boolean",
      defaultValue: "220 / true",
      description: "悬停延迟（毫秒）与指示箭头开关",
    },
  ],
  accessibility: ["悬停与键盘聚焦同步触发，按 Escape 可即时收起提示，不阻塞键盘操作。"],
};
