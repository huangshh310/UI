import PromptQueueBasicDemo from "@/demos/prompt-queue/basic";
import type { ComponentDoc } from "./registry.types";

export const PROMPT_QUEUE_DOC: ComponentDoc = {
  slug: "prompt-queue",
  name: "Prompt Queue",
  description:
    "流式生成期间吸附于输入框上方的弹簧待发消息队列，支持立即插队打断、取回重编与单条移除。",
  category: "ai",
  registryName: "prompt-queue",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { PromptQueue } from "@/components/ui/prompt-queue";

export function Example() {
  return <PromptQueue items={[{ id: "1", content: "顺便检查深色对比度" }]} />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "生成中待发队列与插队控制",
      description:
        "与 PromptInput 流式态无缝衔接：继续输入可排队等待，也可一键闪电插队或取回输入框重编。",
      file: "prompt-queue/basic.tsx",
      Demo: PromptQueueBasicDemo,
    },
  ],
  api: [
    {
      name: "items",
      type: "QueuedPromptItem[]",
      defaultValue: "—",
      description: "队列中的待发消息数组；为空时自动隐藏整个容器。",
    },
    {
      name: "onSendNow",
      type: "(item: QueuedPromptItem) => void",
      defaultValue: "—",
      description: "点击闪电按钮立即打断当前流并发送该条消息。",
    },
    {
      name: "onEdit / onRemove",
      type: "(item) => void / (id: string) => void",
      defaultValue: "—",
      description: "将消息取回输入器编辑或从队列中移除。",
    },
  ],
  accessibility: [
    "折叠标题声明 aria-expanded，每条队列项的插队、编辑与移除图标按钮均包含对应消息文本的中文 aria-label。",
    "遵循 useReducedMotion，系统开启减少动态效果时停用位移与缩放弹簧。",
  ],
};
