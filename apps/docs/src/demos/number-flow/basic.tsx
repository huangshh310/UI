"use client";

import { NumberFlow } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { useState } from "react";

const SAMPLES = [1280, 4890, 12450, 860];

export default function NumberFlowBasicDemo() {
  const [idx, setIdx] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <NumberFlow
        value={SAMPLES[idx] ?? 1280}
        prefix="¥"
        suffix="/月"
        className="text-4xl"
        format={{ maximumFractionDigits: 0 }}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIdx((current) => (current + 1) % SAMPLES.length)}
      >
        切换指标数值
      </Button>
    </div>
  );
}
