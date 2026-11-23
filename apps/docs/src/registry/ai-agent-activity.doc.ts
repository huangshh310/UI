import AiAgentActivityBasicDemo from "@/demos/ai-agent-activity/basic";
import AiAgentActivityCompletedDemo from "@/demos/ai-agent-activity/completed";
import AiAgentActivityInlineDemo from "@/demos/ai-agent-activity/inline";
import type { ComponentDoc } from "./registry.types";

export const AI_AGENT_ACTIVITY_DOC: ComponentDoc = {
  slug: "ai-agent-activity",
  name: "AiAgentActivity",
  description:
    "极简克制的 AI 智能体执行轨迹与工具调用时间线，支持卡片/无框/毛玻璃变体、动作徽章、整板折叠与单步参数抽屉。",
  category: "ai",
  registryName: "ai-agent-activity",
  dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import { AiAgentActivity } from "@/components/ui/ai-agent-activity";

export function Example() {
  return (
    <AiAgentActivity
      title="执行轨迹"
      agentName="Research Agent"
      showTypeBadge
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
      description: "点击任意步骤展开调用参数、代码片段与返回结果，底部进度发丝线随完成步数推进。",
      file: "ai-agent-activity/basic.tsx",
      Demo: AiAgentActivityBasicDemo,
    },
    {
      slug: "completed",
      name: "毛玻璃复合拼装与整板折叠",
      description: "通过 variant='glass' 与 collapsible 搭配子部件自由组合。",
      file: "ai-agent-activity/completed.tsx",
      Demo: AiAgentActivityCompletedDemo,
      directory: false,
    },
    {
      slug: "inline",
      name: "无框内联轨迹（嵌入对话流）",
      description: "使用 variant='ghost' 与 compact 直接融入无框助手消息正文上方。",
      file: "ai-agent-activity/inline.tsx",
      Demo: AiAgentActivityInlineDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "activities / isRunning",
      type: "AiAgentActivityItemData[] / boolean",
      defaultValue: "[] / false",
      description: "时间线上的每一步执行记录与是否处于运行中脉动状态。",
    },
    {
      name: "variant / compact / showTypeBadge",
      type: '"card" | "ghost" | "glass" / boolean / boolean',
      defaultValue: '"card" / false / false',
      description: "面板材质外观、紧凑密度与步骤类型等宽徽章开关。",
    },
    {
      name: "collapsible / defaultCollapsed",
      type: "boolean / boolean",
      defaultValue: "false / false",
      description: "是否支持点击标题一键收起整个时间线面板及其初始状态。",
    },
    {
      name: "title / agentName / defaultExpandedIds",
      type: "string / string / string[]",
      defaultValue: '"执行轨迹" / — / []',
      description: "头部标题、智能体等宽标识与默认展开明细的步骤 ID 集合。",
    },
  ],
  accessibility: [
    "含明细的步骤标题与可折叠页头均渲染为原生 <button aria-expanded>，支持键盘 Enter/Space 切换。",
    "自动响应 prefers-reduced-motion，减弱动效时关闭弹簧位移直接切换展开态。",
  ],
};
