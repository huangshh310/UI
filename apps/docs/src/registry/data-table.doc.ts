/**
 * Data Table 的文档数据。
 */
import { DataTableBasic } from "@/demos/data-table/basic";
import DataTableCompactDemo from "@/demos/data-table/compact";
import DataTableVariantsDemo from "@/demos/data-table/variants";
import type { ComponentDoc } from "./registry.types";

export const DATA_TABLE_DOC: ComponentDoc = {
  slug: "data-table",
  name: "Data Table",
  description:
    "极简声明式数据表格，支持列排序、全局搜索与一键清除、分页、行选择、外观与密度变体、斑马纹及骨架加载。",
  category: "forms",
  registryName: "data-table",
  dependencies: [
    "@tanstack/react-table",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  usage: `import { DataTable } from "@/components/ui/data-table";

export function Demo() {
  return <DataTable data={rows} columns={columns} variant="default" density="normal" searchable selectable />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "data-table-basic",
      name: "可排序与分页数据表",
      description: "支持点击表头切换升/降序、关键字实时过滤与清除、分页与批量勾选。",
      file: "data-table/basic.tsx",
      Demo: DataTableBasic,
    },
    {
      slug: "variants",
      name: "极简斑马纹、行点击与骨架加载",
      description:
        '展示 variant="minimal"、density="compact"、striped 斑马纹、行点击回调与加载态切换。',
      file: "data-table/variants.tsx",
      Demo: DataTableVariantsDemo,
      directory: false,
    },
    {
      slug: "compact",
      name: "无搜索精简只读指标表",
      description: "关闭搜索框与勾选列，仅保留表头排序与语义徽章，适合仪表盘摘要。",
      file: "data-table/compact.tsx",
      Demo: DataTableCompactDemo,
      directory: false,
    },
  ],
  api: [
    { name: "data", type: "TData[]", defaultValue: "-", description: "表格数据源数组。" },
    {
      name: "columns",
      type: "DataTableColumn<TData>[]",
      defaultValue: "-",
      description: "声明式列定义，隔离内部表格状态类型。",
    },
    {
      name: "variant / density / striped",
      type: '"default" | "minimal" | "ghost" / "compact" | "normal" | "comfortable" / boolean',
      defaultValue: '"default" / "normal" / false',
      description: "表格外壳层次、单元格行高密度与斑马纹交替底色。",
    },
    {
      name: "searchable / toolbarActions",
      type: "boolean / ReactNode",
      defaultValue: "false / -",
      description: "启用顶部全局搜索框（含清除按钮）与右侧自定义操作槽。",
    },
    {
      name: "selectable / onSelectionChange / onRowClick",
      type: "boolean / (rows: TData[]) => void / (row: TData) => void",
      defaultValue: "false / - / -",
      description: "启用多选复选框列、选中行回调与单行点击回调。",
    },
    {
      name: "pageSize / stickyHeader / loading",
      type: "number / boolean / boolean",
      defaultValue: "5 / false / false",
      description: "客户端分页条数、吸顶表头与加载态骨架行展示。",
    },
  ],
  accessibility: [
    "可排序表头通过 aria-sort 动态声明 ascending / descending 状态，按钮支持键盘触发。",
    "宽表格滚动容器可被键盘聚焦（tabIndex=0）并具备中文 aria-label，满足 WCAG 2.1.1。",
    "行选择复用 DrawCheckbox，全选列自动呈现 indeterminate 半选态；行点击自动忽略内部交互控件。",
  ],
};
