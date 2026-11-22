import NumberInputBasicDemo from "@/demos/number-input/basic";
import NumberInputQuantityDemo from "@/demos/number-input/quantity";
import type { ComponentDoc } from "./registry.types";

export const NUMBER_INPUT_DOC: ComponentDoc = {
  slug: "number-input",
  name: "Number Input",
  description: "基于 Base UI NumberField 的数值步进输入框，支持标签拖拽微调与货币格式化。",
  category: "navigation",
  registryName: "number-input",
  dependencies: ["@base-ui/react", "lucide-react"],
  usage: `import { NumberInput } from "@/components/ui/number-input";

<NumberInput label="数量" defaultValue={8} min={1} max={64} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "步进、拖拽微调与货币格式",
      description: "支持按住标签左右拖动平滑改值，以及 Intl.NumberFormat 货币格式。",
      file: "number-input/basic.tsx",
      Demo: NumberInputBasicDemo,
    },
    {
      slug: "quantity",
      name: "上下界数量步进器",
      description: "关闭 scrub 并配置 min/max 约束，适合席位数量与配额步进输入。",
      file: "number-input/quantity.tsx",
      Demo: NumberInputQuantityDemo,
      directory: false,
    },
  ],
  api: [
    { name: "value", type: "number | null", defaultValue: "—", description: "受控数值" },
    {
      name: "min / max / step",
      type: "number",
      defaultValue: "— / — / 1",
      description: "边界与步长",
    },
    { name: "scrub", type: "boolean", defaultValue: "true", description: "开启标签横向拖拽微调" },
    {
      name: "format",
      type: "Intl.NumberFormatOptions",
      defaultValue: "—",
      description: "数值格式选项",
    },
  ],
  accessibility: ["支持键盘上下方向键微调，加减按钮自带清晰无障碍名称并在触达边界时自动禁用。"],
};
