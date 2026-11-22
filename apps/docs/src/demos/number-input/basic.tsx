"use client";

import { NumberInput } from "@matt-ui/ui";
import { useState } from "react";

export default function NumberInputBasicDemo() {
  const [workers, setWorkers] = useState<number | null>(8);
  const [budget, setBudget] = useState<number | null>(1280);

  return (
    <div className="flex flex-wrap items-end justify-center gap-4">
      <NumberInput
        label="工作线程（可拖拽微调）"
        value={workers}
        onValueChange={setWorkers}
        min={1}
        max={64}
      />
      <NumberInput
        label="月度预算"
        value={budget}
        onValueChange={setBudget}
        min={0}
        max={10000}
        step={100}
        format={{ style: "currency", currency: "CNY", maximumFractionDigits: 0 }}
      />
    </div>
  );
}
