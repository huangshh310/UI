import SelectionBasketBasicDemo from "@/demos/selection-basket/basic";
import SelectionBasketAssetsDemo from "@/demos/selection-basket/assets";
import type { ComponentDoc } from "./registry.types";

export const SELECTION_BASKET_DOC: ComponentDoc = {
  slug: "selection-basket",
  name: "Selection Basket",
  description: "底部悬浮多选动作栏，带钴蓝计数跳动徽章、全选清空控制与无障碍实时播报。",
  category: "overlays",
  registryName: "selection-basket",
  dependencies: ["lucide-react", "motion"],
  usage: `import { SelectionBasket } from "@/components/ui/selection-basket";

<SelectionBasket count={3} actions={actions} onClear={() => {}} />`,
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
  ],
  api: [
    { name: "count", type: "number", defaultValue: "必填", description: "当前选中数量，0 时隐藏" },
    {
      name: "totalCount",
      type: "number",
      defaultValue: "—",
      description: "总数，用于展示全选快捷按钮",
    },
    {
      name: "actions",
      type: "SelectionBasketAction[]",
      defaultValue: "必填",
      description: "批量动作列表",
    },
    {
      name: "floating",
      type: "boolean",
      defaultValue: "true",
      description: "是否固定悬浮于视口底部",
    },
  ],
  accessibility: ['内置 aria-live="polite" 区域，数量变化时屏幕阅读器自动播报已选条目数。'],
};
