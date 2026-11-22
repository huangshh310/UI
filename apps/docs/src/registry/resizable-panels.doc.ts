import ResizablePanelsBasicDemo from "@/demos/resizable-panels/basic";
import ResizablePanelsThreePaneDemo from "@/demos/resizable-panels/three-pane";
import type { ComponentDoc } from "./registry.types";

export const RESIZABLE_PANELS_DOC: ComponentDoc = {
  slug: "resizable-panels",
  name: "Resizable Panels",
  description: "基于精确锁版本 UI SDK 的可拖拽分栏面板，支持最小比例约束与键盘方向键调整。",
  category: "navigation",
  registryName: "resizable-panels",
  dependencies: ["@ui-sdk/react@0.1.0-beta.13", "lucide-react"],
  usage: `import { ResizablePanels } from "@/components/ui/resizable-panels";

<ResizablePanels panels={[{ id: "a", defaultSize: 35, content: "左" }, { id: "b", defaultSize: 65, content: "右" }]} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "左右可调工作区",
      description: "细边线分隔条带居中微握柄，拖拽与方向键均可平滑调整分栏占比。",
      file: "resizable-panels/basic.tsx",
      Demo: ResizablePanelsBasicDemo,
    },
    {
      slug: "three-pane",
      name: "三栏工作区布局",
      description: "组合资源大纲、画布预览与 Token 检查器三栏面板，均设最小占比约束。",
      file: "resizable-panels/three-pane.tsx",
      Demo: ResizablePanelsThreePaneDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "panels",
      type: "ResizablePanelItem[]",
      defaultValue: "必填",
      description: "面板配置（占比与上下限）",
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
      description: "排列方向",
    },
    { name: "step", type: "number", defaultValue: "5", description: "键盘方向键单次调整百分比" },
  ],
  accessibility: ['分隔手柄具有 role="separator" 与 aria-valuenow，聚焦后可直接用方向键微调比例。'],
};
