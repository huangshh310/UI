"use client";

/**
 * 示例：PromptQueue 紧凑密度（size="sm"）与悬浮卡片变体（variant="elevated"）。
 */
import { PromptQueue, type QueuedPromptItem } from "@matt-ui/motion";
import { useState } from "react";

const COMPACT_ITEMS: QueuedPromptItem[] = [
  { id: "c1", content: "执行 pnpm typecheck 并汇总错误行号", meta: "2 文件" },
  { id: "c2", content: "把变更说明整理成 PR 描述模板", priority: "high" },
];

export default function PromptQueueVariantsDemo() {
  const [items, setItems] = useState(COMPACT_ITEMS);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <PromptQueue
        items={items}
        variant="elevated"
        size="sm"
        statusLabel="当前工具调用完成后自动继续"
        onRemove={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
        onClearAll={() => setItems([])}
      />
      {items.length === 0 && (
        <button
          type="button"
          onClick={() => setItems(COMPACT_ITEMS)}
          className="h-8 w-fit cursor-pointer rounded-lg border border-solid border-border bg-card px-3 font-sans text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-accent outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/10"
        >
          恢复演示队列
        </button>
      )}
    </div>
  );
}
