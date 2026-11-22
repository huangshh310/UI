"use client";

import { LockInput } from "@matt-ui/ui";
import { KeyRound } from "lucide-react";

export default function LockInputErrorDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3.5">
      <LockInput
        label="Webhook 密钥"
        prefix={<KeyRound className="size-3.5 text-muted-foreground" />}
        defaultValue="whsec_live_9821f3a0"
        locked
        hint="已锁定生产密钥，防止误编辑。"
      />
      <LockInput label="回调签名密钥" defaultValue="short" error="密钥长度不能少于 16 个字符。" />
    </div>
  );
}
