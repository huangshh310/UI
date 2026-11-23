"use client";

import { SplitButton } from "@matt-ui/ui";
import { CalendarClock, Flame, GitBranch, Trash2 } from "lucide-react";
import { useState } from "react";

export default function SplitButtonReleaseDemo() {
  const [target, setTarget] = useState("尚未发布");

  return (
    <div className="flex flex-col items-center gap-2.5">
      <SplitButton
        variant="signal"
        menuLabel="更多发布方式"
        onClick={() => setTarget("立即发布至 Production")}
        actions={[
          {
            id: "staging",
            label: "先发布至 Staging",
            description: "在预发环境完成回归检查",
            icon: <GitBranch />,
            shortcut: "⌘1",
            onSelect: () => setTarget("发布至 Staging"),
          },
          {
            id: "canary",
            label: "灰度 10% 流量",
            description: "逐步放量观察错误率",
            icon: <Flame />,
            shortcut: "⌘2",
            onSelect: () => setTarget("灰度 10% 流量"),
          },
          {
            id: "schedule",
            label: "定时明天 09:00 发布",
            icon: <CalendarClock />,
            onSelect: () => setTarget("已安排定时发布"),
          },
          {
            id: "abort",
            label: "取消当前发布队列",
            icon: <Trash2 />,
            destructive: true,
            onSelect: () => setTarget("已取消发布队列"),
          },
        ]}
      >
        立即发布
      </SplitButton>
      <span className="font-mono text-xs text-muted-foreground">{target}</span>
    </div>
  );
}
