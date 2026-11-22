/**
 * Prompt Input 的文档数据。
 */
import { PromptInputBasic } from "@/demos/prompt-input/basic";
import PromptInputStreamingDemo from "@/demos/prompt-input/streaming";
import type { ComponentDoc } from "./registry.types";

export const PROMPT_INPUT_DOC: ComponentDoc = {
  slug: "prompt-input",
  name: "Prompt Input",
  description:
    "面向 AI 对话与指令工作流的自适应多行输入器，支持附件标签、模型切换、IME 防误触与生成中停止。",
  category: "forms",
  registryName: "prompt-input",
  dependencies: ["lucide-react", "clsx", "tailwind-merge"],
  usage: `import { PromptInput } from "@/components/ui/prompt-input";

export function Demo() {
  return <PromptInput placeholder="输入问题…" onSubmit={(v) => console.log(v)} />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "prompt-input-basic",
      name: "AI 指令输入器",
      description: "自动增高文本框、附件移除、模型切换胶囊、快捷提示词与生成中停止状态。",
      file: "prompt-input/basic.tsx",
      Demo: PromptInputBasic,
    },
    {
      slug: "streaming",
      name: "流式生成态与一键停止控制",
      description: '演示 status="streaming" 时发送按钮切换为停止控制按钮的交互闭环。',
      file: "prompt-input/streaming.tsx",
      Demo: PromptInputStreamingDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "value / defaultValue / onValueChange",
      type: "string / (v: string) => void",
      defaultValue: '""',
      description: "受控或非受控文本内容。",
    },
    {
      name: "status",
      type: '"idle" | "streaming" | "disabled"',
      defaultValue: '"idle"',
      description: "运行状态；streaming 时主按钮自动切换为停止生成。",
    },
    {
      name: "onSubmit / onStop",
      type: "(value: string) => void / () => void",
      defaultValue: "-",
      description: "提交指令与中止生成回调。",
    },
    {
      name: "attachments / onRemoveAttachment / onAttach",
      type: "PromptAttachment[] / (id: string) => void / () => void",
      defaultValue: "[]",
      description: "附件芯片展示、移除与触发附加动作。",
    },
    {
      name: "models / selectedModel / onModelChange",
      type: "PromptModelOption[] / string / (id: string) => void",
      defaultValue: "[]",
      description: "底部左侧模型或模式切换胶囊。",
    },
    {
      name: "suggestions",
      type: "string[]",
      defaultValue: "[]",
      description: "卡片下方的快捷提示词建议按钮。",
    },
  ],
  accessibility: [
    "Enter 提交严格检测 nativeEvent.isComposing，中文/日文输入法选词回车绝不误发。",
    "所有图标按钮（添加附件、移除附件、发送、停止）均具备清晰的中文 aria-label；模型胶囊使用 aria-pressed 声明当前选中项。",
    "聚焦整卡通过 focus-within 呈现克制的钴蓝描边与柔光环，键盘操作清晰可见。",
  ],
};
