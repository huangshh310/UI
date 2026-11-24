"use client";

import { ReorderList } from "@matt-ui/motion";
import { useState } from "react";

const TASKS = [
  { id: "lint", title: "静态检查与格式校验", subtitle: "Oxlint + Prettier", badge: "Step 1" },
  { id: "unit", title: "组件行为单元测试", subtitle: "Vitest 公开入口断言", badge: "Step 2" },
  {
    id: "registry",
    title: "生成与验证 Registry",
    subtitle: "CLI 真实拉取与编译安装",
    badge: "Step 3",
  },
  { id: "e2e", title: "双主题 E2E 与 axe 审计", subtitle: "Playwright Chromium", badge: "Step 4" },
];

export default function ReorderListBasicDemo() {
  const [order, setOrder] = useState(TASKS.map((t) => t.id));

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <ReorderList ariaLabel="发布检查顺序" items={TASKS} value={order} onValueChange={setOrder} />
      <span className="font-mono text-xs text-muted-foreground">当前顺序：{order.join(" → ")}</span>
    </div>
  );
}
