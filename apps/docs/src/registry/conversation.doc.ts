import ConversationBasicDemo from "@/demos/conversation/basic";
import ConversationEmptyDemo from "@/demos/conversation/empty";
import ConversationVariantsDemo from "@/demos/conversation/variants";
import type { ComponentDoc } from "./registry.types";

export const CONVERSATION_DOC: ComponentDoc = {
  slug: "conversation",
  name: "Conversation",
  description:
    "流式对话滚动视口原语，支持智能贴底锚定、边缘渐变遮罩、毛玻璃悬浮归位按钮与居中空状态。",
  category: "ai",
  registryName: "conversation",
  dependencies: ["class-variance-authority", "lucide-react", "clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ui/conversation";

export function Example() {
  return (
    <Conversation variant="surface" fadeEdges>
      <ConversationContent>{/* Messages */}</ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "智能贴底滚动视口",
      description: "流式追加时自动贴底跟随；上滚阅读旧消息后自动停靠并浮现回到底部胶囊与未读计数。",
      file: "conversation/basic.tsx",
      Demo: ConversationBasicDemo,
    },
    {
      slug: "empty",
      name: "空态欢迎与灵感卡片联动",
      description: "搭配 ConversationEmptyState 的模型徽章与 Suggestions 构建温润的居中首屏引导。",
      file: "conversation/empty.tsx",
      Demo: ConversationEmptyDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "圆形极简悬浮归位按钮",
      description: "通过 variant='icon' 呈现极简毛玻璃圆形向下箭头与未读数字角标。",
      file: "conversation/variants.tsx",
      Demo: ConversationVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant / fadeEdges",
      type: '"minimal" | "surface" | "glass" / boolean',
      defaultValue: '"minimal" / false',
      description: "视口容器材质风格与上下边缘柔和渐变遮罩开关。",
    },
    {
      name: "bottomThreshold / unreadCount / onAtBottomChange",
      type: "number / number / (atBottom: boolean) => void",
      defaultValue: "36 / 0 / —",
      description: "判定贴底像素容差、离开底部期间的新消息计数与贴底状态变更回调。",
    },
    {
      name: "size (ConversationContent / EmptyState)",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "正文阅读栏宽、回合间距或空态留白尺度。",
    },
    {
      name: "variant / forceVisible (ConversationScrollButton)",
      type: '"pill" | "icon" / boolean',
      defaultValue: '"pill" / false',
      description: "悬浮归位按钮形态（文案胶囊或极简圆形箭头）与受控常驻开关。",
    },
  ],
  accessibility: [
    "ConversationContent 采用 role='log' 与 aria-live='polite'，温和播报新增对话回合。",
    "ConversationScrollButton 携带包含未读条数的动态中文 aria-label，支持键盘聚焦直达最新回复。",
  ],
};
