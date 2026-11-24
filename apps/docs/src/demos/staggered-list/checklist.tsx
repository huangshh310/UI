"use client";

import { StaggeredList } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { Check, Plus, X } from "lucide-react";
import { useState } from "react";

interface CheckEntry {
  id: string;
  text: string;
}

const INITIAL_CHECKS: CheckEntry[] = [
  { id: "c1", text: "浅色与深色对比度 >= 4.5:1" },
  { id: "c2", text: "所有交互原语单一底座隔离（ADR-001）" },
  { id: "c3", text: "组件 Registry 独立消费方构建验证通过" },
];

const EXTRA_CHECKS: CheckEntry[] = [
  { id: "c4", text: "键盘 Tab 与方向键焦点环完整可见" },
  { id: "c5", text: "prefers-reduced-motion 自动平滑降级" },
];

const CheckRow = ({
  item,
  canRemove,
  onRemove,
}: {
  item: CheckEntry;
  canRemove: boolean;
  onRemove: () => void;
}) => (
  <div className="flex items-center justify-between gap-2.5 rounded-2xl border border-solid border-border/90 bg-card px-3.5 py-2.5 text-xs text-foreground shadow-xs">
    <span className="inline-flex items-center gap-2.5">
      <Check aria-hidden="true" className="size-3.5 shrink-0 text-signal dark:text-blue-400" />
      <span>{item.text}</span>
    </span>
    {canRemove && (
      <button
        type="button"
        aria-label={`移除 ${item.text}`}
        onClick={onRemove}
        className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    )}
  </div>
);

export default function StaggeredListChecklistDemo() {
  const [items, setItems] = useState(INITIAL_CHECKS);
  const nextExtra = EXTRA_CHECKS.find((extra) => !items.some((item) => item.id === extra.id));

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          发布前检查项（{items.length}）
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={!nextExtra}
          onClick={() => nextExtra && setItems((prev) => [...prev, nextExtra])}
        >
          <Plus aria-hidden="true" className="size-3.5" />
          <span>添加检查项</span>
        </Button>
      </div>
      <StaggeredList
        variant="slide-left"
        staggerMs={60}
        distance={14}
        className="flex flex-col gap-2"
      >
        {items.map((item) => (
          <CheckRow
            key={item.id}
            item={item}
            canRemove={items.length > 1}
            onRemove={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
          />
        ))}
      </StaggeredList>
    </div>
  );
}
