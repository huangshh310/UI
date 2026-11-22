import ReorderListBasicDemo from "@/demos/reorder-list/basic";
import ReorderListRoadmapDemo from "@/demos/reorder-list/roadmap";
import type { ComponentDoc } from "./registry.types";

export const REORDER_LIST_DOC: ComponentDoc = {
  slug: "reorder-list",
  name: "Reorder List",
  description: "基于精确锁版本 UI SDK 与 motion 的拖拽与键盘双通道可重排列表。",
  category: "navigation",
  registryName: "reorder-list",
  dependencies: [
    "@ui-sdk/core@0.1.0-beta.13",
    "@ui-sdk/react@0.1.0-beta.13",
    "lucide-react",
    "motion",
  ],
  usage: `import { ReorderList } from "@/components/ui/reorder-list";

<ReorderList items={tasks} onValueChange={setOrder} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "拖拽与键盘排序",
      description: "支持鼠标/触摸拖拽，以及空格拿起、方向键换位、空格放下、Esc 取消的纯键盘排序。",
      file: "reorder-list/basic.tsx",
      Demo: ReorderListBasicDemo,
    },
    {
      slug: "roadmap",
      name: "需求排期优先级重排",
      description: "支持拖拽与纯键盘 Space + 方向键重排产品迭代优先级列表。",
      file: "reorder-list/roadmap.tsx",
      Demo: ReorderListRoadmapDemo,
      directory: false,
    },
  ],
  api: [
    { name: "items", type: "ReorderListItem[]", defaultValue: "必填", description: "排序条目内容" },
    { name: "value", type: "string[]", defaultValue: "—", description: "受控条目 id 顺序" },
    {
      name: "onValueChange",
      type: "(ids: string[]) => void",
      defaultValue: "—",
      description: "顺序提交回调",
    },
  ],
  accessibility: [
    "完整覆盖键鼠双通道排序，提供隐藏操作说明（aria-describedby）与 aria-live 顺序播报。",
  ],
};
