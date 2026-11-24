"use client";

/**
 * AiSurfaceAgent 审阅与执行轨迹渲染器：桥接敏感操作审批、代码差异审阅与工具调用轨迹。
 */
import { AiApprovalCard } from "../ai-approval-card/index.js";
import { AiDiffReview, type AiDiffReviewTheme } from "../ai-diff-review/index.js";
import type {
  SurfaceApprovalNode,
  SurfaceDiffNode,
  SurfaceRendererProps,
  SurfaceStatus,
  SurfaceToolCallNode,
} from "../ai-surface/index.js";
import { AiToolCall, type AiToolCallStatus } from "../ai-tool-call/index.js";

const TOOL_STATUS_MAP: Record<SurfaceStatus, AiToolCallStatus> = {
  idle: "pending",
  pending: "pending",
  running: "running",
  done: "completed",
  error: "error",
  cancelled: "error",
};

const resolveApprovalActions = (node: SurfaceApprovalNode) => ({
  approveId: node.approveActionId ?? "approve",
  rejectId: node.rejectActionId ?? "reject",
});

export const AgentApprovalView = ({ node, nodeId, onTriggerAction }: SurfaceRendererProps) => {
  if (node.kind !== "approval") return null;
  const ids = resolveApprovalActions(node);
  return (
    <div data-slot="agent-surface-approval" data-node-id={nodeId}>
      <AiApprovalCard
        title={node.title}
        description={node.description}
        agentName={node.agentName}
        command={node.command}
        workingDir={node.workingDir}
        impact={node.impact}
        riskLevel={node.riskLevel}
        options={node.approvalOptions}
        onApprove={(selectedOptionId) =>
          onTriggerAction(ids.approveId, nodeId, "submit", { approvalOption: selectedOptionId })
        }
        onReject={() => onTriggerAction(ids.rejectId, nodeId, "cancel")}
      />
    </div>
  );
};

const resolveDiffTheme = (node: SurfaceDiffNode): AiDiffReviewTheme =>
  node.options?.theme === "obsidian" ? "obsidian" : "adaptive";

const resolveDiffApplyId = (node: SurfaceDiffNode) => node.applyActionId ?? "apply-diff";

export const AgentDiffView = ({ node, nodeId, onTriggerAction }: SurfaceRendererProps) => {
  if (node.kind !== "diff") return null;
  const applyId = resolveDiffApplyId(node);
  const rejectId = node.rejectActionId;
  return (
    <div data-slot="agent-surface-diff" data-node-id={nodeId}>
      <AiDiffReview
        fileName={node.fileName}
        summary={node.summary}
        language={node.language}
        theme={resolveDiffTheme(node)}
        lines={node.lines}
        onApply={(acceptedLineIds) =>
          onTriggerAction(applyId, nodeId, undefined, { acceptedLineIds })
        }
        onRejectAll={rejectId ? () => onTriggerAction(rejectId, nodeId, "cancel") : undefined}
      />
    </div>
  );
};

const resolveToolStatus = (node: SurfaceToolCallNode): AiToolCallStatus =>
  node.status ? TOOL_STATUS_MAP[node.status] : "completed";

export const AgentToolCallView = ({ node, nodeId, onTriggerAction }: SurfaceRendererProps) => {
  if (node.kind !== "tool-call") return null;
  const retryId = node.retryActionId;
  return (
    <div data-slot="agent-surface-tool-call" data-node-id={nodeId}>
      <AiToolCall
        toolName={node.toolName}
        status={resolveToolStatus(node)}
        provider={node.provider}
        durationLabel={node.durationLabel}
        tokensLabel={node.tokensLabel}
        summary={node.summary}
        inputJson={node.inputJson}
        outputJson={node.outputJson}
        defaultExpanded={Boolean(node.options?.defaultExpanded)}
        onRetry={retryId ? () => onTriggerAction(retryId, nodeId) : undefined}
      />
    </div>
  );
};
