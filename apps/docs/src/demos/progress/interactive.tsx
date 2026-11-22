"use client";

import { Button, Progress } from "@matt-ui/ui";
import { useState } from "react";

export default function ProgressInteractiveDemo() {
  const [value, setValue] = useState(64);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Progress value={value} tone="signal" size="md" showValue label="构建流水线进度" />
      <Progress value={null} tone="primary" size="sm" label="等待边缘节点同步（不确定态）" />
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.max(0, v - 16))}>
          -16%
        </Button>
        <Button size="sm" variant="signal" onClick={() => setValue((v) => Math.min(100, v + 16))}>
          +16%
        </Button>
      </div>
    </div>
  );
}
