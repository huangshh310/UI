"use client";

import { Separator } from "@matt-ui/ui";

export default function SeparatorVerticalDemo() {
  return (
    <div className="inline-flex h-10 items-center gap-3 rounded-xl border border-solid border-border bg-card px-4 text-xs font-medium text-foreground shadow-xs">
      <span>组件源码</span>
      <Separator orientation="vertical" className="h-4" />
      <span>Token 主题</span>
      <Separator orientation="vertical" className="h-4" />
      <span>无障碍规范</span>
    </div>
  );
}
