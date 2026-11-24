"use client";

/**
 * 示例：AiSurfaceAgent 整合工具调用轨迹、代码差异审阅与敏感动作护栏审批闭环。
 */
import { AiSurfaceAgent, type AiSurfaceAgentProps } from "@matt-ui/ui";
import { useState } from "react";

const REVIEW_VIEW: NonNullable<AiSurfaceAgentProps["uischema"]> = {
  main: [
    {
      kind: "tool-call",
      toolName: "inspect_gateway_timeout",
      provider: "ClusterOps",
      status: "done",
      durationLabel: "96ms",
      summary: "检测到上游连接超时配置偏低，已生成补丁与变更请求",
    },
    {
      kind: "diff",
      fileName: "config/upstream.yaml",
      summary: "提升网关上游读写超时阈值",
      language: "yaml",
      applyActionId: "apply-upstream-diff",
      lines: [
        { id: "d1", lineNumber: 12, type: "context", content: "upstream:" },
        { id: "d2", lineNumber: 13, type: "remove", content: "  readTimeoutMs: 1200" },
        { id: "d3", lineNumber: 13, type: "add", content: "  readTimeoutMs: 5000" },
      ],
    },
    {
      kind: "approval",
      title: "热更新生产网关配置",
      description: "将变更推送至 12 个边缘入口实例并执行平滑重载。",
      agentName: "ops-agent",
      workingDir: "~/infra/gateway",
      command: "ctl gateway reload --config config/upstream.yaml",
      riskLevel: "medium",
      approveActionId: "approve-reload",
      rejectActionId: "reject-reload",
      approvalOptions: [
        { id: "canary-first", label: "先灰度单节点验证（推荐）" },
        { id: "all-nodes", label: "立即全量下发全部实例" },
      ],
    },
  ],
};

export const AiSurfaceAgentBasic = () => {
  const [log, setLog] = useState("");

  return (
    <div className="flex w-full flex-col gap-3">
      <AiSurfaceAgent
        uischema={REVIEW_VIEW}
        onAction={(ev) => setLog(`触发动作 ${ev.actionId}：${JSON.stringify(ev.payload ?? {})}`)}
        onResolve={(ans) => {
          if (ans.status === "submitted") {
            setLog(`审批已通过 (${ans.actionId})：${JSON.stringify(ans.values)}`);
          } else if (ans.status === "cancelled") {
            setLog(`审批已拒绝 (${ans.actionId ?? "cancel"})`);
          }
        }}
      />
      {log && (
        <div
          data-testid="agent-surface-log"
          className="rounded-xl bg-card px-3.5 py-2.5 font-mono text-xs text-foreground shadow-2xs"
        >
          {log}
        </div>
      )}
    </div>
  );
};

export default AiSurfaceAgentBasic;
