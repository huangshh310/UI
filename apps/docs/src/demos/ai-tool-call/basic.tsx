"use client";

import { AiToolCall } from "@matt-ui/ui";

export default function AiToolCallBasicDemo() {
  return (
    <AiToolCall
      toolName="search_registry"
      provider="MCP · docs"
      status="completed"
      durationLabel="118ms"
      tokensLabel="384 tok"
      summary="检索到 12 个 AI 与智能体组件"
      inputJson='{"category":"ai","limit":12}'
      outputJson='{"count":12,"status":"ready"}'
      defaultExpanded
    />
  );
}
