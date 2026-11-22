"use client";

import { SettingsBlock } from "@matt-ui/ui";
import { useState } from "react";

export default function SettingsBlockProductionDemo() {
  const [savedInfo, setSavedInfo] = useState("");
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <SettingsBlock
        onSave={({ region, releaseAlert }) =>
          setSavedInfo(`已应用区域 ${region}，发布告警：${releaseAlert ? "开启" : "关闭"}`)
        }
      />
      {savedInfo && <p className="m-0 font-mono text-xs text-muted-foreground">{savedInfo}</p>}
    </div>
  );
}
