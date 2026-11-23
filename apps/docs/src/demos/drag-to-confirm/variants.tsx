"use client";

import { DragToConfirm } from "@matt-ui/motion";
import { ShieldAlert, Wallet } from "lucide-react";

export default function DragToConfirmVariantsDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <DragToConfirm
        tone="emerald"
        variant="glass"
        size="sm"
        icon={<Wallet className="size-4" aria-hidden="true" />}
        label="滑动支付 ¥299.00"
        confirmedLabel="支付已发起"
      />
      <DragToConfirm
        tone="destructive"
        variant="subtle"
        size="md"
        icon={<ShieldAlert className="size-4" aria-hidden="true" />}
        label="滑动注销当前空间"
        confirmedLabel="已进入注销队列"
      />
    </div>
  );
}
