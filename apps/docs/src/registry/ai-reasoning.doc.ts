import AiReasoningBasicDemo from "@/demos/ai-reasoning/basic";
import AiReasoningStreamingDemo from "@/demos/ai-reasoning/streaming";
import type { ComponentDoc } from "./registry.types";

export const AI_REASONING_DOC: ComponentDoc = {
  slug: "ai-reasoning",
  name: "AI Reasoning",
  description: "AI 深度思考与思维链（Chain-of-Thought）可折叠推理轨迹卡片。",
  category: "ai",
  registryName: "ai-reasoning",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AiReasoning } from "@/components/ui/ai-reasoning";

export function Example() {
  return <AiReasoning defaultExpanded />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "可折叠思维链推理步骤",
      description: "展示总推理耗时与分步时间轴，点击顶栏可随时折叠或展开推理过程。",
      file: "ai-reasoning/basic.tsx",
      Demo: AiReasoningBasicDemo,
    },
    {
      slug: "streaming",
      name: "推理运行态与完成态切换",
      description: '对比 status="thinking" 与 status="completed" 的徽章与图标反馈。',
      file: "ai-reasoning/streaming.tsx",
      Demo: AiReasoningStreamingDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "status",
      type: '"thinking" | "completed"',
      defaultValue: '"completed"',
      description: "当前推理状态",
    },
    { name: "durationLabel", type: "string", defaultValue: '"2.6s"', description: "总耗时读数" },
    {
      name: "steps",
      type: "AiReasoningStep[]",
      defaultValue: "内置 3 步",
      description: "思维链步骤列表",
    },
    {
      name: "defaultExpanded",
      type: "boolean",
      defaultValue: "true",
      description: "初始是否展开明细",
    },
  ],
  accessibility: ["折叠触发按钮显式绑定 aria-expanded，步骤列表采用语义化 <ol> 有序列表。"],
};
