/**
 * AiSurface 纯文本降级序列化：将语义节点树与当前表单状态确定性转换为可读文本。
 */
import type {
  SurfaceCardNode,
  SurfaceControlNode,
  SurfaceExtensionNode,
  SurfaceNode,
  SurfaceTableNode,
  SurfaceTreeItem,
} from "./ai-surface-0-nodes.js";
import { resolvePropertySchema, scopeToField } from "./ai-surface-1-schema.js";
import { evaluateSurfaceRule } from "./ai-surface-2-registry.js";
import type { SurfaceDataSchema, SurfaceRegionInput, SurfaceView } from "./ai-surface.types.js";

interface TextCtx {
  data: Record<string, unknown>;
  schema?: SurfaceDataSchema;
}

const joinNonEmpty = (parts: string[], sep = "\n"): string =>
  parts.filter((part) => part.length > 0).join(sep);

const formatSlotText = (slot: SurfaceNode | SurfaceNode[] | undefined, ctx: TextCtx): string => {
  if (!slot) return "";
  const list = Array.isArray(slot) ? slot : [slot];
  return joinNonEmpty(list.map((item) => formatNodeText(item, ctx)));
};

const formatCardHead = (node: SurfaceCardNode): string => {
  if (!node.head) return "";
  if (typeof node.head === "string") {
    return node.status ? `${node.head} (${node.status})` : node.head;
  }
  const status = node.head.status ?? node.status;
  const titleLine = status ? `${node.head.title} (${status})` : node.head.title;
  return node.head.description ? `${titleLine}\n${node.head.description}` : titleLine;
};

const formatTableText = (node: SurfaceTableNode): string => {
  const header = node.columns.map((col) => col.header).join(" | ");
  const rows = node.rows.map((row) =>
    node.columns.map((col) => String(row[col.key] ?? "")).join(" | "),
  );
  return joinNonEmpty([node.title ?? "", header, ...rows]);
};

const formatControlText = (node: SurfaceControlNode, ctx: TextCtx): string => {
  const field = scopeToField(node.scope);
  const prop = resolvePropertySchema(ctx.schema, node.scope);
  const label = node.label ?? prop?.title ?? field;
  const value = ctx.data[field];
  return `${label}: ${value === undefined || value === null ? "" : String(value)}`;
};

const formatTreeItems = (items: SurfaceTreeItem[], depth = 0): string =>
  items
    .map((item) => {
      const prefix = `${"  ".repeat(depth)}- ${item.label}`;
      const children = item.children?.length
        ? `\n${formatTreeItems(item.children, depth + 1)}`
        : "";
      return `${prefix}${children}`;
    })
    .join("\n");

const NODE_FORMATTERS: Record<string, (node: SurfaceNode, ctx: TextCtx) => string> = {
  stack: (n, ctx) =>
    n.kind === "stack" ? joinNonEmpty(n.children.map((c) => formatNodeText(c, ctx))) : "",
  grid: (n, ctx) =>
    n.kind === "grid" ? joinNonEmpty(n.children.map((c) => formatNodeText(c, ctx))) : "",
  card: (n, ctx) =>
    n.kind === "card"
      ? joinNonEmpty([
          formatCardHead(n),
          formatSlotText(n.end, ctx),
          ...(n.children ?? []).map((c) => formatNodeText(c, ctx)),
          formatSlotText(n.foot, ctx),
        ])
      : "",
  group: (n, ctx) =>
    n.kind === "group"
      ? joinNonEmpty([
          n.title ?? "",
          n.description ?? "",
          ...n.children.map((c) => formatNodeText(c, ctx)),
          formatSlotText(n.foot, ctx),
        ])
      : "",
  tabs: (n, ctx) =>
    n.kind === "tabs"
      ? joinNonEmpty(
          n.tabs.map((t) =>
            joinNonEmpty([`[${t.label}]`, ...t.children.map((c) => formatNodeText(c, ctx))]),
          ),
        )
      : "",
  text: (n) => (n.kind === "text" ? n.text : ""),
  kv: (n) =>
    n.kind === "kv" ? n.items.map((item) => `${item.label}: ${String(item.value)}`).join("\n") : "",
  stats: (n) =>
    n.kind === "stats"
      ? n.items.map((s) => `${s.label}: ${s.value}${s.delta ? ` (${s.delta})` : ""}`).join("\n")
      : "",
  badge: (n) => (n.kind === "badge" ? `[${n.label}]` : ""),
  progress: (n) =>
    n.kind === "progress"
      ? `${n.label ? `${n.label}: ` : ""}${n.valueLabel ?? `${n.value}/${n.max ?? 100}`}`
      : "",
  table: (n) => (n.kind === "table" ? formatTableText(n) : ""),
  code: (n) => (n.kind === "code" ? joinNonEmpty([n.title ?? "", n.code]) : ""),
  alert: (n) => (n.kind === "alert" ? joinNonEmpty([`! ${n.title}`, n.description ?? ""]) : ""),
  empty: (n) => (n.kind === "empty" ? joinNonEmpty([n.title, n.description ?? ""]) : ""),
  control: (n, ctx) => (n.kind === "control" ? formatControlText(n, ctx) : ""),
  button: (n) => (n.kind === "button" ? `[${n.label}]` : ""),
  actions: (n) => (n.kind === "actions" ? n.items.map((btn) => `[${btn.label}]`).join(" ") : ""),
  approval: (n) =>
    n.kind === "approval"
      ? joinNonEmpty([`[approval:${n.riskLevel ?? "medium"}] ${n.title}`, n.command ?? ""])
      : "",
  diff: (n) =>
    n.kind === "diff"
      ? joinNonEmpty([
          n.fileName ?? "diff",
          ...n.lines.map(
            (l) => `${l.type === "add" ? "+" : l.type === "remove" ? "-" : " "} ${l.content}`,
          ),
        ])
      : "",
  "tool-call": (n) =>
    n.kind === "tool-call"
      ? `${n.toolName}${n.status ? ` (${n.status})` : ""}${n.summary ? ` - ${n.summary}` : ""}`
      : "",
  artifact: (n) => (n.kind === "artifact" ? joinNonEmpty([n.title, n.content]) : ""),
  citation: (n) => (n.kind === "citation" ? `[${n.index ?? 1}] ${n.title}` : ""),
  tree: (n) => (n.kind === "tree" ? joinNonEmpty([n.title ?? "", formatTreeItems(n.items)]) : ""),
};

const isExtensionNode = (node: SurfaceNode): node is SurfaceExtensionNode =>
  node.kind.startsWith("x-");

const formatNodeText = (node: SurfaceNode, ctx: TextCtx): string => {
  if (!evaluateSurfaceRule(node.rule, ctx.data).visible) return "";
  const formatter = NODE_FORMATTERS[node.kind];
  if (formatter) return formatter(node, ctx);
  if (isExtensionNode(node)) return node.fallbackText ?? `[${node.kind}]`;
  return "";
};

const formatRegion = (region: SurfaceRegionInput | undefined, ctx: TextCtx): string => {
  if (!region) return "";
  const list = Array.isArray(region) ? region : [region];
  return joinNonEmpty(
    list.map((node) => formatNodeText(node, ctx)),
    "\n\n",
  );
};

export const renderSurfaceText = (
  view: SurfaceView,
  data: Record<string, unknown> = {},
  schema?: SurfaceDataSchema,
): string => {
  const ctx: TextCtx = { data, schema };
  return joinNonEmpty(
    [
      view.title ?? "",
      formatRegion(view.main, ctx),
      formatRegion(view.dock, ctx),
      formatRegion(view.layer, ctx),
    ],
    "\n\n",
  );
};
