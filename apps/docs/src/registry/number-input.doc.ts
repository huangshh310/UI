import NumberInputBasicDemo from "@/demos/number-input/basic";
import NumberInputQuantityDemo from "@/demos/number-input/quantity";
import NumberInputVariantsDemo from "@/demos/number-input/variants";
import type { ComponentDoc } from "./registry.types";

export const NUMBER_INPUT_DOC: ComponentDoc = {
  slug: "number-input",
  name: "Number Input",
  description:
    "基于 Base UI NumberField 的精密数值输入框，支持 default / filled / stepper 变体、三档尺寸、前后缀单位、标签拖拽微调与校验态。",
  category: "navigation",
  registryName: "number-input",
  dependencies: ["@base-ui/react", "class-variance-authority", "lucide-react"],
  usage: `import { NumberInput } from "@/components/ui/number-input";

<NumberInput label="超时时间" variant="stepper" defaultValue={300} suffix="ms" />`,
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
      slug: "variants",
      name: "多变体、前后缀单位与校验态",
      description: "展示 stepper 堆叠步进、filled 填充风、sm/lg 尺寸、前后缀单位与错误提示态。",
      file: "number-input/variants.tsx",
      Demo: NumberInputVariantsDemo,
      directory: false,
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
      name: "variant / size",
      type: '"default" | "filled" | "stepper" / "sm" | "md" | "lg"',
      defaultValue: '"default" / "md"',
      description: "外观变体与高度规格",
    },
    {
      name: "prefix / suffix",
      type: "ReactNode",
      defaultValue: "—",
      description: "输入框前置符号或后置单位",
    },
    {
      name: "hint / error / invalid",
      type: "string / string / boolean",
      defaultValue: "—",
      description: "辅助说明与校验错误反馈（传入 error 自动设置 aria-invalid）",
    },
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
  accessibility: [
    "支持键盘上下方向键微调，加减按钮自带清晰无障碍名称并在触达边界时自动禁用，错误提示绑定 aria-describedby。",
  ],
};
