"use client";

/**
 * 示例：ModelSelector 紧凑工具栏胶囊与搜索/推理强度浮层。
 */
import { ModelSelector, type ModelSelectorValue } from "@matt-ui/ui";
import { useState } from "react";

export default function ModelSelectorBasicDemo() {
  const [val, setVal] = useState<ModelSelectorValue>({
    modelId: "pro",
    effort: "balanced",
    webSearch: true,
  });

  return (
    <div className="flex flex-col items-start gap-2.5">
      <ModelSelector defaultWebSearch onValueChange={setVal} />
      <p className="m-0 font-mono text-xs text-muted-foreground">
        当前配置：{val.modelId} · 强度 {val.effort} · {val.webSearch ? "已开启联网" : "离线推理"}
      </p>
    </div>
  );
}
