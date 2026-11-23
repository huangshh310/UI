"use client";

/**
 * 示例：只读锁定态、错误校验态与禁用态。
 */
import { LockInput } from "@matt-ui/ui";
import { KeyRound } from "lucide-react";

export default function LockInputErrorDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <LockInput
        label="Webhook 密钥"
        prefix={<KeyRound className="size-4" />}
        defaultValue="whsec_live_9821f3a0"
        mono
        locked
        copyable
        hint="已锁定生产密钥，防止误编辑，支持直接复制。"
      />
      <LockInput
        label="回调签名密钥"
        defaultValue="short"
        mono
        clearable
        error="密钥长度不能少于 16 个字符。"
      />
      <LockInput
        label="归档环境标识"
        defaultValue="legacy_v1_readonly"
        mono
        disabled
        hint="已归档环境字段不可编辑。"
      />
    </div>
  );
}
