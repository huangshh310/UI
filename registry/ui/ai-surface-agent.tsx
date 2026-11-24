// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiSurfaceAgent：预装高阶智能体领域渲染器（审批、差异审阅、工具轨迹、产物画布、溯源、层级树与交互数据表）的语义视图容器。
 */

import { AiApprovalCard } from "@/components/ui/ai-approval-card";
import { AiArtifact, type AiArtifactTab } from "@/components/ui/ai-artifact";
import { AiCitation, type AiCitationSource } from "@/components/ui/ai-citation";
import { AiDiffReview, type AiDiffReviewTheme } from "@/components/ui/ai-diff-review";
import {
  AiSurface,
  and,
  isControl,
  isKind,
  rankWith,
  scopeToField,
  type AiSurfaceProps,
  type SurfaceApprovalNode,
  type SurfaceArtifactNode,
  type SurfaceCitationNode,
  type SurfaceControlNode,
  type SurfaceDiffNode,
  type SurfacePredicate,
  type SurfacePropertySchema,
  type SurfaceRendererEntry,
  type SurfaceRendererProps,
  type SurfaceStatus,
  type SurfaceTableColumn,
  type SurfaceTableNode,
  type SurfaceToolCallNode,
  type SurfaceTreeItem,
} from "@/components/ui/ai-surface";
import { AiToolCall, type AiToolCallStatus } from "@/components/ui/ai-tool-call";
import { Badge } from "@/components/ui/badge";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Progress } from "@/components/ui/progress";
import { Tree, type TreeNode } from "@/components/ui/tree";
import { cn } from "@/lib/utils";

export interface AiSurfaceAgentProps extends AiSurfaceProps {}

export type AiAgentSurfaceProps = AiSurfaceAgentProps;
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

const AgentApprovalView = ({ node, nodeId, onTriggerAction }: SurfaceRendererProps) => {
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

const AgentDiffView = ({ node, nodeId, onTriggerAction }: SurfaceRendererProps) => {
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

const AgentToolCallView = ({ node, nodeId, onTriggerAction }: SurfaceRendererProps) => {
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
const resolveArtifactTab = (kind?: SurfaceArtifactNode["artifactType"]): AiArtifactTab =>
  kind === "markdown" || kind === "html" ? "preview" : "code";

const resolveArtifactLang = (node: SurfaceArtifactNode): string =>
  node.language ?? node.artifactType ?? "tsx";

const ArtifactSummaryPreview = ({ node }: { node: SurfaceArtifactNode }) => (
  <div className="flex w-full max-w-lg flex-col gap-2 rounded-xl border border-solid border-border bg-card p-4 text-left shadow-xs">
    <p className="m-0 text-xs font-semibold text-foreground">{node.title}</p>
    {node.summary && (
      <p className="m-0 text-xs leading-relaxed text-muted-foreground">{node.summary}</p>
    )}
    <pre className="m-0 max-h-36 overflow-auto rounded-lg bg-muted/50 p-2.5 font-mono text-[11px] leading-relaxed text-foreground">
      {node.content}
    </pre>
  </div>
);

const AgentArtifactView = ({ node, nodeId }: SurfaceRendererProps) => {
  if (node.kind !== "artifact") return null;
  return (
    <div data-slot="agent-surface-artifact" data-node-id={nodeId}>
      <AiArtifact
        title={node.title}
        version={node.versionLabel}
        language={resolveArtifactLang(node)}
        defaultTab={resolveArtifactTab(node.artifactType)}
        code={node.content}
        preview={<ArtifactSummaryPreview node={node} />}
      />
    </div>
  );
};

const extractHostname = (url?: string): string => {
  if (!url) return "local-knowledge";
  try {
    return new URL(url).hostname || "local-knowledge";
  } catch {
    return url;
  }
};

const toCitationSource = (node: SurfaceCitationNode, nodeId: string): AiCitationSource => ({
  id: nodeId,
  index: node.index ?? 1,
  title: node.title,
  domain: node.domain ?? extractHostname(node.url),
  snippet: node.snippet ?? "",
  url: node.url,
});

const resolveCitationAnswer = (node: SurfaceCitationNode): string =>
  typeof node.options?.answer === "string" ? node.options.answer : "";

const AgentCitationView = ({ node, nodeId }: SurfaceRendererProps) => {
  if (node.kind !== "citation") return null;
  const source = toCitationSource(node, nodeId);
  return (
    <div data-slot="agent-surface-citation" data-node-id={nodeId}>
      <AiCitation
        answer={resolveCitationAnswer(node)}
        sources={[source]}
        defaultActiveId={source.id}
      />
    </div>
  );
};

const toTreeNodes = (items: SurfaceTreeItem[]): TreeNode[] =>
  items.map((item) => ({
    id: item.id,
    label: item.label,
    badge: item.badge,
    children: item.children ? toTreeNodes(item.children) : undefined,
  }));

const AgentTreeView = ({ node, nodeId, disabled, onTriggerAction }: SurfaceRendererProps) => {
  if (node.kind !== "tree") return null;
  const actionId = node.selectActionId;
  return (
    <div data-slot="agent-surface-tree" data-node-id={nodeId} className="flex flex-col gap-1.5">
      {node.title && <p className="m-0 text-xs font-semibold text-foreground">{node.title}</p>}
      <Tree
        ariaLabel={node.title ?? "树形目录"}
        nodes={toTreeNodes(node.items)}
        defaultExpanded={node.defaultExpandedIds}
        onValueChange={(selectedId) => {
          if (!disabled && selectedId && actionId) {
            onTriggerAction(actionId, nodeId, undefined, { selectedId });
          }
        }}
      />
    </div>
  );
};
const hasSortableColumns = (cols: SurfaceTableColumn[]) =>
  cols.some((col) => Boolean(col.sortable));

const isInteractiveTable: SurfacePredicate = (node) => {
  if (node.kind !== "table") return false;
  return Boolean(node.searchable) || Boolean(node.selectable) || hasSortableColumns(node.columns);
};

const renderDataCell = (col: SurfaceTableColumn, raw: unknown) => {
  if (col.cellKind === "badge") {
    return (
      <Badge size="sm" variant="soft">
        {String(raw ?? "")}
      </Badge>
    );
  }
  if (col.cellKind === "meter") {
    const num = typeof raw === "number" ? raw : Number(raw ?? 0);
    return <Progress value={Number.isNaN(num) ? 0 : num} size="sm" />;
  }
  return (
    <span className={cn(col.cellKind === "mono" && "font-mono tabular-nums")}>
      {String(raw ?? "")}
    </span>
  );
};

const toDataTableColumns = (
  columns: SurfaceTableColumn[],
): DataTableColumn<Record<string, unknown>>[] =>
  columns.map((col) => ({
    id: col.key,
    header: col.header,
    align: col.align,
    sortable: col.sortable,
    accessor: (row) => {
      const val = row[col.key];
      return val === undefined || val === null ? "" : String(val);
    },
    cell: (row) => renderDataCell(col, row[col.key]),
  }));

const resolveTableRowId = (node: SurfaceTableNode, row: Record<string, unknown>, idx: number) =>
  String(row[node.rowKey ?? "id"] ?? idx);

const AgentDataTableView = ({ node, nodeId, disabled, onTriggerAction }: SurfaceRendererProps) => {
  if (node.kind !== "table") return null;
  const actionId = node.rowActionId;
  return (
    <div data-slot="agent-surface-data-table" data-node-id={nodeId}>
      <DataTable
        title={node.title}
        description={node.description}
        data={node.rows}
        columns={toDataTableColumns(node.columns)}
        getRowId={(row, idx) => resolveTableRowId(node, row, idx)}
        searchable={node.searchable}
        selectable={node.selectable}
        emptyMessage={node.emptyMessage}
        onRowClick={
          !disabled && actionId
            ? (row) => onTriggerAction(actionId, nodeId, undefined, row)
            : undefined
        }
      />
    </div>
  );
};

const countEnumItems = (prop?: SurfacePropertySchema): number =>
  prop?.oneOf?.length ?? prop?.enum?.length ?? 0;

const isComboboxControl: SurfacePredicate = (node, ctx) => {
  if (node.kind !== "control") return false;
  if (node.controlType === "combobox" || node.options?.searchable === true) return true;
  return countEnumItems(ctx.propertySchema) > 6;
};

const toComboboxOptions = (prop?: SurfacePropertySchema): ComboboxOption[] => {
  if (prop?.oneOf?.length) return prop.oneOf;
  if (prop?.enum?.length) return prop.enum.map((val) => ({ value: val, label: val }));
  return [];
};

const resolveComboboxValue = (raw: unknown): string | null =>
  raw === undefined || raw === null || raw === "" ? null : String(raw);

const resolveComboboxMeta = (node: SurfaceControlNode, p: SurfaceRendererProps) => {
  const field = scopeToField(node.scope);
  return {
    field,
    label: node.label ?? p.propertySchema?.title ?? field,
    hint: node.description ?? p.propertySchema?.description,
    error: p.errors[field],
    required: Boolean(node.required || p.schema?.required?.includes(field)),
    locked: p.disabled || Boolean(node.readOnly),
    value: resolveComboboxValue(p.data[field]),
  };
};

const AgentComboboxControl = (p: SurfaceRendererProps) => {
  if (p.node.kind !== "control") return null;
  const m = resolveComboboxMeta(p.node, p);
  return (
    <div data-slot="agent-surface-combobox" data-node-id={p.nodeId}>
      <Combobox
        label={m.label}
        placeholder={p.node.placeholder ?? "搜索并选择"}
        options={toComboboxOptions(p.propertySchema)}
        value={m.value}
        hint={m.hint}
        error={m.error}
        required={m.required}
        disabled={m.locked}
        showSearchIcon
        onValueChange={(val) => p.onValueChange(m.field, val ?? "")}
      />
    </div>
  );
};
const agentSurfaceRenderers: SurfaceRendererEntry[] = [
  { id: "agent-approval", tester: rankWith(5, isKind("approval")), renderer: AgentApprovalView },
  { id: "agent-diff", tester: rankWith(5, isKind("diff")), renderer: AgentDiffView },
  { id: "agent-tool-call", tester: rankWith(5, isKind("tool-call")), renderer: AgentToolCallView },
  { id: "agent-artifact", tester: rankWith(5, isKind("artifact")), renderer: AgentArtifactView },
  { id: "agent-citation", tester: rankWith(5, isKind("citation")), renderer: AgentCitationView },
  { id: "agent-tree", tester: rankWith(5, isKind("tree")), renderer: AgentTreeView },
  {
    id: "agent-data-table",
    tester: rankWith(5, and(isKind("table"), isInteractiveTable)),
    renderer: AgentDataTableView,
  },
  {
    id: "agent-combobox",
    tester: rankWith(5, and(isControl, isComboboxControl)),
    renderer: AgentComboboxControl,
  },
];
export const AiSurfaceAgent = ({ renderers, ...props }: AiSurfaceAgentProps) => (
  <AiSurface
    {...props}
    renderers={renderers ? [...agentSurfaceRenderers, ...renderers] : agentSurfaceRenderers}
  />
);

export const AiAgentSurface = AiSurfaceAgent;

export { agentSurfaceRenderers };
