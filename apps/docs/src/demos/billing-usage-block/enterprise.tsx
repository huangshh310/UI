"use client";

import { BillingUsageBlock } from "@matt-ui/ui";

export default function BillingUsageBlockEnterpriseDemo() {
  return (
    <BillingUsageBlock
      planName="企业版 · 专属节点"
      priceLabel="¥699 / 月"
      quotas={[
        {
          id: "api",
          label: "边缘 API 请求",
          usedLabel: "4.2M / 10M 次",
          value: 42,
          tone: "success",
        },
        {
          id: "cdn",
          label: "全球 Registry 分发",
          usedLabel: "320 / 1000 GB",
          value: 32,
          tone: "signal",
        },
        { id: "seats", label: "组织席位", usedLabel: "28 / 50 席", value: 56, tone: "primary" },
      ]}
    />
  );
}
