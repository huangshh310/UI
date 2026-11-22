"use client";

import { Badge, Spinner } from "@matt-ui/ui";

export default function SpinnerInlineDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="inline-flex items-center gap-2 rounded-lg border border-solid border-border bg-card px-3 py-2 text-xs text-foreground shadow-xs">
        <Spinner size="xs" label="校验中" />
        <span>正在同步 Registry 索引…</span>
      </div>
      <Badge variant="secondary" className="gap-1.5 py-1">
        <Spinner size="xs" label="构建中" />
        <span>构建中</span>
      </Badge>
    </div>
  );
}
