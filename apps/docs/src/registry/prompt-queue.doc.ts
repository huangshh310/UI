import PromptQueueBasicDemo from "@/demos/prompt-queue/basic";
import PromptQueueVariantsDemo from "@/demos/prompt-queue/variants";
import type { ComponentDoc } from "./registry.types";

export const PROMPT_QUEUE_DOC: ComponentDoc = {
  slug: "prompt-queue",
  name: "Prompt Queue",
  description:
    "流式生成期间吸附于输入框上方的弹簧待发消息队列，支持毛玻璃停靠、暂停续发、优先级标识、立即插队与取回重编。",
  category: "ai",
  registryName: "prompt-queue",
  dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import { PromptQueue } from "@/components/ui/prompt-queue";

export function Example() {
  return <PromptQueue variant="glass" items={[{ id: "1", content: "顺便检查深色对比度" }]} />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "生成中待发队列与插队控制",
      description:
        "与 PromptInput 流式态无缝衔接：继续输入可排队等待，支持暂停续发、闪电插队或取回输入框重编。",
      file: "prompt-queue/basic.tsx",
      Demo: PromptQueueBasicDemo,
    },
    {
      slug: "variants",
      name: "紧凑悬浮卡片形态",
      description: "通过 variant='elevated' 与 size='sm' 适配窄侧栏或轻量智能体抽屉。",
      file: "prompt-queue/variants.tsx",
      Demo: PromptQueueVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "items",
      type: "QueuedPromptItem[]",
      defaultValue: "—",
      description:
        "队列中的待发消息数组（支持 content / meta / priority）；为空时自动隐藏整个容器。",
    },
    {
      name: "variant / size / statusLabel",
      type: '"default" | "glass" | "elevated" / "sm" | "md" / string',
      defaultValue: '"default" / "md" / "当前回复完成后自动发出"',
      description: "容器表面材质、行间距密度与页头状态副标题。",
    },
    {
      name: "paused / onTogglePause",
      type: "boolean / () => void",
      defaultValue: "false / —",
      description: "暂停或恢复自动依次发送，传入回调时在页头展示切换按钮。",
    },
    {
      name: "onSendNow / onEdit / onRemove / onClearAll",
      type: "(item) => void / (item) => void / (id) => void / () => void",
      defaultValue: "—",
      description: "立即插队发送、取回输入器编辑、移除单条与一键清空回调。",
    },
  ],
  accessibility: [
    "折叠标题声明 aria-expanded，暂停切换暴露 aria-pressed，每条队列项的插队、编辑与移除图标按钮均包含对应消息文本的中文 aria-label。",
    "遵循 useReducedMotion，系统开启减少动态效果时停用位移与缩放弹簧。",
  ],
};
