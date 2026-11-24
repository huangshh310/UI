"use client";

/**
 * AiSurface 控制器状态、递归渲染分发与浮层快捷键勾子。
 */
import { cn } from "@matt-ui/utils";
import { useEffect, useState, type ReactNode } from "react";
import type { SurfaceNode } from "./ai-surface-0-nodes.js";
import {
  deriveDefaultData,
  deriveUiSchema,
  resolvePropertySchema,
  validateSurfaceData,
} from "./ai-surface-1-schema.js";
import { evaluateSurfaceRule, selectSurfaceRenderer } from "./ai-surface-2-registry.js";
import type {
  AiSurfaceProps,
  SurfaceRegionInput,
  SurfaceRendererEntry,
  SurfaceRendererProps,
} from "./ai-surface.types.js";
import { SURFACE_STATUS_TEXT, SURFACE_TONE_TEXT } from "./ai-surface.variants.js";

const FallbackNodeRenderer = ({ node, nodeId }: { node: SurfaceNode; nodeId: string }) => {
  const toneClass = node.tone ? SURFACE_TONE_TEXT[node.tone] : "text-muted-foreground";
  const statusTag = node.status ? ` (${SURFACE_STATUS_TEXT[node.status]})` : "";
  return (
    <div
      data-slot="ai-surface-fallback"
      data-node-id={nodeId}
      data-node-kind={node.kind}
      className={cn(
        "rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2 font-mono text-xs",
        toneClass,
      )}
    >
      {`${node.kind}${statusTag}`}
    </div>
  );
};

export const FALLBACK_RENDERER_ENTRY: SurfaceRendererEntry = {
  id: "surface-fallback",
  tester: () => 0,
  renderer: ({ node, nodeId }) => <FallbackNodeRenderer node={node} nodeId={nodeId} />,
};

export const normalizeSurfaceNodes = (region: SurfaceRegionInput | undefined): SurfaceNode[] => {
  if (!region) return [];
  return Array.isArray(region) ? region : [region];
};

export const resolveSurfaceRawView = (p: AiSurfaceProps) =>
  p.uischema ?? (p.schema ? deriveUiSchema(p.schema) : undefined);

export const useLayerEscape = (hasLayer: boolean, onResolve: AiSurfaceProps["onResolve"]) => {
  useEffect(() => {
    if (!hasLayer || !onResolve) return undefined;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onResolve({ status: "cancelled", reason: "escape" });
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hasLayer, onResolve]);
};

const mergeSubmitValues = (
  base: Record<string, unknown>,
  payload?: Record<string, unknown>,
): Record<string, unknown> => (payload ? { ...base, ...payload } : base);

export const useSurfaceController = (p: AiSurfaceProps) => {
  const [internalData, setInternalData] = useState<Record<string, unknown>>(() =>
    deriveDefaultData(p.schema, p.defaultData),
  );
  const [internalErrors, setInternalErrors] = useState<Record<string, string>>({});
  const activeData = p.data ?? internalData;
  const activeErrors = p.errors ?? internalErrors;

  const onValueChange = (field: string, value: unknown) => {
    const next = { ...activeData, [field]: value };
    if (p.data === undefined) setInternalData(next);
    if (internalErrors[field]) {
      const { [field]: _removed, ...rest } = internalErrors;
      setInternalErrors(rest);
    }
    p.onDataChange?.(next, field);
  };

  const onTriggerAction: SurfaceRendererProps["onTriggerAction"] = (
    actionId,
    nodeId,
    intent,
    payload,
  ) => {
    if (intent === "submit") {
      if (p.streaming) return;
      const errs = validateSurfaceData(p.schema, activeData);
      setInternalErrors(errs);
      if (Object.keys(errs).length === 0) {
        p.onResolve?.({
          status: "submitted",
          actionId,
          values: mergeSubmitValues(activeData, payload),
        });
      }
      return;
    }
    if (intent === "cancel") {
      p.onResolve?.({ status: "cancelled", actionId });
      return;
    }
    p.onAction?.({ actionId, nodeId, payload, values: activeData });
  };

  return { activeData, activeErrors, onValueChange, onTriggerAction };
};

export interface SurfaceDispatchEnv {
  registry: SurfaceRendererEntry[];
  schema: AiSurfaceProps["schema"];
  streaming: boolean;
  disabled: boolean;
  activeData: Record<string, unknown>;
  activeErrors: Record<string, string>;
  onValueChange: SurfaceRendererProps["onValueChange"];
  onTriggerAction: SurfaceRendererProps["onTriggerAction"];
}

export const createNodeDispatcher = (env: SurfaceDispatchEnv) => {
  const renderNode = (node: SurfaceNode, pathId: string, parentDisabled = false): ReactNode => {
    const resolvedId = node.id ?? pathId;
    const ruleState = evaluateSurfaceRule(node.rule, env.activeData);
    if (!ruleState.visible) return null;
    const propertySchema =
      node.kind === "control" ? resolvePropertySchema(env.schema, node.scope) : undefined;
    const entry = selectSurfaceRenderer(env.registry, node, {
      schema: env.schema,
      propertySchema,
      data: env.activeData,
      streaming: env.streaming,
    });
    if (!entry) return null;
    const Comp = entry.renderer;
    return (
      <Comp
        key={resolvedId}
        node={node}
        nodeId={resolvedId}
        disabled={env.disabled || parentDisabled || ruleState.disabled}
        streaming={env.streaming}
        schema={env.schema}
        propertySchema={propertySchema}
        data={env.activeData}
        errors={env.activeErrors}
        onValueChange={env.onValueChange}
        onTriggerAction={env.onTriggerAction}
        renderNode={renderNode}
      />
    );
  };
  return renderNode;
};
