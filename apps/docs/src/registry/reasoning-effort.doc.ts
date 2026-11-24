import ReasoningEffortBasicDemo from "@/demos/reasoning-effort/basic";
import type { ComponentDoc } from "./registry.types";

export const REASONING_EFFORT_DOC: ComponentDoc = {
  slug: "reasoning-effort",
  name: "ReasoningEffort",
  description:
    "对标 AICSS Reasoning Effort 的极简单色推理深度档位选择器，通过 4 阶精密信号柱在快速、均衡、深度、极致四档间切换思考预算。",
  category: "ai",
  registryName: "reasoning-effort",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  createdAt: "2026-11-24",
  usage: `import { ReasoningEffortPicker } from "@/components/ui/reasoning-effort";

export function Example() {
  return <ReasoningEffortPicker defaultValue="high" variant="segmented" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "分段胶囊与档位卡片联动",
      description: "同步体验紧凑分段胶囊与四列详细档位卡，感受极简单色信号柱的克制层级。",
      file: "reasoning-effort/basic.tsx",
      Demo: ReasoningEffortBasicDemo,
    },
  ],
  api: [
    {
      name: "value / defaultValue",
      type: '"low" | "medium" | "high" | "max"',
      defaultValue: '— / "medium"',
      description: "受控或非受控当前推理深度档位。",
    },
    {
      name: "variant",
      type: '"segmented" | "cards"',
      defaultValue: '"segmented"',
      description: "紧凑圆角分段胶囊或四列详情卡片变体。",
    },
    {
      name: "options / disabled / onValueChange",
      type: "ReasoningEffortOption[] / boolean / (value) => void",
      defaultValue: "默认 4 档 / false / —",
      description: "自定义档位文案、禁用态与切换回调。",
    },
  ],
  accessibility: [
    "遵循 WAI-ARIA radiogroup / radio 语义模式，通过 aria-checked 标识当前选中的推理深度。",
  ],
};
