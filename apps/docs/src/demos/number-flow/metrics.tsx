"use client";

import { NumberFlow } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { useState } from "react";

export default function NumberFlowMetricsDemo() {
  const [requests, setRequests] = useState(12480);

  return (
    <div className="flex flex-col items-center gap-3">
      <NumberFlow
        value={requests}
        suffix=" req/s"
        format={{ maximumFractionDigits: 0 }}
        className="text-3xl font-semibold text-foreground"
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setRequests((n) => Math.max(100, n - 1450))}
        >
          降频 -1,450
        </Button>
        <Button size="sm" variant="signal" onClick={() => setRequests((n) => n + 2840)}>
          峰值 +2,840
        </Button>
      </div>
    </div>
  );
}
