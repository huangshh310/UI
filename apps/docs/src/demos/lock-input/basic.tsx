"use client";

/**
 * 示例：LockInput 的聚焦锁定环与锁定只读态。
 */
import { LockInput } from "@matt-ui/ui";

export const LockInputBasic = () => (
  <div className="flex w-full max-w-xs flex-col gap-4">
    <LockInput
      label="工作邮箱"
      type="email"
      placeholder="you@studio.dev"
      hint="点击输入框查看焦点环由内向外的锁定反馈。"
    />
    <LockInput label="项目标识" defaultValue="prj_matt_01" locked />
  </div>
);
