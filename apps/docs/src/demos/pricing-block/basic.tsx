"use client";

import { PricingBlock } from "@matt-ui/motion";
import { useState } from "react";

export default function PricingBlockBasicDemo() {
  const [picked, setPicked] = useState("");

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <PricingBlock onSelectPlan={(id, cycle) => setPicked(`已选择 ${id}（${cycle}）`)} />
      {picked && <span className="font-mono text-xs text-muted-foreground">{picked}</span>}
    </div>
  );
}
