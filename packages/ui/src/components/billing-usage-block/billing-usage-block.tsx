"use client";

/**
 * BillingUsageBlock：由 Card、Badge、Alert、Progress、DataTable 与 Button 组合的订阅与配额账单区块。
 */
import { cn } from "@matt-ui/utils";
import { CreditCard } from "lucide-react";
import { Alert } from "../alert/index.js";
import { Badge } from "../badge/index.js";
import { Button } from "../button/index.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card/index.js";
import { DataTable, type DataTableColumn } from "../data-table/index.js";
import { Progress } from "../progress/index.js";
import { Separator } from "../separator/index.js";
import type {
  BillingUsageBlockProps,
  InvoiceRecord,
  UsageQuota,
} from "./billing-usage-block.types.js";

const DEFAULT_QUOTAS: UsageQuota[] = [
  { id: "api", label: "API 调用配额", usedLabel: "842K / 1M 次", value: 84, tone: "signal" },
  { id: "cdn", label: "Registry 边缘流量", usedLabel: "118 / 200 GB", value: 59, tone: "primary" },
  { id: "seats", label: "团队活跃席位", usedLabel: "7 / 10 席", value: 70, tone: "success" },
];

const DEFAULT_INVOICES: InvoiceRecord[] = [
  {
    id: "INV-2026-11",
    date: "2026-11-01",
    plan: "专业版（月付）",
    amount: "¥199.00",
    status: "已支付",
  },
  {
    id: "INV-2026-10",
    date: "2026-10-01",
    plan: "专业版（月付）",
    amount: "¥199.00",
    status: "已支付",
  },
  {
    id: "INV-2026-09",
    date: "2026-09-01",
    plan: "专业版（月付）",
    amount: "¥199.00",
    status: "已支付",
  },
];

const INVOICE_COLUMNS: DataTableColumn<InvoiceRecord>[] = [
  { id: "id", header: "发票编号", accessor: (row) => row.id, sortable: true },
  { id: "date", header: "账单日期", accessor: (row) => row.date, sortable: true },
  { id: "plan", header: "订阅项目", accessor: (row) => row.plan },
  {
    id: "status",
    header: "状态",
    accessor: (row) => row.status,
    cell: (row) => (
      <Badge variant={row.status === "已支付" ? "success" : "warning"} dot>
        {row.status}
      </Badge>
    ),
  },
  { id: "amount", header: "金额", accessor: (row) => row.amount, align: "right" },
];

const QuotaGrid = ({ quotas }: { quotas: UsageQuota[] }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
    {quotas.map((quota) => (
      <div
        key={quota.id}
        className="flex flex-col gap-2 rounded-xl border border-solid border-border bg-secondary/35 p-4"
      >
        <Progress value={quota.value} tone={quota.tone} showValue label={quota.label} />
        <p className="m-0 font-mono text-[11px] text-muted-foreground tabular-nums">
          {quota.usedLabel}
        </p>
      </div>
    ))}
  </div>
);

export const BillingUsageBlock = ({
  planName = "专业版 · 团队计划",
  priceLabel = "¥199 / 月",
  quotas = DEFAULT_QUOTAS,
  invoices = DEFAULT_INVOICES,
  onUpgrade,
  className,
}: BillingUsageBlockProps) => (
  <Card data-slot="billing-usage-block" className={cn("w-full", className)}>
    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>{planName}</CardTitle>
          <Badge variant="secondary">当前生效</Badge>
        </div>
        <CardDescription className="mt-1">
          下一次自动扣费日期为 2026-12-01，当前周期费用 {priceLabel}。
        </CardDescription>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" className="rounded-full">
          <CreditCard className="size-3.5" />
          <span>支付方式</span>
        </Button>
        <Button size="sm" variant="primary" className="rounded-full" onClick={onUpgrade}>
          升级企业版
        </Button>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col gap-5">
      <Alert
        variant="info"
        title="API 配额使用已超过 80%"
        description="开启自动弹性扩容或升级至企业版可获得无上限边缘分发与专属 SLA。"
      />
      <QuotaGrid quotas={quotas} />
      <Separator />
      <DataTable
        title="历史账单与发票"
        description="点击列头可按日期或编号排序，支持实时检索"
        columns={INVOICE_COLUMNS}
        data={invoices}
        getRowId={(row) => row.id}
        searchable
        pageSize={5}
      />
    </CardContent>
  </Card>
);
