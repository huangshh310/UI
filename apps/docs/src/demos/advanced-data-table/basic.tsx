"use client";

/**
 * 示例：AdvancedDataTable 的分面弹层筛选、列显隐、密度切换、批量动作与 CSV 导出。
 */
import {
  AdvancedDataTable,
  Badge,
  type AdvancedTableColumn,
  type AdvancedTableFacet,
} from "@matt-ui/ui";
import { useState } from "react";

interface ComponentItem {
  id: string;
  name: string;
  pkg: "@matt-ui/ui" | "@matt-ui/motion";
  status: "stable" | "new";
  gzipKb: number;
}

const ITEMS: ComponentItem[] = [
  { id: "c1", name: "Button", pkg: "@matt-ui/ui", status: "stable", gzipKb: 1.4 },
  { id: "c2", name: "Calendar", pkg: "@matt-ui/ui", status: "new", gzipKb: 3.1 },
  { id: "c3", name: "DatePicker", pkg: "@matt-ui/ui", status: "new", gzipKb: 4.2 },
  { id: "c4", name: "OtpInput", pkg: "@matt-ui/motion", status: "stable", gzipKb: 2.8 },
  { id: "c5", name: "AnimatedFileUpload", pkg: "@matt-ui/motion", status: "new", gzipKb: 3.9 },
];

const COLUMNS: AdvancedTableColumn<ComponentItem>[] = [
  {
    id: "name",
    header: "组件",
    accessor: (r) => r.name,
    cell: (r) => <span className="font-medium text-foreground">{r.name}</span>,
    sortable: true,
    hideable: false,
  },
  {
    id: "pkg",
    header: "所属包",
    accessor: (r) => r.pkg,
    cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.pkg}</span>,
    sortable: true,
  },
  {
    id: "status",
    header: "状态",
    accessor: (r) => r.status,
    cell: (r) => (
      <Badge variant={r.status === "new" ? "soft" : "success"} dot>
        {r.status}
      </Badge>
    ),
  },
  {
    id: "gzipKb",
    header: "体积 (KB)",
    accessor: (r) => r.gzipKb,
    cell: (r) => (
      <span className="font-mono text-xs text-muted-foreground">{r.gzipKb.toFixed(1)} KB</span>
    ),
    sortable: true,
    align: "right",
  },
];

const FACETS: AdvancedTableFacet<ComponentItem>[] = [
  {
    id: "pkg",
    label: "包",
    getValue: (r) => r.pkg,
    options: [
      { value: "@matt-ui/ui", label: "ui" },
      { value: "@matt-ui/motion", label: "motion" },
    ],
  },
  {
    id: "status",
    label: "状态",
    getValue: (r) => r.status,
    options: [
      { value: "new", label: "新增" },
      { value: "stable", label: "稳定" },
    ],
  },
];

export const AdvancedDataTableBasic = () => {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col gap-2">
      <AdvancedDataTable
        title="组件清单"
        description="支持多选分面筛选、列显隐开关、行密度切换、批量动作与 CSV 导出"
        data={ITEMS}
        columns={COLUMNS}
        getRowId={(r) => r.id}
        facets={FACETS}
        pageSize={4}
        batchActions={[
          {
            id: "publish",
            label: "标记审阅通过",
            onAction: (rows) => setNotice(`已审阅 ${rows.length} 个组件`),
          },
        ]}
        onExportCsv={(_csv, rows) => setNotice(`已生成 ${rows.length} 行 CSV 数据`)}
      />
      {notice && (
        <p
          data-testid="adv-table-notice"
          className="m-0 px-1 font-mono text-xs text-muted-foreground"
        >
          {notice}
        </p>
      )}
    </div>
  );
};
