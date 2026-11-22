"use client";

import { Button, Progress } from "@matt-ui/ui";
import { useState } from "react";

export default function ProgressBasicDemo() {
  const [value, setValue] = useState(64);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={value} label="Registry 构建进度" showValue tone="signal" />
      <Progress value={null} label="正在校验依赖签名…" tone="primary" />
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.max(0, v - 16))}>
          -16%
        </Button>
        <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.min(100, v + 16))}>
          +16%
        </Button>
      </div>
    </div>
  );
}
