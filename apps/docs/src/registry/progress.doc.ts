import ProgressBasicDemo from "@/demos/progress/basic";
import ProgressInteractiveDemo from "@/demos/progress/interactive";
import type { ComponentDoc } from "./registry.types";

export const PROGRESS_DOC: ComponentDoc = {
  slug: "progress",
  name: "Progress",
  description: "基于 Base UI Progress 的极细线性进度条，支持确定进度与不确定态。",
  category: "display",
  registryName: "progress",
  dependencies: ["@base-ui/react"],
  usage: `import { Progress } from "@/components/ui/progress";

<Progress value={64} label="上传中" showValue />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "确定进度与不确定态",
      description: "等宽数字百分比读数与丝滑宽度过渡，传 null 自动切换为不确定加载态。",
      file: "progress/basic.tsx",
      Demo: ProgressBasicDemo,
    },
    {
      slug: "interactive",
      name: "步进可控与不确定加载态",
      description: "演示动态增减百分比读数，以及 value={null} 时的脉冲不确定加载轨道。",
      file: "progress/interactive.tsx",
      Demo: ProgressInteractiveDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "value",
      type: "number | null",
      defaultValue: "必填",
      description: "当前进度，null 表示不确定态",
    },
    { name: "max", type: "number", defaultValue: "100", description: "最大值" },
    {
      name: "tone",
      type: '"signal" | "primary" | "success"',
      defaultValue: '"signal"',
      description: "进度条色调",
    },
    { name: "showValue", type: "boolean", defaultValue: "false", description: "展示百分比数字" },
  ],
  accessibility: ['提供标准 role="progressbar"、aria-valuenow 与关联标签，读屏器可准确朗读进度。'],
};
