"use client";

import { CommandMenu, type CommandMenuGroup } from "@matt-ui/ui";
import { Hammer, PackageCheck, ShieldCheck, TestTube2 } from "lucide-react";
import { useState } from "react";

const buildActionGroups = (onLog: (msg: string) => void): CommandMenuGroup[] => [
  {
    heading: "构建与分发",
    items: [
      {
        id: "reg",
        label: "重新生成 shadcn Registry",
        description: "同步全部 71 个组件清单与源码文件",
        icon: <PackageCheck className="size-3.5" />,
        shortcut: "G R",
        onSelect: () => onLog("执行 pnpm registry:generate"),
      },
      {
        id: "build",
        label: "全量工作区构建",
        description: "通过 Turborepo 并行构建所有包",
        icon: <Hammer className="size-3.5" />,
        shortcut: "G B",
        onSelect: () => onLog("执行 pnpm build"),
      },
    ],
  },
  {
    heading: "质量门禁",
    items: [
      {
        id: "e2e",
        label: "运行 Playwright 双主题 E2E",
        icon: <TestTube2 className="size-3.5" />,
        badge: "CI",
        onSelect: () => onLog("执行 docs e2e"),
      },
      {
        id: "a11y",
        label: "审计 WCAG AA 对比度",
        icon: <ShieldCheck className="size-3.5" />,
        onSelect: () => onLog("执行对比度巡检"),
      },
    ],
  },
];

export default function CommandMenuActionsDemo() {
  const [log, setLog] = useState("点击按钮或使用键盘检索开发命令");

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-2.5">
      <CommandMenu triggerLabel="执行工程指令…" groups={buildActionGroups(setLog)} />
      <span className="font-mono text-xs text-muted-foreground">{log}</span>
    </div>
  );
}
