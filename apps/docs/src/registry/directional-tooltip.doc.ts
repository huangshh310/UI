import DirectionalTooltipBasicDemo from "@/demos/directional-tooltip/basic";
import DirectionalTooltipToolbarDemo from "@/demos/directional-tooltip/toolbar";
import type { ComponentDoc } from "./registry.types";

export const DIRECTIONAL_TOOLTIP_DOC: ComponentDoc = {
  slug: "directional-tooltip",
  name: "Directional Tooltip",
  description: "方向感知提示气泡，按放置轴线轻滑出现，支持共享延迟组与箭头指示。",
  category: "overlays",
  registryName: "directional-tooltip",
  dependencies: ["@base-ui/react"],
  usage: `import { DirectionalTooltip } from "@/components/ui/directional-tooltip";

<DirectionalTooltip content="复制链接" side="top">
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
      description: "共享 TooltipProvider 实现图标工具栏间零延迟连续切换与快捷键标注。",
      file: "directional-tooltip/toolbar.tsx",
      Demo: DirectionalTooltipToolbarDemo,
      directory: false,
    },
  ],
  api: [
    { name: "content", type: "ReactNode", defaultValue: "必填", description: "提示内容" },
    {
      name: "side",
      type: '"top" | "right" | "bottom" | "left"',
      defaultValue: '"top"',
      description: "弹出方向与入场轴线",
    },
    { name: "delay", type: "number", defaultValue: "220", description: "悬停延迟（毫秒）" },
    { name: "showArrow", type: "boolean", defaultValue: "true", description: "是否展示箭头" },
  ],
  accessibility: ["悬停与键盘聚焦同步触发，按 Escape 可即时收起提示，不阻塞键盘操作。"],
};
