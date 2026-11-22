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
        "组合当前套餐头、配额超限 Alert、三组资源 Progress 条以及可排序检索的发票 DataTable。",
      file: "billing-usage-block/basic.tsx",
      Demo: BillingUsageBlockBasicDemo,
    },
    {
      slug: "enterprise",
      name: "企业专属节点高配额视图",
      description: "通过 planName、priceLabel 与 quotas 自定义企业级配额和计费展示。",
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
  ],
  accessibility: [
    "配额进度条基于 Base UI Progress 暴露 aria-valuenow / aria-valuemax 语义。",
    "历史账单表格保留 DataTable 的排序状态声明与键盘导航。",
  ],
};
