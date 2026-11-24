import ResizablePanelsBasicDemo from "@/demos/resizable-panels/basic";
import ResizablePanelsThreePaneDemo from "@/demos/resizable-panels/three-pane";
import ResizablePanelsVerticalDemo from "@/demos/resizable-panels/vertical";
import type { ComponentDoc } from "./registry.types";

export const RESIZABLE_PANELS_DOC: ComponentDoc = {
  slug: "resizable-panels",
  name: "Resizable Panels",
  description:
    "可拖拽分栏面板，支持水平/垂直方向、card / flush 容器、pill / line / dots 三种手柄风格与键盘方向键调节。",
  category: "navigation",
  registryName: "resizable-panels",
  dependencies: ["@ui-sdk/react@0.1.0-beta.13", "class-variance-authority", "lucide-react"],
  usage: `import { ResizablePanels } from "@/components/ui/resizable-panels";

<ResizablePanels handleStyle="line" panels={[{ id: "a", defaultSize: 35, content: "左" }, { id: "b", defaultSize: 65, content: "右" }]} />`,
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
      slug: "vertical",
      name: "上下分栏与极简发丝分隔线",
      description: '使用 orientation="vertical" 与 handleStyle="line" 呈现 IDE 编辑器 + 终端布局。',
      file: "resizable-panels/vertical.tsx",
      Demo: ResizablePanelsVerticalDemo,
      directory: false,
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
    {
      name: "variant / handleStyle",
      type: '"card" | "flush" / "pill" | "line" | "dots"',
      defaultValue: '"card" / "pill"',
      description: "容器边框形态与分隔手柄风格",
    },
    { name: "step", type: "number", defaultValue: "5", description: "键盘方向键单次调整百分比" },
  ],
  accessibility: ['分隔手柄具有 role="separator" 与 aria-valuenow，聚焦后可直接用方向键微调比例。'],
};
