/**
 * Prompt Input 的文档数据。
 */
import { PromptInputBasic } from "@/demos/prompt-input/basic";
import PromptInputCompoundDemo from "@/demos/prompt-input/compound";
import PromptInputStreamingDemo from "@/demos/prompt-input/streaming";
import PromptInputVariantsDemo from "@/demos/prompt-input/variants";
import type { ComponentDoc } from "./registry.types";

export const PROMPT_INPUT_DOC: ComponentDoc = {
  slug: "prompt-input",
  name: "Prompt Input",
  description:
    "面向 AI 对话与指令工作流的极简多模态输入器，支持斜杠命令毛玻璃面板、@ 上下文与附件标签、视觉变体、流式入队、IME 防误触及复合子部件拼装。",
  category: "forms",
  registryName: "prompt-input",
  dependencies: ["class-variance-authority", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { PromptInput } from "@/components/ui/prompt-input";

export function Demo() {
  return <PromptInput variant="elevated" placeholder="输入问题，或键入 / 呼出指令…" onSubmit={(v) => console.log(v)} />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "prompt-input-basic",
      name: "AI 指令输入器",
      description: "自动增高文本框、斜杠指令、附件移除、模型切换胶囊、快捷提示词与生成中停止状态。",
      file: "prompt-input/basic.tsx",
      Demo: PromptInputBasic,
    },
    {
      slug: "variants",
      name: "视觉变体、顶部建议条与错误态",
      description:
        '展示 elevated 悬浮条、filled 紧凑态、suggestionsPosition="top" 与 error 校验提示。',
      file: "prompt-input/variants.tsx",
      Demo: PromptInputVariantsDemo,
      directory: false,
    },
    {
      slug: "compound",
      name: "复合子部件拼装与流式入队",
      description:
        "使用 Header / Textarea / Footer / Tools / Submit 自由组合工具开关与 onQueue 追问入队。",
      file: "prompt-input/compound.tsx",
      Demo: PromptInputCompoundDemo,
      directory: false,
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
      name: "variant / size / radius",
      type: '"default" | "filled" | "elevated" / "sm" | "md" | "lg" / "lg" | "xl"',
      defaultValue: '"default" / "md" / "xl"',
      description: "输入器表面风格、尺寸密度与圆角等级。",
    },
    {
      name: "value / defaultValue / onValueChange",
      type: "string / (v: string) => void",
      defaultValue: '""',
      description: "受控或非受控文本内容。",
    },
    {
      name: "status",
      type: '"idle" | "submitting" | "streaming" | "disabled"',
      defaultValue: '"idle"',
      description:
        "运行状态；streaming 且无草稿时主按钮切换为停止生成，传入 onQueue 时可继续入队。",
    },
    {
      name: "onSubmit / onQueue / onStop",
      type: "(value: string) => void / (value: string) => void / () => void",
      defaultValue: "-",
      description: "提交指令、流式追问入队与中止生成回调。",
    },
    {
      name: "slashCommands / contextRefs / attachments",
      type: "PromptSlashCommand[] / PromptContextRef[] / PromptAttachment[]",
      defaultValue: "[]",
      description: "斜杠快捷指令浮层、@ 上下文引用标签与附件芯片列表。",
    },
    {
      name: "models / toolbarLeft / toolbarRight",
      type: "PromptModelOption[] / ReactNode / ReactNode",
      defaultValue: "[] / - / -",
      description: "底部模型切换胶囊及左右自定义工具栏扩展槽。",
    },
    {
      name: "suggestions / suggestionsPosition / error / hint",
      type: 'string[] / "bottom" | "top" / string / string',
      defaultValue: '[] / "bottom" / - / -',
      description: "快捷提示词建议及其位置、错误告警提示与键盘辅助说明。",
    },
  ],
  accessibility: [
    "Enter 提交严格检测 nativeEvent.isComposing，中文/日文输入法选词回车绝不误发。",
    "所有图标按钮（添加附件、移除附件、发送、停止）均具备清晰的中文 aria-label；模型胶囊使用 aria-pressed 声明当前选中项。",
    '错误提示使用 role="alert" 播报，聚焦整卡与内部控件均采用统一单层清晰焦点环。',
  ],
};
