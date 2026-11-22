"use client";

import { SplitButton } from "@matt-ui/ui";
import { useState } from "react";

export default function SplitButtonReleaseDemo() {
  const [target, setTarget] = useState("尚未发布");

  return (
    <div className="flex flex-col items-center gap-2.5">
      <SplitButton
        menuLabel="更多发布方式"
        onClick={() => setTarget("立即发布至 Production")}
        actions={[
          { id: "staging", label: "先发布至 Staging", onSelect: () => setTarget("发布至 Staging") },
          { id: "canary", label: "灰度 10% 流量", onSelect: () => setTarget("灰度 10% 流量") },
          {
            id: "schedule",
            label: "定时明天 09:00 发布",
            onSelect: () => setTarget("已安排定时发布"),
          },
        ]}
      >
        立即发布
      </SplitButton>
      <span className="font-mono text-xs text-muted-foreground">{target}</span>
    </div>
  );
}
