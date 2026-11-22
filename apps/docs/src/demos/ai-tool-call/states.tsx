"use client";

import { AiToolCall } from "@matt-ui/ui";

export default function AiToolCallStatesDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2.5">
      <AiToolCall
        toolName="audit_contrast"
        status="running"
        durationLabel="0.4s"
        summary="正在校验浅色与深色 WCAG AA 对比度…"
      />
      <AiToolCall
        toolName="write_token_scale"
        status="completed"
        durationLabel="86ms"
        summary="已写入顶部 1px 内高光与多层触感阴影"
        defaultExpanded
      />
      <AiToolCall
        toolName="deploy_canary"
        status="error"
        durationLabel="310ms"
        summary="目标节点连接超时，已自动回退至稳定镜像"
      />
    </div>
  );
}
