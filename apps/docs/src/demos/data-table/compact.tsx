"use client";

import { Badge, DataTable, type DataTableColumn } from "@matt-ui/ui";

interface PackageRow {
  id: string;
  pkg: string;
  version: string;
  gzip: string;
  status: string;
}

const ROWS: PackageRow[] = [
  { id: "1", pkg: "@matt-ui/tokens", version: "0.4.0", gzip: "1.2 KB", status: "稳定" },
  { id: "2", pkg: "@matt-ui/ui", version: "0.4.0", gzip: "18.6 KB", status: "稳定" },
  { id: "3", pkg: "@matt-ui/motion", version: "0.4.0", gzip: "11.4 KB", status: "按需" },
];

const COLS: DataTableColumn<PackageRow>[] = [
  { id: "pkg", header: "包名", accessor: (r) => r.pkg, sortable: true },
  { id: "version", header: "版本", accessor: (r) => r.version },
  { id: "gzip", header: "Gzip", accessor: (r) => r.gzip, align: "right" },
  {
    id: "status",
    header: "分发策略",
    accessor: (r) => r.status,
    cell: (r) => <Badge variant={r.status === "稳定" ? "success" : "secondary"}>{r.status}</Badge>,
  },
];

export default function DataTableCompactDemo() {
  return (
    <div className="w-full max-w-2xl">
      <DataTable
        title="工作区包体积清单"
        columns={COLS}
        data={ROWS}
        getRowId={(r) => r.id}
        searchable={false}
        pageSize={5}
      />
    </div>
  );
}
