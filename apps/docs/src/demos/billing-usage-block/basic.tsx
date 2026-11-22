"use client";

import { BillingUsageBlock } from "@matt-ui/ui";
import { useState } from "react";

export default function BillingUsageBlockBasicDemo() {
  const [status, setStatus] = useState("");
  return (
    <div className="flex w-full flex-col gap-2">
      <BillingUsageBlock onUpgrade={() => setStatus("已触发企业版升级方案咨询")} />
      {status && <p className="m-0 px-1 font-mono text-xs text-muted-foreground">{status}</p>}
    </div>
  );
}
