import AiAgentPlanBasicDemo from "@/demos/ai-agent-plan/basic";
import AiAgentPlanResearchDemo from "@/demos/ai-agent-plan/research";
import type { ComponentDoc } from "./registry.types";

export const AI_AGENT_PLAN_DOC: ComponentDoc = {
  slug: "ai-agent-plan",
  name: "AI Agent Plan",
  description:
    "自主智能体多步任务规划与执行进度追踪器，支持卡片/时间轴/紧凑三种布局、工具标签、状态跃迁与步进控制。",
  category: "ai",
  registryName: "ai-agent-plan",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { AiAgentPlan } from "@/components/ui/ai-agent-plan";

export function Example() {
  return <AiAgentPlan subtitle="Claude Sonnet · Autonomous" />;
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
      name: "时间轴轨道形态（timeline）",
      description: '使用 variant="timeline" 与步骤说明，呈现长周期 Agent 调研管线的连贯执行轨迹。',
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
    { name: "subtitle", type: "string", defaultValue: "—", description: "模型或运行环境副标题" },
    {
      name: "variant",
      type: '"card" | "timeline" | "compact"',
      defaultValue: '"card"',
      description: "卡片、时间轴轨道或紧凑面板布局",
    },
    {
      name: "showControls",
      type: "boolean",
      defaultValue: "true",
      description: "是否显示底部推进/重置控制栏",
    },
    {
      name: "initialSteps",
      type: "AiPlanStep[]",
      defaultValue: "内置 4 步",
      description: "初始步骤数组（支持 completed / running / pending / failed / skipped）",
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
