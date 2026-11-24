"use client";

import { PeekCard } from "@matt-ui/ui";

export default function PeekCardBasicDemo() {
  return (
    <p className="m-0 text-sm text-muted-foreground">
      悬停或聚焦订单编号{" "}
      <PeekCard
        triggerLabel="ORD-2026-089"
        href="#order-preview"
        title="ORD-2026-089"
        badge="PAID"
        subtitle="Checkout Gateway"
        value="¥1,290.00"
        identity={{ initials: "林", name: "林知远", meta: "zhiyuan@matt.dev" }}
        metrics={[
          { label: "支付方式", value: "Visa •••• 4242" },
          { label: "手续费", value: "¥19.35" },
          { label: "风控评分", value: "12 / 100" },
        ]}
        footerLeft="2 分钟前"
        status="已结算"
        statusTone="success"
      />{" "}
      查看结算明细。
    </p>
  );
}
