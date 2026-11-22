import AiModelSelectorBasicDemo from "@/demos/ai-model-selector/basic";
import AiModelSelectorCompactDemo from "@/demos/ai-model-selector/compact";
import type { ComponentDoc } from "./registry.types";

export const AI_MODEL_SELECTOR_DOC: ComponentDoc = {
  slug: "ai-model-selector",
  name: "AI Model Selector",
  description: "C 端 AI 模型切换、推理深度分段与联网/沙箱能力开关面板。",
  category: "ai",
  registryName: "ai-model-selector",
  dependencies: ["lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { AiModelSelector } from "@/components/ui/ai-model-selector";

export function Example() {
  return <AiModelSelector />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "模型档位、推理深度与能力开关",
      description: "一站式切换旗舰/极速/视觉模型、调节推理强度并按需启用联网检索与代码沙箱。",
      file: "ai-model-selector/basic.tsx",
      Demo: AiModelSelectorBasicDemo,
    },
    {
      slug: "controlled",
      name: "实时监听模型配置变更",
      description: "通过 onChange 回调同步当前模型 ID、推理强度与已启用扩展能力清单。",
      file: "ai-model-selector/compact.tsx",
      Demo: AiModelSelectorCompactDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "models",
      type: "AiModelOption[]",
      defaultValue: "内置 3 档模型",
      description: "可选模型列表",
    },
    {
      name: "defaultModelId",
      type: "string",
      defaultValue: '"pro"',
      description: "默认选中模型 ID",
    },
    {
      name: "defaultEffort",
      type: '"fast" | "balanced" | "deep"',
      defaultValue: '"balanced"',
      description: "默认推理强度",
    },
    {
      name: "onChange",
      type: "(config: AiModelConfig) => void",
      defaultValue: "—",
      description: "配置变化回调",
    },
  ],
  accessibility: ["所有模型卡片、强度分段与能力胶囊均使用原生 button 并绑定 aria-pressed 状态。"],
};
