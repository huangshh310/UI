import type { InvoiceRecord, UsageQuota } from "./billing-usage-block.types.js";

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
