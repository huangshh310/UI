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
      description:
        "支持新建与切换历史对话、模型胶囊切换、快捷提示词一键填充、时间戳展示以及 Enter 实时发送。",
      file: "ai-workspace-block/basic.tsx",
      Demo: AiWorkspaceBlockBasicDemo,
    },
    {
      slug: "review",
      name: "紧凑型 PR 无障碍审查助手",
      description:
        '通过 variant="compact"、defaultModel 与 initialThreads 构建可嵌入侧栏或抽屉的精简审查会话。',
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
      name: "title",
      type: "string",
      defaultValue: '"AI 工程助手"',
      description: "工作台标题",
    },
    {
      name: "variant",
      type: '"split" | "compact"',
      defaultValue: '"split"',
      description: "布局变体：双栏侧边栏或紧凑顶部会话条",
    },
    {
      name: "defaultModel",
      type: "string",
      defaultValue: '"claude-sonnet"',
      description: "默认选中的推理模型标识",
    },
    {
      name: "showTimestamps",
      type: "boolean",
      defaultValue: "true",
      description: "是否在气泡下方显示角色与时间戳",
    },
    {
      name: "onSend",
      type: "(text: string, model: string) => void",
      defaultValue: "—",
      description: "发送消息回调",
    },
  ],
  accessibility: [
    "当前激活会话按钮声明 aria-current=true，并在键盘聚焦时呈现单层高对比焦点环。",
    "底部 PromptInput 自动处理中文输入法 isComposing，避免选词回车误发送。",
    "窄屏与 compact 模式下会话栏自动切换为顶部横向滚动条，保持单列无溢出。",
  ],
};
