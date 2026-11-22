"use client";

import { AiModelSelector, type AiModelConfig } from "@matt-ui/ui";
import { useState } from "react";

export default function AiModelSelectorCompactDemo() {
  const [config, setConfig] = useState<AiModelConfig>({
    modelId: "vision",
    effort: "deep",
    capabilities: ["web", "sandbox"],
  });

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2.5">
      <AiModelSelector defaultModelId="vision" defaultEffort="deep" onChange={setConfig} />
      <span className="font-mono text-xs text-muted-foreground">
        {config.modelId} · {config.effort} · {config.capabilities.join(", ") || "无扩展"}
      </span>
    </div>
  );
}
