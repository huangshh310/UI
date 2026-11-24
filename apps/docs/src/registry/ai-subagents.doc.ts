import AiSubagentsBasicDemo from "@/demos/ai-subagents/basic";
import type { ComponentDoc } from "./registry.types";

export const AI_SUBAGENTS_DOC: ComponentDoc = {
  slug: "ai-subagents",
  name: "AI Subagents",
  description:
    "对标 HextaUI Subagents 的并行子代理执行面板，展示发光运行微球、排队态、工具调用次数、模型标签与逐条/批量停止操作。",
  category: "ai",
  registryName: "ai-subagents",
  dependencies: ["class-variance-authority", "lucide-react"],
  createdAt: "2026-11-24",
  usage: `import { AiSubagents } from "@/components/ui/ai-subagents";

export function Example() {
  return <AiSubagents />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "并行子代理执行与中止控制",
      description:
        "实时呈现并行运行与排队中的子代理、工具调用次数与模型标识，支持展开轨迹详情、单条停止与全部停止。",
      file: "ai-subagents/basic.tsx",
      Demo: AiSubagentsBasicDemo,
    },
  ],
  api: [
    {
      name: "agents / initialAgents",
      type: "AiSubagentItem[]",
      defaultValue: "内置 3 条并行示例",
      description: "受控或非受控的子代理列表数据",
    },
    {
      name: "elapsed",
      type: "string",
      defaultValue: '"1s"',
      description: "顶部总运行耗时文本",
    },
    {
      name: "variant",
      type: '"card" | "seamless"',
      defaultValue: '"card"',
      description: "带卡片外框或无缝嵌入对话流的视觉变体",
    },
    {
      name: "onStopAgent / onStopAll",
      type: "(id: string) => void / () => void",
      defaultValue: "—",
      description: "点击单条停止或全部停止按钮回调",
    },
  ],
  accessibility: [
    "折叠控制与逐条展开按钮均暴露 aria-expanded，每条停止按钮提供包含任务名的中文 aria-label。",
  ],
};
