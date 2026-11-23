"use client";

import { StaggeredList } from "@matt-ui/motion";
import { Badge, Button } from "@matt-ui/ui";
import { useState } from "react";

interface TaskItem {
  id: string;
  title: string;
  meta: string;
  category: "quality" | "release";
}

const ITEMS: TaskItem[] = [
  { id: "contrast", title: "Token 对比度校验", meta: "4.5:1 AA 通过", category: "quality" },
  { id: "registry", title: "Registry 源码扁平化", meta: "64 条目就绪", category: "release" },
  { id: "axe", title: "Playwright 双主题审计", meta: "零 axe 违规", category: "quality" },
  { id: "bundle", title: "ESM 产物按需裁剪", meta: "Tree-Shaking", category: "release" },
];

const FILTERS = [
  { id: "all" as const, label: "全部" },
  { id: "quality" as const, label: "质量门禁" },
  { id: "release" as const, label: "发布流水" },
];

export default function StaggeredListBasicDemo() {
  const [filter, setFilter] = useState<"all" | "quality" | "release">("all");
  const visibleItems = filter === "all" ? ITEMS : ITEMS.filter((item) => item.category === filter);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center gap-1.5">
        {FILTERS.map((tab) => (
          <Button
            key={tab.id}
            size="sm"
            variant={filter === tab.id ? "primary" : "outline"}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <StaggeredList variant="fade-up" staggerMs={45} distance={12}>
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-solid border-border/90 bg-card px-4 py-3 text-xs shadow-xs"
          >
            <span className="font-medium text-foreground">{item.title}</span>
            <Badge variant="secondary" className="font-mono text-[11px]">
              {item.meta}
            </Badge>
          </div>
        ))}
      </StaggeredList>
    </div>
  );
}
