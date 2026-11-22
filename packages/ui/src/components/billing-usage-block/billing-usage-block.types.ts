export interface UsageQuota {
  id: string;
  label: string;
  usedLabel: string;
  value: number;
  tone?: "signal" | "primary" | "success";
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
  /** 资源配额列表 */
  quotas?: UsageQuota[];
  /** 发票记录列表 */
  invoices?: InvoiceRecord[];
  /** 点击升级回调 */
  onUpgrade?: () => void;
  /** 自定义类名 */
  className?: string;
}
