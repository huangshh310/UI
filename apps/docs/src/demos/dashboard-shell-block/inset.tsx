"use client";

import { DashboardShellBlock, type DashboardKpiItem } from "@matt-ui/ui";
import { useState } from "react";

const CUSTOM_KPIS: DashboardKpiItem[] = [
  { label: "边缘函数调用", value: "4.8M", delta: "+18%", tone: "success" },
  { label: "缓存命中率", value: "98.4%", delta: "+0.6%", tone: "success" },
  { label: "当前构建队列", value: "2", delta: "空闲", tone: "secondary" },
];

export default function DashboardShellBlockInsetDemo() {
  const [notice, setNotice] = useState("");

  return (
    <div className="flex w-full flex-col gap-2.5">
      <DashboardShellBlock
        workspaceName="Studio Ops"
        workspaceTier="Enterprise · Multi-Region"
        variant="inset"
        primaryActionLabel="触发生产发布"
        kpis={CUSTOM_KPIS}
        onNavChange={(navId) => setNotice(`已切换至分组：${navId}`)}
        onPrimaryAction={() => setNotice("已创建发布任务 #rel-2048")}
      />
      {notice && <span className="font-mono text-xs text-muted-foreground">{notice}</span>}
    </div>
  );
}
