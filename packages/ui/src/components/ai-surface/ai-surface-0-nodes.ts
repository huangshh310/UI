/**
 * AiSurface 受限语义节点词表与容器槽位类型定义。
 */
import type { SurfaceRule, SurfaceStatus, SurfaceTone } from "./ai-surface.types.js";

export interface SurfaceHead {
  title: string;
  description?: string;
  status?: SurfaceStatus;
  badge?: string;
  tone?: SurfaceTone;
}

export interface SurfaceNodeBase {
  key?: string;
  id?: string;
  tone?: SurfaceTone;
  status?: SurfaceStatus;
  rule?: SurfaceRule;
  options?: Record<string, unknown>;
}

export interface SurfaceStackNode extends SurfaceNodeBase {
  kind: "stack";
  direction?: "vertical" | "horizontal";
  gap?: "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "between" | "stretch";
  children: SurfaceNode[];
}

export interface SurfaceGridNode extends SurfaceNodeBase {
  kind: "grid";
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  children: SurfaceNode[];
}

export interface SurfaceCardNode extends SurfaceNodeBase {
  kind: "card";
  variant?: "default" | "elevated" | "subtle";
  head?: string | SurfaceHead;
  end?: SurfaceNode | SurfaceNode[];
  foot?: SurfaceNode | SurfaceNode[];
  children?: SurfaceNode[];
}

export interface SurfaceGroupNode extends SurfaceNodeBase {
  kind: "group";
  title?: string;
  description?: string;
  end?: SurfaceNode | SurfaceNode[];
  foot?: SurfaceNode | SurfaceNode[];
  children: SurfaceNode[];
}

export interface SurfaceTabItem {
  key: string;
  label: string;
  badge?: string;
  children: SurfaceNode[];
}

export interface SurfaceTabsNode extends SurfaceNodeBase {
  kind: "tabs";
  defaultTab?: string;
  tabs: SurfaceTabItem[];
}

export interface SurfaceTextNode extends SurfaceNodeBase {
  kind: "text";
  text: string;
  variant?: "body" | "muted" | "heading" | "caption" | "code";
}

export interface SurfaceKvItem {
  key?: string;
  label: string;
  value: string | number | boolean;
  tone?: SurfaceTone;
  mono?: boolean;
}

export interface SurfaceKvNode extends SurfaceNodeBase {
  kind: "kv";
  columns?: 1 | 2;
  items: SurfaceKvItem[];
}

export interface SurfaceStatItem {
  key?: string;
  label: string;
  value: string | number;
  delta?: string;
  tone?: SurfaceTone;
}

export interface SurfaceStatsNode extends SurfaceNodeBase {
  kind: "stats";
  items: SurfaceStatItem[];
}

export interface SurfaceBadgeNode extends SurfaceNodeBase {
  kind: "badge";
  label: string;
}

export interface SurfaceProgressNode extends SurfaceNodeBase {
  kind: "progress";
  label?: string;
  value: number;
  max?: number;
  valueLabel?: string;
}

export interface SurfaceTableColumn {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  priority?: number;
  cellKind?: "text" | "badge" | "meter" | "mono";
  sortable?: boolean;
}

export interface SurfaceTableNode extends SurfaceNodeBase {
  kind: "table";
  title?: string;
  description?: string;
  columns: SurfaceTableColumn[];
  rows: Record<string, unknown>[];
  rowKey?: string;
  selectable?: boolean;
  searchable?: boolean;
  emptyMessage?: string;
  rowActionId?: string;
}

export interface SurfaceCodeNode extends SurfaceNodeBase {
  kind: "code";
  code: string;
  language?: string;
  title?: string;
}

export interface SurfaceAlertNode extends SurfaceNodeBase {
  kind: "alert";
  title: string;
  description?: string;
}

export interface SurfaceEmptyNode extends SurfaceNodeBase {
  kind: "empty";
  title: string;
  description?: string;
  actionLabel?: string;
  actionId?: string;
}

export interface SurfaceControlNode extends SurfaceNodeBase {
  kind: "control";
  scope: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  controlType?: "text" | "textarea" | "number" | "select" | "radio" | "checkbox" | "combobox";
}

export type SurfaceButtonIntent =
  "primary" | "secondary" | "outline" | "ghost" | "danger" | "signal" | "submit" | "cancel";

export interface SurfaceButtonNode extends SurfaceNodeBase {
  kind: "button";
  actionId: string;
  label: string;
  intent?: SurfaceButtonIntent;
  payload?: Record<string, unknown>;
  disabled?: boolean;
}

export interface SurfaceActionsNode extends SurfaceNodeBase {
  kind: "actions";
  align?: "start" | "end" | "between";
  items: SurfaceButtonNode[];
}

export interface SurfaceApprovalNode extends SurfaceNodeBase {
  kind: "approval";
  title: string;
  description?: string;
  agentName?: string;
  command?: string;
  workingDir?: string;
  impact?: string;
  riskLevel?: "low" | "medium" | "high";
  approvalOptions?: { id: string; label: string; description?: string }[];
  approveActionId?: string;
  rejectActionId?: string;
}

export interface SurfaceDiffLine {
  id: string;
  lineNumber: number;
  type: "context" | "remove" | "add";
  content: string;
}

export interface SurfaceDiffNode extends SurfaceNodeBase {
  kind: "diff";
  fileName?: string;
  summary?: string;
  language?: string;
  lines: SurfaceDiffLine[];
  applyActionId?: string;
  rejectActionId?: string;
}

export interface SurfaceToolCallNode extends SurfaceNodeBase {
  kind: "tool-call";
  toolName: string;
  provider?: string;
  durationLabel?: string;
  tokensLabel?: string;
  summary?: string;
  inputJson?: string;
  outputJson?: string;
  retryActionId?: string;
}

export interface SurfaceArtifactNode extends SurfaceNodeBase {
  kind: "artifact";
  title: string;
  artifactType?: "code" | "markdown" | "html" | "json";
  language?: string;
  versionLabel?: string;
  summary?: string;
  content: string;
}

export interface SurfaceCitationNode extends SurfaceNodeBase {
  kind: "citation";
  index?: number;
  title: string;
  url?: string;
  domain?: string;
  snippet?: string;
}

export interface SurfaceTreeItem {
  id: string;
  label: string;
  badge?: string;
  children?: SurfaceTreeItem[];
}

export interface SurfaceTreeNode extends SurfaceNodeBase {
  kind: "tree";
  title?: string;
  items: SurfaceTreeItem[];
  defaultExpandedIds?: string[];
  selectActionId?: string;
}

export interface SurfaceExtensionNode extends SurfaceNodeBase {
  kind: `x-${string}`;
  props?: Record<string, unknown>;
  fallbackText?: string;
}

export type SurfaceNode =
  | SurfaceStackNode
  | SurfaceGridNode
  | SurfaceCardNode
  | SurfaceGroupNode
  | SurfaceTabsNode
  | SurfaceTextNode
  | SurfaceKvNode
  | SurfaceStatsNode
  | SurfaceBadgeNode
  | SurfaceProgressNode
  | SurfaceTableNode
  | SurfaceCodeNode
  | SurfaceAlertNode
  | SurfaceEmptyNode
  | SurfaceControlNode
  | SurfaceButtonNode
  | SurfaceActionsNode
  | SurfaceApprovalNode
  | SurfaceDiffNode
  | SurfaceToolCallNode
  | SurfaceArtifactNode
  | SurfaceCitationNode
  | SurfaceTreeNode
  | SurfaceExtensionNode;
