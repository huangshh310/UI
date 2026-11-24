/**
 * AiSurfaceAgent 智能体高阶领域渲染器注册表（统一挂载于 rank 5）。
 */
import {
  and,
  isControl,
  isKind,
  rankWith,
  type SurfaceRendererEntry,
} from "../ai-surface/index.js";
import {
  AgentApprovalView,
  AgentDiffView,
  AgentToolCallView,
} from "./ai-surface-agent-1-review.js";
import {
  AgentArtifactView,
  AgentCitationView,
  AgentTreeView,
} from "./ai-surface-agent-2-knowledge.js";
import {
  AgentComboboxControl,
  AgentDataTableView,
  isComboboxControl,
  isInteractiveTable,
} from "./ai-surface-agent-3-data.js";

export const agentSurfaceRenderers: SurfaceRendererEntry[] = [
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
