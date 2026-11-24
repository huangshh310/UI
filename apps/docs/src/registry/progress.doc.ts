import ProgressBasicDemo from "@/demos/progress/basic";
import ProgressInteractiveDemo from "@/demos/progress/interactive";
import ProgressTonesDemo from "@/demos/progress/tones";
import type { ComponentDoc } from "./registry.types";

export const PROGRESS_DOC: ComponentDoc = {
  slug: "progress",
  name: "Progress",
  description:
    "圆润线性无障碍进度条，支持三种轨道尺寸、六种语义色调、等宽百分比读数与不确定流光态。",
  category: "display",
  registryName: "progress",
  dependencies: ["@base-ui/react"],
  usage: `import { Progress } from "@/components/ui/progress";

<Progress value={64} label="上传中" showValue tone="signal" size="md" />`,
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
      description: "演示动态增减百分比读数，以及 value={null} 时的流光不确定加载轨道。",
      file: "progress/interactive.tsx",
      Demo: ProgressInteractiveDemo,
      directory: false,
    },
    {
      slug: "tones",
      name: "全尺寸、语义色调与流光态",
      description:
        "展示 sm / md / lg 轨道高度，default / signal / success / warning / destructive 色调及 indeterminate 流光态。",
      file: "progress/tones.tsx",
      Demo: ProgressTonesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "value",
      type: "number | null",
      defaultValue: "null",
      description: "当前进度，传 null 表示不确定态",
    },
    { name: "max", type: "number", defaultValue: "100", description: "最大值" },
    {
      name: "indeterminate",
      type: "boolean",
      defaultValue: "false",
      description: "启用不确定流光加载态",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"sm"',
      description: "进度轨道高度",
    },
    {
      name: "tone",
      type: '"default" | "primary" | "signal" | "success" | "warning" | "destructive"',
      defaultValue: '"signal"',
      description: "进度条语义色调",
    },
    { name: "label", type: "string", defaultValue: "—", description: "顶部左侧标签文案" },
    { name: "showValue", type: "boolean", defaultValue: "false", description: "展示百分比数字" },
  ],
  accessibility: ['提供标准 role="progressbar"、aria-valuenow 与关联标签，读屏器可准确朗读进度。'],
};
