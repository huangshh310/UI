/**
 * Advanced Data Table 的文档数据。
 */
import AdvancedDataTableAuditDemo from "@/demos/advanced-data-table/audit";
import { AdvancedDataTableBasic } from "@/demos/advanced-data-table/basic";
import AdvancedDataTableVariantsDemo from "@/demos/advanced-data-table/variants";
import type { ComponentDoc } from "./registry.types";

export const ADVANCED_DATA_TABLE_DOC: ComponentDoc = {
  slug: "advanced-data-table",
  name: "Advanced Data Table",
  description:
    "在 TanStack Table v9 之上扩展分面筛选、毛玻璃列显隐弹层、行密度切换、斑马纹、骨架态、批量动作栏与 CSV 导出的高级数据表格。",
  category: "forms",
  registryName: "advanced-data-table",
  dependencies: [
    "@base-ui/react",
    "@tanstack/react-table",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  usage: `import { AdvancedDataTable } from "@/components/ui/advanced-data-table";

export function Demo() {
  return <AdvancedDataTable data={rows} columns={columns} variant="default" facets={facets} />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "advanced-data-table-basic",
      name: "分面筛选与列控制表格",
      description: "支持多选分面弹层筛选、毛玻璃列显隐弹窗、紧凑/标准/宽松密度切换与批量动作。",
      file: "advanced-data-table/basic.tsx",
      Demo: AdvancedDataTableBasic,
    },
    {
      slug: "variants",
      name: "极简斑马纹、默认隐藏列与破坏性批操作",
      description: '展示 variant="minimal"、striped、defaultHidden 列控制、行点击与骨架态预览。',
      file: "advanced-data-table/variants.tsx",
      Demo: AdvancedDataTableVariantsDemo,
      directory: false,
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
      name: "variant / striped / defaultDensity",
      type: '"default" | "minimal" | "elevated" / boolean / "compact" | "normal" | "comfortable"',
      defaultValue: '"default" / false / "normal"',
      description: "表格外壳层次、斑马纹交替底色与初始行高密度。",
    },
    {
      name: "facets",
      type: "AdvancedTableFacet<TData>[]",
      defaultValue: "[]",
      description: "顶部多维分面筛选胶囊分组。",
    },
    {
      name: "searchable / showDensityToggle / toolbarActions",
      type: "boolean / boolean / ReactNode",
      defaultValue: "true / true / -",
      description: "控制搜索框与密度切换器显隐，并支持在工具栏右侧注入自定义操作。",
    },
    {
      name: "batchActions / onRowClick",
      type: "AdvancedTableBatchAction<TData>[] / (row: TData) => void",
      defaultValue: "[] / -",
      description: "选中行后弹出的批量动作按钮组（支持 destructive 语调）与单行点击回调。",
    },
    {
      name: "loading / onExportCsv",
      type: "boolean / (csv: string, rows: TData[]) => void",
      defaultValue: "false / -",
      description: "加载骨架行展示，以及导出当前过滤结果的 CSV 回调钩子。",
    },
  ],
  accessibility: [
    "列显隐毛玻璃弹层由 Base UI Popover 托管焦点与 Escape 关闭，内置 DrawCheckbox 支持空格切换。",
    "分面筛选与密度按钮均通过 aria-pressed 明确声明当前选中态，统一单层清晰焦点环。",
    "所有排序、滚动、清除搜索与勾选操作均可纯键盘完成。",
  ],
};
