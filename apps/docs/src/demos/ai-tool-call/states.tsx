"use client";

import { AiToolCall } from "@matt-ui/ui";

export default function AiToolCallStatesDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-2.5">
      <AiToolCall
        toolName="audit_contrast"
        status="running"
        durationLabel="0.4s"
        summary="正在校验浅色与深色 WCAG AA 对比度…"
      />
      <AiToolCall
        toolName="sync_design_tokens"
        status="pending"
        variant="compact"
        durationLabel="等待前置"
      />
      <AiToolCall
        toolName="deploy_canary"
        variant="obsidian"
        status="error"
        durationLabel="310ms"
        summary="目标节点连接超时，已自动回退至稳定镜像"
        inputJson='{"env":"canary","region":"hnd1"}'
        outputJson='{"error":"ETIMEDOUT","rollback":true}'
      />
    </div>
  );
}
