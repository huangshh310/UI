"use client";

import { HoldToConfirm } from "@matt-ui/motion";
import { Flame, RefreshCw } from "lucide-react";

export default function HoldToConfirmDestructiveDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <HoldToConfirm
        tone="destructive"
        holdDurationMs={1100}
        icon={<Flame aria-hidden="true" />}
        label="长按清空边缘缓存"
        confirmedLabel="缓存已清空"
      />
      <HoldToConfirm
        tone="signal"
        holdDurationMs={600}
        icon={<RefreshCw aria-hidden="true" />}
        label="快速长按（0.6s）同步"
        confirmedLabel="同步完成"
      />
    </div>
  );
}
