import AiReasoningBasicDemo from "@/demos/ai-reasoning/basic";
import AiReasoningStreamingDemo from "@/demos/ai-reasoning/streaming";
import type { ComponentDoc } from "./registry.types";

export const AI_REASONING_DOC: ComponentDoc = {
  slug: "ai-reasoning",
  name: "AI Reasoning",
  description:
    "AI 深度思考与思维链（Chain-of-Thought）可折叠推理轨迹卡片，支持标准卡片、内嵌柔光与极简行内三种风格。",
  category: "ai",
  registryName: "ai-reasoning",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AiReasoning } from "@/components/ui/ai-reasoning";

export function Example() {
  return <AiReasoning defaultExpanded tokensLabel="486 tok" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "可折叠思维链推理步骤",
      description: "展示总推理耗时、思考 Token 读数与分步时间轴，点击顶栏可随时折叠或展开。",
      file: "ai-reasoning/basic.tsx",
      Demo: AiReasoningBasicDemo,
    },
    {
      slug: "streaming",
      name: "内嵌柔光风格与运行态切换（ghost）",
      description: '对比 status="thinking" 与 status="completed" 在 ghost 内嵌形态下的状态反馈。',
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
    {
      name: "variant",
      type: '"card" | "ghost" | "inline"',
      defaultValue: '"card"',
      description: "外壳风格（标准卡片、柔光内嵌或极简行内）",
    },
    { name: "title", type: "string", defaultValue: "按状态生成", description: "自定义标题文案" },
    { name: "durationLabel", type: "string", defaultValue: '"2.6s"', description: "总耗时读数" },
    {
      name: "tokensLabel",
      type: "string",
      defaultValue: "—",
      description: "可选思考 Token 计数读数",
    },
    {
      name: "steps",
      type: "AiReasoningStep[]",
      defaultValue: "内置 3 步",
      description: "思维链步骤列表",
    },
    { name: "expanded", type: "boolean", defaultValue: "—", description: "受控展开状态" },
    {
      name: "defaultExpanded",
      type: "boolean",
      defaultValue: "true",
      description: "初始是否展开明细",
    },
    {
      name: "onExpandedChange",
      type: "(expanded: boolean) => void",
      defaultValue: "—",
      description: "折叠/展开状态切换回调",
    },
  ],
  accessibility: ["折叠触发按钮显式绑定 aria-expanded，步骤列表采用语义化 <ol> 有序列表。"],
};
