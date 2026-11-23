"use client";

/**
 * 示例：LockInput 的聚焦锁定环、一键清空与只读复制锁定态。
 */
import { LockInput } from "@matt-ui/ui";
import { Hash, Mail } from "lucide-react";

export const LockInputBasic = () => (
  <div className="flex w-full max-w-sm flex-col gap-4">
    <LockInput
      label="工作邮箱"
      labelExtra="必填"
      type="email"
      prefix={<Mail className="size-4" />}
      placeholder="you@studio.dev"
      clearable
      hint="聚焦时聚焦环由中心收拢锁定到边框。"
    />
    <LockInput
      label="项目标识"
      labelExtra="只读"
      prefix={<Hash className="size-4" />}
      defaultValue="prj_matt_01"
      mono
      locked
      copyable
    />
  </div>
);
