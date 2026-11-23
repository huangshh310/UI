"use client";

/**
 * 示例：DataTable 的极简斑马纹风格、行点击交互、工具栏扩展与骨架加载切换。
 */
import { Button, DataTable, type DataTableColumn } from "@matt-ui/ui";
import { useState } from "react";

interface InvoiceRow {
  id: string;
  number: string;
  plan: string;
  amount: string;
  paidAt: string;
}

const INVOICES: InvoiceRow[] = [
  { id: "i1", number: "INV-2026-11", plan: "Pro 团队版", amount: "$49.00", paidAt: "2026-11-01" },
  { id: "i2", number: "INV-2026-10", plan: "Pro 团队版", amount: "$49.00", paidAt: "2026-10-01" },
  {
    id: "i3",
    number: "INV-2026-09",
    plan: "Starter 个人版",
    amount: "$19.00",
    paidAt: "2026-09-01",
  },
  {
    id: "i4",
    number: "INV-2026-08",
    plan: "Starter 个人版",
    amount: "$19.00",
    paidAt: "2026-08-01",
  },
];

const COLUMNS: DataTableColumn<InvoiceRow>[] = [
  { id: "number", header: "账单号", accessor: (r) => r.number, sortable: true },
  { id: "plan", header: "订阅套餐", accessor: (r) => r.plan },
  { id: "paidAt", header: "结算日", accessor: (r) => r.paidAt, sortable: true },
  { id: "amount", header: "金额", accessor: (r) => r.amount, align: "right" },
];

export default function DataTableVariantsDemo() {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2">
      <DataTable
        title="账单明细（Minimal + Striped）"
        variant="minimal"
        density="compact"
        striped
        loading={loading}
        data={INVOICES}
        columns={COLUMNS}
        getRowId={(r) => r.id}
        onRowClick={(row) => setActive(`已查看 ${row.number}（${row.amount}）`)}
        toolbarActions={
          <Button variant="secondary" size="sm" onClick={() => setLoading((v) => !v)}>
            {loading ? "恢复数据" : "预览骨架态"}
          </Button>
        }
      />
      {active && <p className="m-0 px-1 font-mono text-xs text-muted-foreground">{active}</p>}
    </div>
  );
}
