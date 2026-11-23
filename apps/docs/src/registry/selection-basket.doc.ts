import SelectionBasketAssetsDemo from "@/demos/selection-basket/assets";
import SelectionBasketBasicDemo from "@/demos/selection-basket/basic";
import SelectionBasketVariantsDemo from "@/demos/selection-basket/variants";
import type { ComponentDoc } from "./registry.types";

export const SELECTION_BASKET_DOC: ComponentDoc = {
  slug: "selection-basket",
  name: "Selection Basket",
  description:
    "磨砂悬浮多选操作浮舱，带计数跳动徽章、default / inverted / glass 三种视觉风格、全选清空控制与无障碍实时播报。",
  category: "overlays",
  registryName: "selection-basket",
  dependencies: ["lucide-react", "motion"],
  usage: `import { SelectionBasket } from "@/components/ui/selection-basket";

<SelectionBasket count={3} variant="inverted" actions={actions} onClear={() => {}} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "批量操作胶囊",
      description: "支持悬浮或内联模式，选中数归零时弹性收起。",
      file: "selection-basket/basic.tsx",
      Demo: SelectionBasketBasicDemo,
    },
    {
      slug: "assets",
      name: "归档与危险批量操作栏",
      description: "同时提供归档与 destructive 删除批量动作，全选与清空实时联动计数。",
      file: "selection-basket/assets.tsx",
      Demo: SelectionBasketAssetsDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "反色浮舱与紧凑轻透变体",
      description: '展示 inverted 高对比反色命令浮舱与 glass + size="sm" 紧凑轻透风格。',
      file: "selection-basket/variants.tsx",
      Demo: SelectionBasketVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "count / totalCount",
      type: "number",
      defaultValue: "count 必填",
      description: "当前选中数量（0 时收起）与可选总数",
    },
    {
      name: "actions",
      type: "SelectionBasketAction[]",
      defaultValue: "必填",
      description: "批量动作列表，支持 icon、disabled 与 default / signal / destructive 色调",
    },
    {
      name: "variant / size",
      type: '"default" | "inverted" | "glass" / "sm" | "md"',
      defaultValue: '"default" / "md"',
      description: "浮舱视觉风格与尺寸密度",
    },
    {
      name: "floating / position",
      type: 'boolean / "bottom" | "top"',
      defaultValue: 'true / "bottom"',
      description: "是否固定悬浮于视口边缘及吸附位置",
    },
  ],
  accessibility: ['内置 aria-live="polite" 区域，数量变化时屏幕阅读器自动播报已选条目数。'],
};
