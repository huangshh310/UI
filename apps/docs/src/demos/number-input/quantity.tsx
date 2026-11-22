"use client";

import { NumberInput } from "@matt-ui/ui";
import { useState } from "react";

export default function NumberInputQuantityDemo() {
  const [seats, setSeats] = useState<number | null>(8);

  return (
    <div className="flex flex-col items-center gap-2">
      <NumberInput
        label="团队并发构建席位（1–32）"
        value={seats}
        onValueChange={setSeats}
        min={1}
        max={32}
        step={1}
        scrub={false}
      />
      <span className="font-mono text-xs text-muted-foreground">当前已分配 {seats ?? 0} 席</span>
    </div>
  );
}
