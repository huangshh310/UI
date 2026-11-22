import AiAgentPlanBasicDemo from "@/demos/ai-agent-plan/basic";
import AiAgentPlanResearchDemo from "@/demos/ai-agent-plan/research";
import type { ComponentDoc } from "./registry.types";

export const AI_AGENT_PLAN_DOC: ComponentDoc = {
  slug: "ai-agent-plan",
  name: "AI Agent Plan",
  description: "自主智能体多步任务规划与执行进度追踪器，支持工具标签、进度动画与步进推进。",
  category: "ai",
  registryName: "ai-agent-plan",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { AiAgentPlan } from "@/components/ui/ai-agent-plan";

export function Example() {
  return <AiAgentPlan />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "多步智能体执行路线与步进控制",
      description: "实时展示已完成、执行中与待执行步骤及对应工具标签，点击推进下一步观看进度跃迁。",
      file: "ai-agent-plan/basic.tsx",
      Demo: AiAgentPlanBasicDemo,
    },
    {
      slug: "research",
      name: "深度调研任务管线",
      description: "自定义任务标题与步骤清单，呈现长周期 Agent 任务的执行进度与耗时。",
      file: "ai-agent-plan/research.tsx",
      Demo: AiAgentPlanResearchDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "title",
      type: "string",
      defaultValue: '"智能体执行计划"',
      description: "任务规划卡片标题",
    },
    {
      name: "initialSteps",
      type: "AiPlanStep[]",
      defaultValue: "内置 4 步",
      description: "初始步骤数组",
    },
    {
      name: "onStepAdvance",
      type: "(done, total) => void",
      defaultValue: "—",
      description: "推进步骤回调",
    },
  ],
  accessibility: ["使用语义化 <ol> 有序步骤列表，减弱动效偏好时自动关闭旋转与进度条过渡。"],
};
