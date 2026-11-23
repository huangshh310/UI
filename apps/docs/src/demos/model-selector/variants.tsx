"use client";

/**
 * 示例：ModelSelector 三种触发器变体（pill / ghost / glass）对比。
 */
import { ModelSelector } from "@matt-ui/ui";

export default function ModelSelectorVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ModelSelector variant="pill" defaultModelId="pro" />
      <ModelSelector variant="ghost" defaultModelId="flash" defaultEffort="fast" />
      <ModelSelector variant="glass" size="sm" defaultModelId="deep" defaultEffort="deep" />
    </div>
  );
}
