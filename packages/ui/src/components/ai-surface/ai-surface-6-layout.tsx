"use client";

/**
 * AiSurface 默认结构与容器渲染器：Stack、Grid、Card、Group 与 Tabs。
 */
import { cn } from "@matt-ui/utils";
import type { ReactNode } from "react";
import { Badge } from "../badge/index.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card/index.js";
import { Tabs } from "../tabs/index.js";
import type { SurfaceCardNode, SurfaceHead, SurfaceNode } from "./ai-surface-0-nodes.js";
import type { SurfaceRendererProps } from "./ai-surface.types.js";
import {
  GRID_COLS_CLASS,
  STACK_ALIGN_CLASS,
  STACK_GAP_CLASS,
  SURFACE_STATUS_META,
  TONE_TO_BADGE,
} from "./ai-surface.variants.js";

const renderSlotNodes = (
  slot: SurfaceNode | SurfaceNode[] | undefined,
  slotPrefix: string,
  disabled: boolean,
  renderNode: SurfaceRendererProps["renderNode"],
): ReactNode => {
  if (!slot) return null;
  const list = Array.isArray(slot) ? slot : [slot];
  return list.map((child, idx) => renderNode(child, child.id ?? `${slotPrefix}.${idx}`, disabled));
};

const normalizeCardHead = (node: SurfaceCardNode): SurfaceHead | undefined => {
  if (!node.head) return undefined;
  if (typeof node.head === "string") return { title: node.head, status: node.status };
  return { ...node.head, status: node.head.status ?? node.status };
};

export const SurfaceStackView = ({ node, nodeId, disabled, renderNode }: SurfaceRendererProps) => {
  if (node.kind !== "stack") return null;
  const horizontal = node.direction === "horizontal";
  const gap = STACK_GAP_CLASS[node.gap ?? "md"];
  const align = STACK_ALIGN_CLASS[node.align ?? "stretch"];
  return (
    <div
      data-slot="surface-stack"
      data-node-id={nodeId}
      className={cn("flex", horizontal ? "flex-row flex-wrap" : "flex-col", gap, align)}
    >
      {node.children.map((child, i) => renderNode(child, child.id ?? `${nodeId}.${i}`, disabled))}
    </div>
  );
};

export const SurfaceGridView = ({ node, nodeId, disabled, renderNode }: SurfaceRendererProps) => {
  if (node.kind !== "grid") return null;
  const cols = GRID_COLS_CLASS[node.columns ?? 2];
  const gap = STACK_GAP_CLASS[node.gap ?? "md"];
  return (
    <div data-slot="surface-grid" data-node-id={nodeId} className={cn("grid", cols, gap)}>
      {node.children.map((child, i) => renderNode(child, child.id ?? `${nodeId}.${i}`, disabled))}
    </div>
  );
};

const CardHeadStatus = ({ head }: { head: SurfaceHead }) => {
  const statusMeta = head.status ? SURFACE_STATUS_META[head.status] : undefined;
  return (
    <>
      {head.badge && (
        <Badge size="sm" variant={head.tone ? TONE_TO_BADGE[head.tone] : "secondary"}>
          {head.badge}
        </Badge>
      )}
      {statusMeta && (
        <Badge size="sm" variant={statusMeta.variant} dot={statusMeta.dot} pulse={statusMeta.pulse}>
          {statusMeta.label}
        </Badge>
      )}
    </>
  );
};

const CardHeaderSection = ({
  node,
  nodeId,
  disabled,
  renderNode,
}: {
  node: SurfaceCardNode;
  nodeId: string;
  disabled: boolean;
  renderNode: SurfaceRendererProps["renderNode"];
}) => {
  const head = normalizeCardHead(node);
  if (!head && !node.end) return null;
  return (
    <CardHeader>
      {head && (
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{head.title}</CardTitle>
            <CardHeadStatus head={head} />
          </div>
          {head.description && <CardDescription>{head.description}</CardDescription>}
        </div>
      )}
      {node.end && (
        <CardAction className="flex items-center gap-2">
          {renderSlotNodes(node.end, `${nodeId}.end`, disabled, renderNode)}
        </CardAction>
      )}
    </CardHeader>
  );
};

export const SurfaceCardView = ({ node, nodeId, disabled, renderNode }: SurfaceRendererProps) => {
  if (node.kind !== "card") return null;
  return (
    <Card data-slot="surface-card" data-node-id={nodeId} variant={node.variant ?? "default"}>
      <CardHeaderSection node={node} nodeId={nodeId} disabled={disabled} renderNode={renderNode} />
      {node.children && node.children.length > 0 && (
        <CardContent className="flex flex-col gap-3.5">
          {node.children.map((c, i) => renderNode(c, c.id ?? `${nodeId}.${i}`, disabled))}
        </CardContent>
      )}
      {node.foot && (
        <CardFooter muted>
          <div className="flex w-full items-center justify-end gap-2">
            {renderSlotNodes(node.foot, `${nodeId}.foot`, disabled, renderNode)}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export const SurfaceGroupView = ({ node, nodeId, disabled, renderNode }: SurfaceRendererProps) => {
  if (node.kind !== "group") return null;
  return (
    <section
      data-slot="surface-group"
      data-node-id={nodeId}
      className="flex flex-col gap-3 rounded-2xl bg-muted/55 p-4"
    >
      {(node.title || node.end) && (
        <div className="flex items-start justify-between gap-3">
          <div>
            {node.title && (
              <h4 className="m-0 text-sm font-semibold text-foreground">{node.title}</h4>
            )}
            {node.description && (
              <p className="m-0 mt-0.5 text-xs text-muted-foreground">{node.description}</p>
            )}
          </div>
          {node.end && (
            <div className="flex items-center gap-2">
              {renderSlotNodes(node.end, `${nodeId}.end`, disabled, renderNode)}
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3">
        {node.children.map((c, i) => renderNode(c, c.id ?? `${nodeId}.${i}`, disabled))}
      </div>
      {node.foot && (
        <div className="flex items-center justify-end gap-2 pt-1">
          {renderSlotNodes(node.foot, `${nodeId}.foot`, disabled, renderNode)}
        </div>
      )}
    </section>
  );
};

export const SurfaceTabsView = ({ node, nodeId, disabled, renderNode }: SurfaceRendererProps) => {
  if (node.kind !== "tabs") return null;
  const items = node.tabs.map((tab) => ({
    value: tab.key,
    label: tab.label,
    badge: tab.badge,
    disabled,
    content: (
      <div className="flex flex-col gap-3 pt-2">
        {tab.children.map((c, i) => renderNode(c, c.id ?? `${nodeId}.${tab.key}.${i}`, disabled))}
      </div>
    ),
  }));
  return (
    <div data-slot="surface-tabs" data-node-id={nodeId}>
      <Tabs items={items} defaultValue={node.defaultTab ?? node.tabs[0]?.key} variant="pill" />
    </div>
  );
};
