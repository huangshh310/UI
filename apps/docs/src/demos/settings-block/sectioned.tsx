"use client";

import { SettingsBlock } from "@matt-ui/ui";
import { useState } from "react";

export default function SettingsBlockSectionedDemo() {
  const [summary, setSummary] = useState("");

  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      <SettingsBlock
        variant="sectioned"
        title="欧盟集群合规配置"
        description="按模块独立卡片分区管理区域驻留、协作成员与自动化门禁。"
        defaultRegion="eu-central-1"
        onSave={({ region, releaseAlert, auditAlert }) =>
          setSummary(
            `已同步 ${region}（发布告警：${releaseAlert ? "开" : "关"} / 无障碍巡检：${auditAlert ? "开" : "关"}）`,
          )
        }
      />
      {summary && <p className="m-0 font-mono text-xs text-muted-foreground">{summary}</p>}
    </div>
  );
}
