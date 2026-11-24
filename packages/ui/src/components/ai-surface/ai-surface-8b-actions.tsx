"use client";

/**
 * AiSurface 默认动作按钮与底栏按钮组渲染器。
 */
import { cn } from "@matt-ui/utils";
import { Button } from "../button/index.js";
import type { SurfaceButtonNode } from "./ai-surface-0-nodes.js";
import type { SurfaceRendererProps } from "./ai-surface.types.js";
import { INTENT_TO_BUTTON } from "./ai-surface.variants.js";

const renderSurfaceButton = (
  btn: SurfaceButtonNode,
  btnId: string,
  disabled: boolean,
  streaming: boolean,
  onTriggerAction: SurfaceRendererProps["onTriggerAction"],
) => {
  const intent = btn.intent ?? "secondary";
  const submitStreaming = streaming && intent === "submit";
  return (
    <Button
      key={btnId}
      size="sm"
      variant={INTENT_TO_BUTTON[intent]}
      loading={submitStreaming}
      disabled={disabled || Boolean(btn.disabled) || submitStreaming}
      onClick={() => onTriggerAction(btn.actionId, btnId, btn.intent, btn.payload)}
    >
      {btn.label}
    </Button>
  );
};

export const SurfaceButtonView = ({
  node,
  nodeId,
  disabled,
  streaming,
  onTriggerAction,
}: SurfaceRendererProps) => {
  if (node.kind !== "button") return null;
  return renderSurfaceButton(node, nodeId, disabled, streaming, onTriggerAction);
};

const ACTIONS_ALIGN_CLASS = {
  start: "justify-start",
  end: "justify-end",
  between: "justify-between",
} as const;

export const SurfaceActionsView = ({
  node,
  nodeId,
  disabled,
  streaming,
  onTriggerAction,
}: SurfaceRendererProps) => {
  if (node.kind !== "actions") return null;
  const alignClass = ACTIONS_ALIGN_CLASS[node.align ?? "end"];
  return (
    <div
      data-slot="surface-actions"
      data-node-id={nodeId}
      className={cn("flex w-full flex-wrap items-center gap-2", alignClass)}
    >
      {node.items.map((btn, i) =>
        renderSurfaceButton(
          btn,
          btn.id ?? `${nodeId}.${btn.key ?? i}`,
          disabled,
          streaming,
          onTriggerAction,
        ),
      )}
    </div>
  );
};
