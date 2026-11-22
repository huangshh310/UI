import AiWorkspaceBlockBasicDemo from "@/demos/ai-workspace-block/basic";
import AiWorkspaceBlockReviewDemo from "@/demos/ai-workspace-block/review";
import type { ComponentDoc } from "./registry.types";

export const AI_WORKSPACE_BLOCK_DOC: ComponentDoc = {
  slug: "ai-workspace-block",
  name: "AI Workspace Block",
  description: "由 PromptInput、Badge、Button 与多会话侧栏组合的 AI 助手与提示词工作台区块。",
  category: "blocks",
  registryName: "ai-workspace-block",
  dependencies: ["lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AiWorkspaceBlock } from "@/components/ui/ai-workspace-block";

export function Example() {
  return <AiWorkspaceBlock />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "多会话 AI 工程助手工作台",
      description: "支持新建与切换历史对话、模型胶囊切换、快捷提示词一键填充以及 Enter 实时发送。",
      file: "ai-workspace-block/basic.tsx",
      Demo: AiWorkspaceBlockBasicDemo,
    },
    {
      slug: "review",
      name: "PR 无障碍审查助手会话",
      description: "预置代码审查上下文对话，展示自定义 initialThreads 接入模式。",
      file: "ai-workspace-block/review.tsx",
      Demo: AiWorkspaceBlockReviewDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "initialThreads",
      type: "AiThread[]",
      defaultValue: "内置示例",
      description: "初始会话列表",
    },
    {
      name: "onSend",
      type: "(text: string, model: string) => void",
      defaultValue: "—",
      description: "发送消息回调",
    },
  ],
  accessibility: [
    "底部 PromptInput 自动处理中文输入法 isComposing，避免选词回车误发送。",
    "窄屏下会话栏自动切换为顶部横向滚动条，保持单列无溢出。",
  ],
};
