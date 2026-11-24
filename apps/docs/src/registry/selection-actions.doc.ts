import SelectionActionsBasicDemo from "@/demos/selection-actions/basic";
import type { ComponentDoc } from "./registry.types";

export const SELECTION_ACTIONS_DOC: ComponentDoc = {
  slug: "selection-actions",
  name: "SelectionActions",
  description:
    "对标 BeautifulUI 20 Selection Actions 的划词选中文本 AI 浮动微编辑条，集成自然语言改写输入与快捷指令按钮。",
  category: "ai",
  registryName: "selection-actions",
  dependencies: ["class-variance-authority", "lucide-react", "clsx", "tailwind-merge"],
  createdAt: "2026-11-24",
  usage: `import { SelectionActions } from "@/components/ui/selection-actions";

export function Example() {
  return (
    <SelectionActions
      selectedText="待改写片段"
      onAction={(id, text) => console.log(id, text)}
      onSubmitInstruction={(cmd, text) => console.log(cmd, text)}
    />
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "划词微编辑浮条",
      description: "结合高亮选区段落演示行内自然语言改写输入与「解释 / 润色」快捷操作。",
      file: "selection-actions/basic.tsx",
      Demo: SelectionActionsBasicDemo,
    },
  ],
  api: [
    {
      name: "selectedText",
      type: "string",
      defaultValue: '""',
      description: "当前选中的文本片段，触发动作或提交指令时原样回传。",
    },
    {
      name: "actions",
      type: "SelectionActionItem[]",
      defaultValue: "解释 / 润色",
      description: "右侧快捷动作按钮配置列表。",
    },
    {
      name: "placeholder / loading",
      type: "string / boolean",
      defaultValue: '"描述修改意图…" / false',
      description: "行内输入框占位提示与处理中禁用态。",
    },
    {
      name: "onAction / onSubmitInstruction",
      type: "(id, text) => void / (instruction, text) => void",
      defaultValue: "—",
      description: "点击快捷指令或回车提交自定义修改指令时的回调。",
    },
  ],
  accessibility: [
    '容器采用 role="toolbar" 与中文 aria-label，所有操作按钮具备清晰键盘焦点环。',
    "输入框支持直接按 Enter 提交指令并在完成后自动清空。",
  ],
};
