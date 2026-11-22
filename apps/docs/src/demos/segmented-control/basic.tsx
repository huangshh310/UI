"use client";

import { SegmentedControl } from "@matt-ui/motion";
import { useState } from "react";

export default function SegmentedControlBasicDemo() {
  const [mode, setMode] = useState("chat");

  return (
    <div className="flex flex-col items-center gap-2.5">
      <SegmentedControl
        ariaLabel="工作台模式"
        value={mode}
        onValueChange={setMode}
        items={[
          { value: "chat", label: "智能对话" },
          { value: "voice", label: "实时语音", badge: "Live" },
          { value: "research", label: "深度研究" },
        ]}
      />
      <span className="font-mono text-xs text-muted-foreground">当前模式：{mode}</span>
    </div>
  );
}
