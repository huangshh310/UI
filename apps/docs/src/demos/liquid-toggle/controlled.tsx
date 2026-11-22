"use client";

import { LiquidToggle } from "@matt-ui/motion";
import { useId, useState } from "react";

export default function LiquidToggleControlledDemo() {
  const id = useId();
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-solid border-border bg-card px-4 py-3 text-sm shadow-xs">
      <LiquidToggle checked={enabled} onCheckedChange={setEnabled} aria-labelledby={id} />
      <div className="flex flex-col">
        <span id={id} className="text-xs font-medium text-foreground">
          边缘缓存预热
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {enabled ? "已开启" : "已暂停"}
        </span>
      </div>
    </div>
  );
}
