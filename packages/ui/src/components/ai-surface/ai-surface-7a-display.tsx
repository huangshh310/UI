"use client";

/**
 * AiSurface 默认数据展示渲染器：Text、KV、Stats、Badge、Progress、Code、Alert 与 Empty。
 */
import { cn } from "@matt-ui/utils";
import { Alert } from "../alert/index.js";
import { Badge } from "../badge/index.js";
import { Button } from "../button/index.js";
import { EmptyState } from "../empty-state/index.js";
import { Progress } from "../progress/index.js";
import type { SurfaceRendererProps } from "./ai-surface.types.js";
import {
  SURFACE_TONE_TEXT,
  TONE_TO_ALERT,
  TONE_TO_BADGE,
  TONE_TO_PROGRESS,
} from "./ai-surface.variants.js";

const TEXT_VARIANT_CLASS = {
  heading: "text-base font-semibold tracking-tight",
  body: "text-sm leading-relaxed",
  muted: "text-xs leading-relaxed text-muted-foreground",
  caption: "text-[11px] text-muted-foreground",
  code: "rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs",
} as const;

export const SurfaceTextView = ({ node, nodeId }: SurfaceRendererProps) => {
  if (node.kind !== "text") return null;
  const variantClass = TEXT_VARIANT_CLASS[node.variant ?? "body"];
  const toneClass = node.tone ? SURFACE_TONE_TEXT[node.tone] : "";
  return (
    <p
      data-slot="surface-text"
      data-node-id={nodeId}
      className={cn("m-0", variantClass, toneClass)}
    >
      {node.text}
    </p>
  );
};

export const SurfaceKvView = ({ node, nodeId }: SurfaceRendererProps) => {
  if (node.kind !== "kv") return null;
  const twoCols = node.columns === 2;
  return (
    <dl
      data-slot="surface-kv"
      data-node-id={nodeId}
      className={cn(
        "m-0 grid gap-x-6 gap-y-2 rounded-xl bg-card px-4 py-3 text-xs shadow-2xs",
        twoCols ? "grid-cols-1 @sm:grid-cols-2" : "grid-cols-1",
      )}
    >
      {node.items.map((item, idx) => (
        <div
          key={item.key ?? `${item.label}-${idx}`}
          className="flex items-baseline justify-between gap-3"
        >
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd
            className={cn(
              "m-0 font-medium",
              item.mono && "font-mono tabular-nums",
              item.tone ? SURFACE_TONE_TEXT[item.tone] : "text-foreground",
            )}
          >
            {String(item.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
};

const STATS_GRID_BY_COUNT: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-1 @xs:grid-cols-3",
  4: "grid-cols-2 @xl:grid-cols-4",
};

export const SurfaceStatsView = ({ node, nodeId }: SurfaceRendererProps) => {
  if (node.kind !== "stats") return null;
  const visible = node.items.slice(0, 4);
  const gridCols = STATS_GRID_BY_COUNT[visible.length] ?? "grid-cols-2";
  return (
    <div data-slot="surface-stats" data-node-id={nodeId} className={cn("grid gap-2.5", gridCols)}>
      {visible.map((stat, idx) => (
        <div
          key={stat.key ?? `${stat.label}-${idx}`}
          className="flex flex-col gap-1 rounded-xl bg-muted/55 px-3.5 py-2.5"
        >
          <span className="text-[11px] text-muted-foreground">{stat.label}</span>
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                "font-mono text-base font-semibold tabular-nums",
                stat.tone ? SURFACE_TONE_TEXT[stat.tone] : "text-foreground",
              )}
            >
              {stat.value}
            </span>
            {stat.delta && (
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {stat.delta}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const SurfaceBadgeView = ({ node, nodeId }: SurfaceRendererProps) => {
  if (node.kind !== "badge") return null;
  const variant = node.tone ? TONE_TO_BADGE[node.tone] : "secondary";
  const running = node.status === "running";
  return (
    <Badge
      data-slot="surface-badge"
      data-node-id={nodeId}
      variant={variant}
      dot={Boolean(node.status)}
      pulse={running}
    >
      {node.label}
    </Badge>
  );
};

export const SurfaceProgressView = ({ node, nodeId }: SurfaceRendererProps) => {
  if (node.kind !== "progress") return null;
  return (
    <div data-slot="surface-progress" data-node-id={nodeId}>
      <Progress
        label={node.label}
        value={node.value}
        max={node.max ?? 100}
        showValue
        indeterminate={node.status === "running" && node.value < 0}
        tone={node.tone ? TONE_TO_PROGRESS[node.tone] : "primary"}
      />
    </div>
  );
};

export const SurfaceCodeView = ({ node, nodeId }: SurfaceRendererProps) => {
  if (node.kind !== "code") return null;
  return (
    <div
      data-slot="surface-code"
      data-node-id={nodeId}
      className="overflow-hidden rounded-xl bg-muted/60"
    >
      {(node.title || node.language) && (
        <div className="flex items-center justify-between px-3.5 pt-2.5 pb-1 font-mono text-[11px] text-muted-foreground">
          <span>{node.title ?? ""}</span>
          {node.language && <span>{node.language}</span>}
        </div>
      )}
      <pre className="m-0 overflow-x-auto p-3.5 pt-2 font-mono text-xs leading-relaxed text-foreground">
        <code>{node.code}</code>
      </pre>
    </div>
  );
};

export const SurfaceAlertView = ({ node, nodeId }: SurfaceRendererProps) => {
  if (node.kind !== "alert") return null;
  return (
    <div data-slot="surface-alert" data-node-id={nodeId}>
      <Alert
        variant={node.tone ? TONE_TO_ALERT[node.tone] : "neutral"}
        title={node.title}
        description={node.description}
      />
    </div>
  );
};

export const SurfaceEmptyView = ({
  node,
  nodeId,
  disabled,
  onTriggerAction,
}: SurfaceRendererProps) => {
  if (node.kind !== "empty") return null;
  const action =
    node.actionLabel && node.actionId ? (
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onTriggerAction(node.actionId as string, nodeId)}
      >
        {node.actionLabel}
      </Button>
    ) : undefined;
  return (
    <div data-slot="surface-empty" data-node-id={nodeId}>
      <EmptyState
        variant="dashed"
        compact
        title={node.title}
        description={node.description}
        action={action}
      />
    </div>
  );
};
