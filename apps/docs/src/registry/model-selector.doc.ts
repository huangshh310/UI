import ModelSelectorBasicDemo from "@/demos/model-selector/basic";
import ModelSelectorToolbarDemo from "@/demos/model-selector/toolbar";
import type { ComponentDoc } from "./registry.types";

export const MODEL_SELECTOR_DOC: ComponentDoc = {
  slug: "model-selector",
  name: "Model Selector",
  description:
    "基于 Base UI Popover 的紧凑模型、思考强度与联网能力浮层选择器，可直接嵌入输入器工具栏。",
  category: "ai",
  registryName: "model-selector",
  dependencies: ["@base-ui/react", "lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { ModelSelector } from "@/components/ui/model-selector";

export function Example() {
  return <ModelSelector />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "紧凑模型胶囊与搜索浮层",
      description: "点击胶囊弹出模型检索框、上下文窗口标签、思考强度分段开关与联网检索开关。",
      file: "model-selector/basic.tsx",
      Demo: ModelSelectorBasicDemo,
    },
    {
      slug: "toolbar",
      name: "嵌入 PromptInput 工具栏",
      description: "与环形上下文微表盘共同内聚在输入器底部，告别笨重的独立配置面板。",
      file: "model-selector/toolbar.tsx",
      Demo: ModelSelectorToolbarDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "models",
      type: "ModelOption[]",
      defaultValue: "内置 3 款主流模型",
      description: "可选模型列表，支持上下文容量与能力图标角标。",
    },
    {
      name: "modelId / defaultModelId",
      type: "string",
      defaultValue: '"pro"',
      description: "受控或非受控当前选中模型 ID。",
    },
    {
      name: "effort / defaultEffort",
      type: '"fast" | "balanced" | "deep"',
      defaultValue: '"balanced"',
      description: "受控或非受控推理强度档位。",
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
    "模型项使用标准 role='listbox' 与 role='option' + aria-selected 暴露选中状态。",
  ],
};
