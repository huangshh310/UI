"use client";

import { HoldToConfirm } from "@matt-ui/motion";
import { ShieldCheck, Trash2 } from "lucide-react";

export default function HoldToConfirmVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <HoldToConfirm
        variant="solid"
        tone="emerald"
        icon={<ShieldCheck aria-hidden="true" />}
        label="长按签发证书"
        confirmedLabel="证书已签发"
      />
      <HoldToConfirm
        variant="outline"
        tone="destructive"
        size="sm"
        radius="default"
        icon={<Trash2 aria-hidden="true" />}
        label="长按删除密钥"
        confirmedLabel="密钥已删除"
      />
    </div>
  );
}
