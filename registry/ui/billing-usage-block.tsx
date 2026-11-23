// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * BillingUsageBlock：由 Card、Badge、Alert、Progress、DataTable 与 Button 组合的订阅与配额账单区块。
 */

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CreditCard } from "lucide-react";

export const BILLING_DEFAULT_QUOTAS: UsageQuota[] = [
  { id: "api", label: "API 调用配额", usedLabel: "842K / 1M 次", value: 84, tone: "signal" },
  { id: "cdn", label: "Registry 边缘流量", usedLabel: "118 / 200 GB", value: 59, tone: "primary" },
  { id: "seats", label: "团队活跃席位", usedLabel: "7 / 10 席", value: 70, tone: "success" },
];

export const BILLING_DEFAULT_INVOICES: InvoiceRecord[] = [
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

export const BILLING_QUOTA_PILL_CLASS = {
  warning:
    "border-amber-600/25 bg-amber-500/14 text-amber-900 dark:border-amber-400/25 dark:bg-amber-500/16 dark:text-amber-200",
  healthy:
    "border-emerald-600/20 bg-emerald-500/12 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/16 dark:text-emerald-300",
} as const;
export type BillingUsageVariant = "default" | "elevated" | "subtle";

export interface UsageQuota {
  id: string;
  label: string;
  usedLabel: string;
  value: number;
  tone?: "signal" | "primary" | "success" | "warning";
}

export interface InvoiceRecord {
  id: string;
  date: string;
  plan: string;
  amount: string;
  status: "已支付" | "待处理";
}

export interface BillingUsageBlockProps {
  /** 当前套餐名称 */
  planName?: string;
  /** 月费描述 */
  priceLabel?: string;
  /** 下次续费日期文案 */
  renewalDate?: string;
  /** 支付方式摘要 */
  paymentMethod?: string;
  /** 升级按钮文案 */
  upgradeLabel?: string;
  /** 卡片视觉变体 */
  variant?: BillingUsageVariant;
  /** 紧凑模式（隐藏发票表格并收紧间距） */
  compact?: boolean;
  /** 是否展示历史账单表格 */
  showInvoices?: boolean;
  /** 资源配额列表 */
  quotas?: UsageQuota[];
  /** 发票记录列表 */
  invoices?: InvoiceRecord[];
  /** 点击升级回调 */
  onUpgrade?: () => void;
  /** 点击管理支付方式回调 */
  onManagePayment?: () => void;
  /** 自定义类名 */
  className?: string;
}
const INVOICE_COLUMNS: DataTableColumn<InvoiceRecord>[] = [
  { id: "id", header: "发票编号", accessor: (row) => row.id, sortable: true },
  { id: "date", header: "账单日期", accessor: (row) => row.date, sortable: true },
  { id: "plan", header: "订阅项目", accessor: (row) => row.plan },
  {
    id: "status",
    header: "状态",
    accessor: (row) => row.status,
    cell: (row) => (
      <Badge variant={row.status === "已支付" ? "success" : "warning"} size="sm" dot>
        {row.status}
      </Badge>
    ),
  },
  { id: "amount", header: "金额", accessor: (row) => row.amount, align: "right" },
];

const BILLING_DEFAULTS = {
  planName: "专业版 · 团队计划",
  priceLabel: "¥199 / 月",
  renewalDate: "2026-12-01",
  paymentMethod: "Visa •••• 4242",
  upgradeLabel: "升级企业版",
  variant: "default" as const,
  compact: false,
  showInvoices: true,
  quotas: BILLING_DEFAULT_QUOTAS,
  invoices: BILLING_DEFAULT_INVOICES,
};

const BillingHeader = ({
  planName,
  priceLabel,
  renewalDate,
  paymentMethod,
  upgradeLabel,
  onManagePayment,
  onUpgrade,
}: {
  planName: string;
  priceLabel: string;
  renewalDate: string;
  paymentMethod: string;
  upgradeLabel: string;
  onManagePayment?: () => void;
  onUpgrade?: () => void;
}) => (
  <CardHeader className="flex flex-col gap-4 border-b border-solid border-border/75 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <CardTitle>{planName}</CardTitle>
        <Badge variant="success" size="sm" dot>
          当前生效
        </Badge>
      </div>
      <CardDescription className="mt-1">
        下次续费 {renewalDate} · {paymentMethod}
      </CardDescription>
    </div>
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="rounded-full border border-solid border-border/80 bg-secondary/50 px-3 py-1 font-mono text-xs font-semibold text-foreground tabular-nums dark:border-white/10 dark:bg-secondary/35">
        {priceLabel}
      </span>
      <Button size="sm" variant="outline" radius="pill" onClick={onManagePayment}>
        <CreditCard className="size-3.5" />
        <span>支付方式</span>
      </Button>
      <Button size="sm" variant="primary" radius="pill" onClick={onUpgrade}>
        <span>{upgradeLabel}</span>
        <ArrowUpRight className="size-3.5" />
      </Button>
    </div>
  </CardHeader>
);

const QuotaCard = ({ quota, compact }: { quota: UsageQuota; compact: boolean }) => {
  const highUsage = quota.value >= 80;
  const remaining = Math.max(0, 100 - quota.value);
  return (
    <div
      data-slot="billing-quota-card"
      className={cn(
        "flex flex-col gap-2.5 rounded-2xl border border-solid border-border/80 bg-secondary/30 transition-colors hover:border-foreground/18 dark:border-white/10 dark:bg-secondary/20 dark:hover:border-white/18",
        compact ? "p-3.5" : "p-4",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-solid px-2 py-0.5 font-mono text-[10px] font-medium",
            highUsage ? BILLING_QUOTA_PILL_CLASS.warning : BILLING_QUOTA_PILL_CLASS.healthy,
          )}
        >
          {highUsage ? "接近上限" : "配额充裕"}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          剩余 {remaining}%
        </span>
      </div>
      <Progress value={quota.value} tone={quota.tone} showValue label={quota.label} />
      <p className="m-0 font-mono text-[11px] text-muted-foreground tabular-nums">
        {quota.usedLabel}
      </p>
    </div>
  );
};

const InvoiceSection = ({ invoices }: { invoices: InvoiceRecord[] }) => (
  <>
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
  </>
);

export const BillingUsageBlock = (props: BillingUsageBlockProps) => {
  const cfg = { ...BILLING_DEFAULTS, ...props };
  const warningQuota = cfg.quotas.find((item) => item.value >= 80);

  return (
    <Card
      variant={cfg.variant}
      data-slot="billing-usage-block"
      className={cn("@container w-full border-border/80 dark:border-white/10", cfg.className)}
    >
      <BillingHeader
        planName={cfg.planName}
        priceLabel={cfg.priceLabel}
        renewalDate={cfg.renewalDate}
        paymentMethod={cfg.paymentMethod}
        upgradeLabel={cfg.upgradeLabel}
        onManagePayment={cfg.onManagePayment}
        onUpgrade={cfg.onUpgrade}
      />
      <CardContent className={cn("flex flex-col pt-5 pb-6", cfg.compact ? "gap-4" : "gap-5")}>
        {warningQuota && (
          <Alert
            variant="warning"
            title={`${warningQuota.label}使用已超过 80%`}
            description="开启自动弹性扩容或升级至企业版可获得无上限边缘分发与专属 SLA。"
          />
        )}
        <div className="grid grid-cols-1 gap-3 @2xl:grid-cols-3">
          {cfg.quotas.map((quota) => (
            <QuotaCard key={quota.id} quota={quota} compact={cfg.compact} />
          ))}
        </div>
        {cfg.showInvoices && !cfg.compact && <InvoiceSection invoices={cfg.invoices} />}
      </CardContent>
    </Card>
  );
};
