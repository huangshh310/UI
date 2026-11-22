"use client";

import { CommandMenu } from "@matt-ui/ui";
import { useState } from "react";

export default function CommandMenuActionsDemo() {
  const [log, setLog] = useState("点击按钮或使用键盘检索开发命令");

  return (
    <div className="flex flex-col items-center gap-2.5">
      <CommandMenu
        triggerLabel="执行工程指令…"
        groups={[
          {
            heading: "构建与分发",
            items: [
              {
                id: "reg",
                label: "重新生成 shadcn Registry",
                shortcut: "G R",
                onSelect: () => setLog("执行 pnpm registry:generate"),
              },
              {
                id: "build",
                label: "全量工作区构建",
                shortcut: "G B",
                onSelect: () => setLog("执行 pnpm build"),
              },
            ],
          },
          {
            heading: "质量门禁",
            items: [
              {
                id: "e2e",
                label: "运行 Playwright 双主题 E2E",
                onSelect: () => setLog("执行 docs e2e"),
              },
              {
                id: "a11y",
                label: "审计 WCAG AA 对比度",
                onSelect: () => setLog("执行对比度巡检"),
              },
            ],
          },
        ]}
      />
      <span className="font-mono text-xs text-muted-foreground">{log}</span>
    </div>
  );
}
