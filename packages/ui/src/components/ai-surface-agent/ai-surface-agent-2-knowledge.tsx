"use client";

/**
 * AiSurfaceAgent 知识与产物渲染器：桥接生成产物画布、知识引用溯源与层级树结构。
 */
import { AiArtifact, type AiArtifactTab } from "../ai-artifact/index.js";
import { AiCitation, type AiCitationSource } from "../ai-citation/index.js";
import type {
  SurfaceArtifactNode,
  SurfaceCitationNode,
  SurfaceRendererProps,
  SurfaceTreeItem,
} from "../ai-surface/index.js";
import { Tree, type TreeNode } from "../tree/index.js";

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
    <pre className="m-0 rounded-lg bg-muted/50 p-2.5 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-words text-foreground">
      {node.content}
    </pre>
  </div>
);

export const AgentArtifactView = ({ node, nodeId }: SurfaceRendererProps) => {
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

export const AgentCitationView = ({ node, nodeId }: SurfaceRendererProps) => {
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

export const AgentTreeView = ({
  node,
  nodeId,
  disabled,
  onTriggerAction,
}: SurfaceRendererProps) => {
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
