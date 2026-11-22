/**
 * Data Table 的文档数据。
 */
import { DataTableBasic } from "@/demos/data-table/basic";
import DataTableCompactDemo from "@/demos/data-table/compact";
import type { ComponentDoc } from "./registry.types";

export const DATA_TABLE_DOC: ComponentDoc = {
  slug: "data-table",
  name: "Data Table",
  description: "基于 TanStack Table v9 的声明式数据表格，支持排序、搜索、分页、行选择与空态骨架。",
  category: "forms",
  registryName: "data-table",
  dependencies: ["@tanstack/react-table", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { DataTable } from "@/components/ui/data-table";

export function Demo() {
  return <DataTable data={rows} columns={columns} searchable selectable />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "data-table-basic",
      name: "可排序与分页数据表",
      description: "支持点击表头切换升/降序、关键字实时过滤、分页与批量勾选。",
      file: "data-table/basic.tsx",
      Demo: DataTableBasic,
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
      description: "声明式列定义，不泄漏底层 TanStack 类型。",
    },
    {
      name: "searchable",
      type: "boolean",
      defaultValue: "false",
      description: "启用顶部全局搜索框。",
    },
    {
      name: "selectable",
      type: "boolean",
      defaultValue: "false",
      description: "启用多选复选框列。",
    },
    { name: "pageSize", type: "number", defaultValue: "5", description: "客户端分页每页条数。" },
    { name: "loading", type: "boolean", defaultValue: "false", description: "加载态骨架行展示。" },
  ],
  accessibility: [
    "可排序表头通过 aria-sort 动态声明 ascending / descending 状态，按钮支持键盘触发。",
    "宽表格滚动容器可被键盘聚焦（tabIndex=0）并具备中文 aria-label，满足 WCAG 2.1.1。",
    "行选择复用 DrawCheckbox，全选列自动呈现 indeterminate 半选态。",
  ],
};
