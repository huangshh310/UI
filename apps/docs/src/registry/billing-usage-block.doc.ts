import BillingUsageBlockBasicDemo from "@/demos/billing-usage-block/basic";
import BillingUsageBlockEnterpriseDemo from "@/demos/billing-usage-block/enterprise";
import type { ComponentDoc } from "./registry.types";

export const BILLING_USAGE_BLOCK_DOC: ComponentDoc = {
  slug: "billing-usage-block",
  name: "Billing Usage Block",
  description:
    "由 Card、Badge、Alert、Progress 与 DataTable 组合的订阅套餐、资源配额与历史账单区块。",
  category: "blocks",
  registryName: "billing-usage-block",
  dependencies: ["@base-ui/react", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { BillingUsageBlock } from "@/components/ui/billing-usage-block";

export function Example() {
  return <BillingUsageBlock />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "团队订阅、配额预警与账单历史",
      description:
        "组合当前套餐头、配额超限 Alert、三组资源 Progress 卡片以及可排序检索的发票 DataTable。",
      file: "billing-usage-block/basic.tsx",
      Demo: BillingUsageBlockBasicDemo,
    },
    {
      slug: "enterprise",
      name: "企业专属节点高配额精简视图",
      description:
        '结合 variant="elevated"、compact 与自定义 quotas 展示低负载配额健康度与快速扩容入口。',
      file: "billing-usage-block/enterprise.tsx",
      Demo: BillingUsageBlockEnterpriseDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "planName",
      type: "string",
      defaultValue: '"专业版 · 团队计划"',
      description: "当前订阅套餐名",
    },
    {
      name: "priceLabel",
      type: "string",
      defaultValue: '"¥199 / 月"',
      description: "当前周期价格文案",
    },
    {
      name: "renewalDate",
      type: "string",
      defaultValue: '"2026-12-01"',
      description: "下次自动续费日期文案",
    },
    {
      name: "paymentMethod",
      type: "string",
      defaultValue: '"Visa •••• 4242"',
      description: "当前默认支付方式摘要",
    },
    {
      name: "upgradeLabel",
      type: "string",
      defaultValue: '"升级企业版"',
      description: "主升级操作按钮文案",
    },
    {
      name: "variant",
      type: '"default" | "elevated" | "subtle"',
      defaultValue: '"default"',
      description: "外层卡片容器变体",
    },
    {
      name: "compact",
      type: "boolean",
      defaultValue: "false",
      description: "紧凑模式，收紧内边距并隐藏账单表",
    },
    {
      name: "showInvoices",
      type: "boolean",
      defaultValue: "true",
      description: "是否显示历史发票表格",
    },
    {
      name: "quotas",
      type: "UsageQuota[]",
      defaultValue: "内置 3 项",
      description: "资源配额进度条目",
    },
    {
      name: "invoices",
      type: "InvoiceRecord[]",
      defaultValue: "内置示例",
      description: "历史发票数据",
    },
    { name: "onUpgrade", type: "() => void", defaultValue: "—", description: "点击升级按钮触发" },
    {
      name: "onManagePayment",
      type: "() => void",
      defaultValue: "—",
      description: "点击支付方式按钮触发",
    },
  ],
  accessibility: [
    "配额进度条完整暴露 aria-valuenow / aria-valuemax 标准无障碍语义。",
    "超限预警同时提供告警图标、状态胶囊文案与百分比读数，不单独依赖颜色区分。",
    "历史账单表格保留 DataTable 的排序状态声明与键盘导航。",
  ],
};
