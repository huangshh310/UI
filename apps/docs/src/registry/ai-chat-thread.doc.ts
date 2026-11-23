import AiChatThreadBasicDemo from "@/demos/ai-chat-thread/basic";
import AiChatThreadStreamingDemo from "@/demos/ai-chat-thread/streaming";
import type { ComponentDoc } from "./registry.types";

export const AI_CHAT_THREAD_DOC: ComponentDoc = {
  slug: "ai-chat-thread",
  name: "AI Chat Thread",
  description:
    "C 端 AI 对话消息流，支持用户/助手气泡、流式生成态、多版本回复分支切换、复制反馈与快捷追问。",
  category: "ai",
  registryName: "ai-chat-thread",
  dependencies: ["class-variance-authority", "lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { AiChatThread } from "@/components/ui/ai-chat-thread";

export function Example() {
  return <AiChatThread />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "对话消息流与多版本回复分支",
      description:
        "支持 < 1 / 2 > 切换助手多个候选版本、复制回复、点赞点踩反馈以及点击快捷追问继续对话。",
      file: "ai-chat-thread/basic.tsx",
      Demo: AiChatThreadBasicDemo,
    },
    {
      slug: "custom",
      name: "紧凑侧栏与流式输出态（compact）",
      description: '使用 variant="compact" 与消息 streaming 标记呈现实时流式输出与追问胶囊。',
      file: "ai-chat-thread/streaming.tsx",
      Demo: AiChatThreadStreamingDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"card" | "seamless" | "compact"',
      defaultValue: '"card"',
      description: "容器视觉变体（标准卡片、无框画布或紧凑侧栏）",
    },
    {
      name: "showTimestamps",
      type: "boolean",
      defaultValue: "true",
      description: "是否显示消息时间戳",
    },
    {
      name: "initialMessages",
      type: "AiChatMessage[]",
      defaultValue: "内置示例对话",
      description: "初始消息列表（支持 variants / meta / streaming 字段）",
    },
    {
      name: "followUps",
      type: "string[]",
      defaultValue: "内置 2 条",
      description: "底部快捷追问建议词",
    },
    {
      name: "onCopy",
      type: "(content: string) => void",
      defaultValue: "—",
      description: "复制消息回调（同步写入系统剪贴板）",
    },
    {
      name: "onFeedback",
      type: "(id, vote) => void",
      defaultValue: "—",
      description: "点赞或点踩反馈回调",
    },
    {
      name: "onFollowUp",
      type: "(prompt: string) => void",
      defaultValue: "—",
      description: "点击追问胶囊回调",
    },
  ],
  accessibility: ["所有消息操作图标按钮均带明确中文 aria-label，赞同与改进按钮暴露 aria-pressed。"],
};
