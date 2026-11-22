"use client";

import { HoldToConfirm } from "@matt-ui/motion";

export default function HoldToConfirmDestructiveDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <HoldToConfirm
        tone="destructive"
        holdDurationMs={1100}
        label="长按清空边缘缓存"
        confirmedLabel="缓存已清空"
      />
      <HoldToConfirm
        tone="signal"
        holdDurationMs={600}
        label="快速长按（0.6s）同步"
        confirmedLabel="同步完成"
      />
    </div>
  );
}
