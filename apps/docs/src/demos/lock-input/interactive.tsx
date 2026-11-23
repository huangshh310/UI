"use client";

/**
 * 示例：可切换锁定编辑、密钥显隐与一键复制、字数统计。
 */
import { LockInput } from "@matt-ui/ui";
import { KeyRound, Link2, Sparkles } from "lucide-react";
import { useState } from "react";

export const LockInputInteractive = () => {
  const [endpointLocked, setEndpointLocked] = useState(true);

  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <LockInput
        label="生产 API 端点"
        labelExtra={endpointLocked ? "点击锁图标解锁" : "编辑中"}
        prefix={<Link2 className="size-4" />}
        defaultValue="https://api.matt.dev/v2"
        mono
        lockable
        locked={endpointLocked}
        onLockedChange={setEndpointLocked}
        copyable
        hint="默认锁定防止误改，点击右侧锁按钮即可临时解锁编辑。"
      />
      <LockInput
        label="API 访问令牌"
        type="password"
        prefix={<KeyRound className="size-4" />}
        defaultValue="sk_live_9821f3a0c4d7e1"
        mono
        revealable
        copyable
        hint="支持一键切换明文预览或直接复制完整令牌。"
      />
      <LockInput
        label="版本发布说明"
        prefix={<Sparkles className="size-4" />}
        defaultValue="v1.4.0 表单组件交互升级"
        clearable
        showCount
        maxLength={32}
        hint="用于变更日志摘要展示。"
      />
    </div>
  );
};
