/**
 * Waterfall 的文档数据：智能体多步调用耗时火焰图与树表无障碍说明。
 */
import { WaterfallBasic } from "@/demos/waterfall/basic";
import { WaterfallZoomWindow } from "@/demos/waterfall/zoom-window";
import type { ComponentDoc } from "./registry.types";

export const WATERFALL_DOC: ComponentDoc = {
  slug: "waterfall",
  name: "Waterfall",
  description:
    "智能体多步调用耗时火焰图与嵌套追踪瀑布流，支持树表键盘导航、里程碑竖线标记与时间轴窗口缩放。",
  category: "ai",
  registryName: "waterfall",
  dependencies: [
    "@ui-sdk/react@0.1.0-beta.13",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  usage: `import { Waterfall } from "@/components/ui/waterfall";

export function Example() {
  return (
    <Waterfall
      items={[
        { value: "plan", label: "意图规划", start: 0, duration: 140, tone: "signal" },
        { value: "tool", label: "工具调用", start: 150, duration: 320, tone: "success" },
      ]}
    />
  );
}`,
  createdAt: "2026-11-24",
  specimens: [
    {
      slug: "basic",
      name: "多步调用耗时火焰图",
      description:
        "在同一时间轴展示智能体主循环、并发子工具与首帧 TTFT 里程碑，支持一键展开折叠与选中联动。",
      file: "waterfall/basic.tsx",
      Demo: WaterfallBasic,
    },
    {
      slug: "zoom-window",
      name: "时间窗口局部缩放",
      description: "通过 range 聚焦任意毫秒区间，实时重算刻度尺与火焰条占比以排查长尾瓶颈。",
      file: "waterfall/zoom-window.tsx",
      Demo: WaterfallZoomWindow,
      directory: false,
    },
  ],
  api: [
    {
      name: "items",
      type: "WaterfallSpan[]",
      defaultValue: "必填",
      description: "支持任意深度 children 嵌套的追踪步骤数据",
    },
    {
      name: "milestones",
      type: "WaterfallMilestone[]",
      defaultValue: "—",
      description: "贯穿表头时间轴的关键时刻标记（如 TTFT）",
    },
    {
      name: "range",
      type: "[number, number]",
      defaultValue: "自动推导首尾",
      description: "可视时间窗口起止毫秒区间",
    },
    {
      name: "showControls",
      type: "boolean",
      defaultValue: "false",
      description: "是否显示顶部全部展开与全部折叠按钮",
    },
  ],
  accessibility: [
    "完整遵循 WAI-ARIA treegrid 规范：单一 Tab 停靠点，方向键在步骤行与单元格间移动，左右键展开或折叠子步骤。",
    "每个火焰条单元格内置起始时刻与持续耗时的无障碍标签，刻度尺对屏幕阅读器自动隐藏以避免重复播报。",
  ],
};
