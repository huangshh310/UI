"use client";

import { StaggeredList } from "@matt-ui/motion";

const ITEMS = [
  { title: "Token 对比度校验", meta: "4.5:1 AA 通过" },
  { title: "Registry 源码扁平化", meta: "64 条目就绪" },
  { title: "Playwright 双主题审计", meta: "零 axe 违规" },
];

export default function StaggeredListBasicDemo() {
  return (
    <StaggeredList className="max-w-sm">
      {ITEMS.map((item) => (
        <div
          key={item.title}
          className="flex items-center justify-between rounded-xl border border-solid border-border bg-card px-4 py-3 text-xs shadow-sm"
        >
          <span className="font-medium text-foreground">{item.title}</span>
          <span className="font-mono text-muted-foreground">{item.meta}</span>
        </div>
      ))}
    </StaggeredList>
  );
}
