"use client";

import { DragToConfirm } from "@matt-ui/motion";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

export default function DragToConfirmReleaseDemo() {
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2.5">
      <DragToConfirm
        tone="destructive"
        icon={<RotateCcw className="size-4" aria-hidden="true" />}
        label="滑动触发全量边缘回滚"
        confirmedLabel="已下发回滚指令"
        onConfirm={() => setDone(true)}
        onReset={() => setDone(false)}
      />
      <span className="font-mono text-xs text-muted-foreground">
        {done ? "回滚任务已进入队列" : "支持拖拽或聚焦滑块后按 Enter 确认"}
      </span>
    </div>
  );
}
