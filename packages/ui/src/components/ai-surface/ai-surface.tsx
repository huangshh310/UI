"use client";

/**
 * AiSurface：面向智能体的受限语义视图与优先级 Schema 渲染容器。
 * 提供多区域语义布局、优先级渲染器动态分发、流式增量更新与人机协同状态闭环。
 */
import { cn } from "@matt-ui/utils";
import type { ReactNode } from "react";
import type {
  SurfaceActionsNode,
  SurfaceAlertNode,
  SurfaceApprovalNode,
  SurfaceArtifactNode,
  SurfaceBadgeNode,
  SurfaceButtonIntent,
  SurfaceButtonNode,
  SurfaceCardNode,
  SurfaceCitationNode,
  SurfaceCodeNode,
  SurfaceControlNode,
  SurfaceDiffLine,
  SurfaceDiffNode,
  SurfaceEmptyNode,
  SurfaceExtensionNode,
  SurfaceGridNode,
  SurfaceGroupNode,
  SurfaceHead,
  SurfaceKvItem,
  SurfaceKvNode,
  SurfaceNode,
  SurfaceNodeBase,
  SurfaceProgressNode,
  SurfaceStackNode,
  SurfaceStatItem,
  SurfaceStatsNode,
  SurfaceTabItem,
  SurfaceTableColumn,
  SurfaceTableNode,
  SurfaceTabsNode,
  SurfaceTextNode,
  SurfaceToolCallNode,
  SurfaceTreeItem,
  SurfaceTreeNode,
} from "./ai-surface-0-nodes.js";
import {
  deriveDefaultData,
  deriveUiSchema,
  resolvePropertySchema,
  scopeToField,
  validateSurfaceData,
} from "./ai-surface-1-schema.js";
import {
  NOT_APPLICABLE,
  and,
  evaluateSurfaceRule,
  hasEnum,
  isControl,
  isKind,
  optionIs,
  or,
  rankWith,
  schemaTypeIs,
  scopeEndsWith,
  selectSurfaceRenderer,
} from "./ai-surface-2-registry.js";
import { applySurfacePatch, deriveSurfaceIds } from "./ai-surface-3-patch.js";
import { renderSurfaceText } from "./ai-surface-4-text.js";
import {
  FALLBACK_RENDERER_ENTRY,
  createNodeDispatcher,
  normalizeSurfaceNodes,
  resolveSurfaceRawView,
  useLayerEscape,
  useSurfaceController,
} from "./ai-surface-5-runtime.js";
import { defaultSurfaceRenderers } from "./ai-surface-9-defaults.js";
import type { AiSurfaceProps } from "./ai-surface.types.js";
import { surfaceRootVariants } from "./ai-surface.variants.js";

const renderNodeList = (
  nodes: SurfaceNode[],
  prefix: string,
  renderNode: (node: SurfaceNode, pathId: string) => ReactNode,
) => nodes.map((node, i) => renderNode(node, node.id ?? `${prefix}.${i}`));

const SurfaceRegions = ({
  mainNodes,
  dockNodes,
  layerNodes,
  renderNode,
}: {
  mainNodes: SurfaceNode[];
  dockNodes: SurfaceNode[];
  layerNodes: SurfaceNode[];
  renderNode: (node: SurfaceNode, pathId: string) => ReactNode;
}) => (
  <>
    <div data-slot="ai-surface-main" className="flex min-w-0 flex-col gap-3">
      {renderNodeList(mainNodes, "main", renderNode)}
    </div>
    {dockNodes.length > 0 && (
      <aside data-slot="ai-surface-dock" className="flex min-w-0 flex-col gap-3">
        {renderNodeList(dockNodes, "dock", renderNode)}
      </aside>
    )}
    {layerNodes.length > 0 && (
      <div data-slot="ai-surface-layer" className="flex flex-col gap-3">
        {renderNodeList(layerNodes, "layer", renderNode)}
      </div>
    )}
  </>
);

export const AiSurface = (props: AiSurfaceProps) => {
  const controller = useSurfaceController(props);
  const rawView = resolveSurfaceRawView(props);
  useLayerEscape(Boolean(rawView?.layer), props.onResolve);

  if (!rawView) return null;
  const derivedView = deriveSurfaceIds(rawView);
  const streaming = Boolean(props.streaming);
  const renderNode = createNodeDispatcher({
    registry: [FALLBACK_RENDERER_ENTRY, ...defaultSurfaceRenderers, ...(props.renderers ?? [])],
    schema: props.schema,
    streaming,
    disabled: Boolean(props.disabled),
    ...controller,
  });

  const dockNodes = normalizeSurfaceNodes(derivedView.dock);

  return (
    <div
      data-slot="ai-surface"
      data-streaming={streaming ? "true" : undefined}
      className={cn(surfaceRootVariants({ hasDock: dockNodes.length > 0 }), props.className)}
    >
      <SurfaceRegions
        mainNodes={normalizeSurfaceNodes(derivedView.main)}
        dockNodes={dockNodes}
        layerNodes={normalizeSurfaceNodes(derivedView.layer)}
        renderNode={renderNode}
      />
    </div>
  );
};

export {
  NOT_APPLICABLE,
  and,
  applySurfacePatch,
  defaultSurfaceRenderers,
  deriveDefaultData,
  deriveSurfaceIds,
  deriveUiSchema,
  evaluateSurfaceRule,
  hasEnum,
  isControl,
  isKind,
  optionIs,
  or,
  rankWith,
  renderSurfaceText,
  resolvePropertySchema,
  schemaTypeIs,
  scopeEndsWith,
  scopeToField,
  selectSurfaceRenderer,
  validateSurfaceData,
};

export type {
  SurfaceActionsNode,
  SurfaceAlertNode,
  SurfaceApprovalNode,
  SurfaceArtifactNode,
  SurfaceBadgeNode,
  SurfaceButtonIntent,
  SurfaceButtonNode,
  SurfaceCardNode,
  SurfaceCitationNode,
  SurfaceCodeNode,
  SurfaceControlNode,
  SurfaceDiffLine,
  SurfaceDiffNode,
  SurfaceEmptyNode,
  SurfaceExtensionNode,
  SurfaceGridNode,
  SurfaceGroupNode,
  SurfaceHead,
  SurfaceKvItem,
  SurfaceKvNode,
  SurfaceNode,
  SurfaceNodeBase,
  SurfaceProgressNode,
  SurfaceStackNode,
  SurfaceStatItem,
  SurfaceStatsNode,
  SurfaceTabItem,
  SurfaceTableColumn,
  SurfaceTableNode,
  SurfaceTabsNode,
  SurfaceTextNode,
  SurfaceToolCallNode,
  SurfaceTreeItem,
  SurfaceTreeNode,
};
