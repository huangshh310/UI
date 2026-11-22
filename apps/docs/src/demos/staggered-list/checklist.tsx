"use client";

import { StaggeredList } from "@matt-ui/motion";
import { Check } from "lucide-react";

const CHECKS = [
  "浅色与深色对比度 >= 4.5:1",
  "所有交互原语单一底座隔离（ADR-001）",
  "shadcn Registry 独立 Vite 消费构建通过",
];

export default function StaggeredListChecklistDemo() {
  return (
    <div className="w-full max-w-sm">
      <StaggeredList staggerMs={70} className="flex flex-col gap-2">
        {CHECKS.map((text) => (
          <div
            key={text}
            className="flex items-center gap-2.5 rounded-xl border border-solid border-border bg-card px-3.5 py-2.5 text-xs text-foreground shadow-xs"
          >
            <Check aria-hidden="true" className="size-3.5 shrink-0 text-signal" />
            <span>{text}</span>
          </div>
        ))}
      </StaggeredList>
    </div>
  );
}
