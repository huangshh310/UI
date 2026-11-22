"use client";

/**
 * 示例：DataTable 的排序、搜索、分页与行选择。
 */
import { DataTable, type DataTableColumn } from "@matt-ui/ui";
import { useState } from "react";

interface Deployment {
  id: string;
  project: string;
  region: string;
  status: "运行中" | "构建中" | "已暂停";
  latency: number;
}

const DATA: Deployment[] = [
  { id: "d1", project: "matt-ui-docs", region: "ap-northeast-1", status: "运行中", latency: 18 },
  { id: "d2", project: "registry-edge", region: "ap-southeast-1", status: "运行中", latency: 31 },
  { id: "d3", project: "storybook-ci", region: "eu-central-1", status: "构建中", latency: 94 },
  { id: "d4", project: "tokens-cdn", region: "us-west-2", status: "运行中", latency: 122 },
  { id: "d5", project: "preview-sandbox", region: "ap-northeast-1", status: "已暂停", latency: 42 },
];

const COLUMNS: DataTableColumn<Deployment>[] = [
  { id: "project", header: "项目", accessor: (r) => r.project, sortable: true },
  { id: "region", header: "节点", accessor: (r) => r.region, sortable: true },
  {
    id: "status",
    header: "状态",
    accessor: (r) => r.status,
    cell: (r) => (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-solid border-border bg-secondary/60 px-2 py-0.5 text-xs font-medium text-foreground">
        <span
          aria-hidden="true"
          className={
            r.status === "运行中"
              ? "size-1.5 rounded-full bg-success"
              : r.status === "构建中"
                ? "size-1.5 rounded-full bg-signal"
                : "size-1.5 rounded-full bg-muted-foreground"
          }
        />
        {r.status}
      </span>
    ),
  },
  {
    id: "latency",
    header: "延迟",
    accessor: (r) => r.latency,
    cell: (r) => <span className="font-mono text-xs">{r.latency} ms</span>,
    sortable: true,
    align: "right",
  },
];

export const DataTableBasic = () => {
  const [selectedCount, setSelectedCount] = useState(0);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2">
      <DataTable
        title="部署节点"
        description="支持按列排序、关键字搜索、分页与批量勾选"
        data={DATA}
        columns={COLUMNS}
        getRowId={(r) => r.id}
        searchable
        selectable
        pageSize={3}
        onSelectionChange={(rows) => setSelectedCount(rows.length)}
      />
      <p data-testid="table-selected" className="m-0 px-1 font-mono text-xs text-muted-foreground">
        已勾选：{selectedCount} 项
      </p>
    </div>
  );
};
