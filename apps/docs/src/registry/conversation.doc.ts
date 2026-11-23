import ConversationBasicDemo from "@/demos/conversation/basic";
import ConversationEmptyDemo from "@/demos/conversation/empty";
import type { ComponentDoc } from "./registry.types";

export const CONVERSATION_DOC: ComponentDoc = {
  slug: "conversation",
  name: "Conversation",
  description: "流式对话滚动视口原语，支持智能贴底锚定、上滚解绑悬浮归位胶囊与居中空状态。",
  category: "ai",
  registryName: "conversation",
  dependencies: ["lucide-react", "clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ui/conversation";

export function Example() {
  return (
    <Conversation>
      <ConversationContent>{/* Messages */}</ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "智能贴底滚动视口",
      description: "流式追加时自动贴底跟随；上滚阅读旧消息后自动停靠并浮现回到底部胶囊。",
      file: "conversation/basic.tsx",
      Demo: ConversationBasicDemo,
    },
    {
      slug: "empty",
      name: "空态欢迎与灵感卡片联动",
      description: "搭配 ConversationEmptyState 与 Suggestions 构建温润的居中首屏引导。",
      file: "conversation/empty.tsx",
      Demo: ConversationEmptyDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "bottomThreshold",
      type: "number",
      defaultValue: "36",
      description: "判定当前滚动容器处于底部的像素容差。",
    },
    {
      name: "unreadCount",
      type: "number",
      defaultValue: "0",
      description: "离开底部期间产生的新消息计数，显示在回到底部胶囊上。",
    },
    {
      name: "onAtBottomChange",
      type: "(atBottom: boolean) => void",
      defaultValue: "—",
      description: "贴底状态变更回调。",
    },
  ],
  accessibility: [
    "ConversationContent 采用 role='log' 与 aria-live='polite'，温和播报新增对话回合。",
    "ConversationScrollButton 携带包含未读条数的动态中文 aria-label，支持键盘聚焦直达最新回复。",
  ],
};
