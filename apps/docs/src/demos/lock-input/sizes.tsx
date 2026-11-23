"use client";

/**
 * 示例：LockInput 的三种尺寸规格与前后缀、快捷键提示。
 */
import { LockInput } from "@matt-ui/ui";
import { Globe, Search } from "lucide-react";

export const LockInputSizes = () => (
  <div className="flex w-full max-w-md flex-col gap-4">
    <LockInput
      label="紧凑 · sm"
      size="sm"
      prefix={<Globe className="size-3.5" />}
      defaultValue="docs.matt.dev"
      mono
      copyable
    />
    <LockInput
      label="标准 · md"
      size="md"
      prefix={<span className="font-mono text-xs">https://</span>}
      suffix={<span className="font-mono text-xs">.studio.dev</span>}
      defaultValue="workspace"
      clearable
    />
    <LockInput
      label="宽松 · lg"
      size="lg"
      prefix={<Search className="size-4" />}
      placeholder="输入组件名或快捷键…"
      shortcut="⌘K"
      clearable
    />
  </div>
);
