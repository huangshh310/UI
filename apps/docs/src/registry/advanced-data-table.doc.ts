/**
 * Advanced Data Table 的文档数据。
 */
import { AdvancedDataTableBasic } from "@/demos/advanced-data-table/basic";
import AdvancedDataTableAuditDemo from "@/demos/advanced-data-table/audit";
import type { ComponentDoc } from "./registry.types";

export const ADVANCED_DATA_TABLE_DOC: ComponentDoc = {
  slug: "advanced-data-table",
  name: "Advanced Data Table",
  description:
    "在 TanStack Table 之上扩展分面筛选、列显隐开关、行密度切换、批量动作栏与 CSV 导出。",
  category: "forms",
  registryName: "advanced-data-table",
  dependencies: [
    "@base-ui/react",
    "@tanstack/react-table",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  usage: `import { AdvancedDataTable } from "@/components/ui/advanced-data-table";

export function Demo() {
  return <AdvancedDataTable data={rows} columns={columns} facets={facets} />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "advanced-data-table-basic",
      name: "分面筛选与列控制表格",
      description: "支持多维胶囊筛选、列显隐弹窗、紧凑/标准/宽松密度切换与批量动作。",
      file: "advanced-data-table/basic.tsx",
      Demo: AdvancedDataTableBasic,
    },
    {
      slug: "audit",
      name: "紧凑密度无障碍巡检表",
      description: '以 defaultDensity="compact" 配合主题分面筛选展示双主题巡检结果。',
      file: "advanced-data-table/audit.tsx",
      Demo: AdvancedDataTableAuditDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "facets",
      type: "AdvancedTableFacet<TData>[]",
      defaultValue: "[]",
      description: "顶部多维分面筛选胶囊分组。",
    },
    {
      name: "defaultDensity",
      type: '"compact" | "normal" | "comfortable"',
      defaultValue: '"normal"',
      description: "默认行高密度。",
    },
    {
      name: "batchActions",
      type: "AdvancedTableBatchAction<TData>[]",
      defaultValue: "[]",
      description: "选中行后弹出的批量动作按钮组。",
    },
    {
      name: "onExportCsv",
      type: "(csv: string, rows: TData[]) => void",
      defaultValue: "-",
      description: "导出当前过滤结果的 CSV 回调钩子。",
    },
  ],
  accessibility: [
    "列显隐弹层由 Base UI Popover 托管焦点与 Escape 关闭，内置 DrawCheckbox 支持空格切换。",
    "分面筛选与密度按钮均通过 aria-pressed 明确声明当前选中态。",
    "所有排序、滚动与勾选操作均可纯键盘完成。",
  ],
};
