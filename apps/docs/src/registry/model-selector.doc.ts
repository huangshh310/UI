import ModelSelectorBasicDemo from "@/demos/model-selector/basic";
import ModelSelectorToolbarDemo from "@/demos/model-selector/toolbar";
import ModelSelectorVariantsDemo from "@/demos/model-selector/variants";
import type { ComponentDoc } from "./registry.types";

export const MODEL_SELECTOR_DOC: ComponentDoc = {
  slug: "model-selector",
  name: "Model Selector",
  description:
    "基于 Base UI Popover 的紧凑模型、思考强度与联网能力毛玻璃浮层选择器，支持厂商分组与多触发器变体。",
  category: "ai",
  registryName: "model-selector",
  dependencies: [
    "@base-ui/react",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  createdAt: "2026-11-23",
  usage: `import { ModelSelector } from "@/components/ui/model-selector";

export function Example() {
  return <ModelSelector groupByProvider />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "紧凑模型胶囊与分组搜索浮层",
      description: "点击胶囊弹出毛玻璃模型检索框、厂商分组、上下文容量标签、思考强度与联网开关。",
      file: "model-selector/basic.tsx",
      Demo: ModelSelectorBasicDemo,
    },
    {
      slug: "toolbar",
      name: "嵌入 PromptInput 工具栏",
      description: "以 ghost + sm 形态与环形上下文微表盘内聚在输入器底部。",
      file: "model-selector/toolbar.tsx",
      Demo: ModelSelectorToolbarDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "触发器外观变体（pill / ghost / glass）",
      description: "分别适配对话顶栏极简切换（ghost）、常规胶囊（pill）与悬浮毛玻璃条（glass）。",
      file: "model-selector/variants.tsx",
      Demo: ModelSelectorVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "models / groupByProvider",
      type: "ModelOption[] / boolean",
      defaultValue: "内置 3 款主流模型 / false",
      description:
        "可选模型列表（支持 badge / speedHint / contextWindow / capabilities）及是否按厂商分组。",
    },
    {
      name: "variant / size / align",
      type: '"pill" | "ghost" | "glass" / "sm" | "md" / "start" | "center" | "end"',
      defaultValue: '"pill" / "md" / "start"',
      description: "触发器材质外观、紧凑密度与浮层对齐方式。",
    },
    {
      name: "modelId / defaultModelId / effort / defaultEffort",
      type: 'string / string / "fast" | "balanced" | "deep"',
      defaultValue: '"pro" / "balanced"',
      description: "受控或非受控当前选中模型 ID 与思考强度档位。",
    },
    {
      name: "showEffortToggle / showWebSearchToggle / searchable",
      type: "boolean / boolean / boolean",
      defaultValue: "true / true / true",
      description: "控制底部思考强度切换、联网开关与顶部搜索框的显隐。",
    },
    {
      name: "onValueChange",
      type: "(value: ModelSelectorValue) => void",
      defaultValue: "—",
      description: "模型、思考强度或联网开关任一变更时触发。",
    },
  ],
  accessibility: [
    "浮层定位、Escape 关闭与焦点归位由 Base UI Popover 接管。",
    "所有模型项、思考强度分段与联网开关均暴露 aria-pressed，并采用统一单层内嵌焦点环。",
  ],
};
