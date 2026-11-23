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
