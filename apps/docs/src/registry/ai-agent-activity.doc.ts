import AiAgentActivityBasicDemo from "@/demos/ai-agent-activity/basic";
import AiAgentActivityCompletedDemo from "@/demos/ai-agent-activity/completed";
import type { ComponentDoc } from "./registry.types";

export const AI_AGENT_ACTIVITY_DOC: ComponentDoc = {
  slug: "ai-agent-activity",
  name: "AiAgentActivity",
  description:
    "极简克制的 AI 智能体执行轨迹与工具调用时间线，支持弹簧展开单步参数/代码/输出明细与一键全部展开收起。",
  category: "ai",
  registryName: "ai-agent-activity",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { AiAgentActivity } from "@/components/ui/ai-agent-activity";

export function Example() {
  return (
    <AiAgentActivity
      title="执行轨迹"
      agentName="Research Agent"
      activities={[
        { id: "1", type: "searching", title: "检索文档索引", status: "success", duration: "0.4s" },
      ]}
    />
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "运行态轨迹与可展开明细抽屉",
      description: "点击任意步骤展开调用参数、代码片段与返回结果，或通过右上角一键展开/收起。",
      file: "ai-agent-activity/basic.tsx",
      Demo: AiAgentActivityBasicDemo,
    },
    {
      slug: "completed",
      name: "复合子部件自定义拼装",
      description: "通过 AiAgentActivityHeader 与 AiAgentActivityTimeline 自由组合布局。",
      file: "ai-agent-activity/completed.tsx",
      Demo: AiAgentActivityCompletedDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "activities",
      type: "AiAgentActivityItemData[]",
      defaultValue: "[]",
      description: "时间线上的每一步执行记录",
    },
    {
      name: "isRunning",
      type: "boolean",
      defaultValue: "false",
      description: "是否处于运行中状态",
    },
    { name: "title", type: "string", defaultValue: '"执行轨迹"', description: "头部标题" },
    {
      name: "agentName",
      type: "string",
      defaultValue: "—",
      description: "执行本次任务的智能体名称",
    },
    {
      name: "defaultExpandedIds",
      type: "string[]",
      defaultValue: "[]",
      description: "默认展开明细的步骤 ID 列表",
    },
  ],
  accessibility: [
    "含明细的步骤标题渲染为原生 <button aria-expanded>，支持键盘 Enter/Space 切换。",
    "自动响应 prefers-reduced-motion，减弱动效时关闭弹簧位移直接切换展开态。",
  ],
};
