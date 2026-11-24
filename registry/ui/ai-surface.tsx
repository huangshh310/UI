// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiSurface：面向智能体的受限语义视图与优先级 Schema 渲染容器。
 * 提供多区域语义布局、优先级渲染器动态分发、流式增量更新与人机协同状态闭环。
 */

import { Alert, type AlertVariant } from "@/components/ui/alert";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button, type ButtonVariant } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DrawCheckbox } from "@/components/ui/draw-checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { FormRadioGroup, FormRadioItem } from "@/components/ui/form";
import { Progress, type ProgressTone } from "@/components/ui/progress";
import { SpringSelect } from "@/components/ui/spring-select";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type ComponentType, type ReactNode, useEffect, useId, useState } from "react";

export const surfaceRootVariants = cva("flex w-full min-w-0 flex-col gap-3.5 text-foreground", {
  variants: {
    hasDock: {
      true: "@2xl:grid @2xl:grid-cols-[minmax(0,1fr)_16rem] @2xl:items-start @2xl:gap-5",
      false: "",
    },
  },
  defaultVariants: {
    hasDock: false,
  },
});

export const SURFACE_TONE_TEXT: Record<SurfaceTone, string> = {
  neutral: "text-foreground",
  signal: "text-info",
  success: "text-emerald-700 dark:text-emerald-400",
  warning: "text-amber-700 dark:text-amber-400",
  danger: "text-destructive",
  info: "text-info",
};

export const SURFACE_STATUS_TEXT: Record<SurfaceStatus, string> = {
  idle: "idle",
  pending: "pending",
  running: "running",
  done: "done",
  error: "error",
  cancelled: "cancelled",
};

export const SURFACE_STATUS_META: Record<
  SurfaceStatus,
  { label: string; variant: BadgeVariant; dot: boolean; pulse: boolean }
> = {
  idle: { label: "待命", variant: "outline", dot: false, pulse: false },
  pending: { label: "等待中", variant: "warning", dot: true, pulse: false },
  running: { label: "执行中", variant: "signal", dot: true, pulse: true },
  done: { label: "已完成", variant: "success", dot: true, pulse: false },
  error: { label: "异常", variant: "destructive", dot: true, pulse: false },
  cancelled: { label: "已取消", variant: "secondary", dot: false, pulse: false },
};

export const TONE_TO_BADGE: Record<SurfaceTone, BadgeVariant> = {
  neutral: "secondary",
  signal: "signal",
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "soft",
};

export const TONE_TO_ALERT: Record<SurfaceTone, AlertVariant> = {
  neutral: "neutral",
  signal: "info",
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "info",
};

export const TONE_TO_PROGRESS: Record<SurfaceTone, ProgressTone> = {
  neutral: "primary",
  signal: "signal",
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "signal",
};

export const INTENT_TO_BUTTON: Record<SurfaceButtonIntent, ButtonVariant> = {
  primary: "primary",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  danger: "destructive",
  signal: "signal",
  submit: "primary",
  cancel: "outline",
};

export const STACK_GAP_CLASS = {
  sm: "gap-2",
  md: "gap-3.5",
  lg: "gap-5",
} as const;

export const STACK_ALIGN_CLASS = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  between: "items-center justify-between",
  stretch: "items-stretch",
} as const;

export const GRID_COLS_CLASS = {
  1: "grid-cols-1",
  2: "grid-cols-1 @sm:grid-cols-2",
  3: "grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-3",
  4: "grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-4",
} as const;

export const CONTROL_INPUT_CLASS =
  "box-border w-full rounded-lg border border-solid border-input bg-card px-3 py-2 font-sans text-sm text-foreground transition-colors placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive";
export type SurfaceTone = "neutral" | "signal" | "success" | "warning" | "danger" | "info";
export type SurfaceStatus = "idle" | "pending" | "running" | "done" | "error" | "cancelled";
export type SurfaceRuleEffect = "SHOW" | "HIDE" | "ENABLE" | "DISABLE";

export interface SurfaceRuleCondition {
  scope: string;
  eq?: unknown;
  neq?: unknown;
  truthy?: boolean;
}

export interface SurfaceRule {
  effect: SurfaceRuleEffect;
  condition: SurfaceRuleCondition;
}

export type SurfaceFieldType = "string" | "number" | "integer" | "boolean";

export interface SurfaceEnumOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
}

export interface SurfacePropertySchema {
  type: SurfaceFieldType;
  title?: string;
  description?: string;
  default?: unknown;
  enum?: string[];
  oneOf?: SurfaceEnumOption[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: "textarea" | "email" | "url" | "password";
}

export interface SurfaceDataSchema {
  type?: "object";
  title?: string;
  description?: string;
  properties: Record<string, SurfacePropertySchema>;
  required?: string[];
}

export type SurfaceNodeKind = SurfaceNode["kind"];
export type SurfaceRegionInput = SurfaceNode | SurfaceNode[];

export interface SurfaceView {
  title?: string;
  main: SurfaceRegionInput;
  dock?: SurfaceRegionInput;
  layer?: SurfaceRegionInput;
}

export type SurfacePatch =
  | { op: "replace"; targetId: string; node: SurfaceNode }
  | { op: "mergeProps"; targetId: string; patch: Record<string, unknown> }
  | { op: "appendItems"; targetId: string; items: unknown[] }
  | { op: "remove"; targetId: string };

export interface SurfaceActionEvent {
  actionId: string;
  nodeId: string;
  payload?: Record<string, unknown>;
  values: Record<string, unknown>;
}

export type SurfaceAnswer =
  | { status: "submitted"; actionId: string; values: Record<string, unknown> }
  | { status: "cancelled"; actionId?: string; reason?: string }
  | { status: "unsupported"; fallbackText: string };

export interface SurfaceTesterContext {
  schema?: SurfaceDataSchema;
  propertySchema?: SurfacePropertySchema;
  data: Record<string, unknown>;
  streaming: boolean;
}

export type SurfaceTester = (node: SurfaceNode, ctx: SurfaceTesterContext) => number;
export type SurfacePredicate = (node: SurfaceNode, ctx: SurfaceTesterContext) => boolean;

export interface SurfaceRendererProps {
  node: SurfaceNode;
  nodeId: string;
  disabled: boolean;
  streaming: boolean;
  schema?: SurfaceDataSchema;
  propertySchema?: SurfacePropertySchema;
  data: Record<string, unknown>;
  errors: Record<string, string>;
  onValueChange: (field: string, value: unknown) => void;
  onTriggerAction: (
    actionId: string,
    nodeId: string,
    intent?: SurfaceButtonIntent,
    payload?: Record<string, unknown>,
  ) => void;
  renderNode: (child: SurfaceNode, pathId: string, parentDisabled?: boolean) => ReactNode;
}

export interface SurfaceRendererEntry {
  id: string;
  tester: SurfaceTester;
  renderer: ComponentType<SurfaceRendererProps>;
}

export interface AiSurfaceProps {
  uischema?: SurfaceView;
  schema?: SurfaceDataSchema;
  data?: Record<string, unknown>;
  defaultData?: Record<string, unknown>;
  onDataChange?: (data: Record<string, unknown>, changedField: string) => void;
  errors?: Record<string, string>;
  renderers?: SurfaceRendererEntry[];
  streaming?: boolean;
  disabled?: boolean;
  onAction?: (event: SurfaceActionEvent) => void;
  onResolve?: (answer: SurfaceAnswer) => void;
  className?: string;
}
interface SurfaceHead {
  title: string;
  description?: string;
  status?: SurfaceStatus;
  badge?: string;
  tone?: SurfaceTone;
}

interface SurfaceNodeBase {
  key?: string;
  id?: string;
  tone?: SurfaceTone;
  status?: SurfaceStatus;
  rule?: SurfaceRule;
  options?: Record<string, unknown>;
}

interface SurfaceStackNode extends SurfaceNodeBase {
  kind: "stack";
  direction?: "vertical" | "horizontal";
  gap?: "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "between" | "stretch";
  children: SurfaceNode[];
}

interface SurfaceGridNode extends SurfaceNodeBase {
  kind: "grid";
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  children: SurfaceNode[];
}

interface SurfaceCardNode extends SurfaceNodeBase {
  kind: "card";
  variant?: "default" | "elevated" | "subtle";
  head?: string | SurfaceHead;
  end?: SurfaceNode | SurfaceNode[];
  foot?: SurfaceNode | SurfaceNode[];
  children?: SurfaceNode[];
}

interface SurfaceGroupNode extends SurfaceNodeBase {
  kind: "group";
  title?: string;
  description?: string;
  end?: SurfaceNode | SurfaceNode[];
  foot?: SurfaceNode | SurfaceNode[];
  children: SurfaceNode[];
}

interface SurfaceTabItem {
  key: string;
  label: string;
  badge?: string;
  children: SurfaceNode[];
}

interface SurfaceTabsNode extends SurfaceNodeBase {
  kind: "tabs";
  defaultTab?: string;
  tabs: SurfaceTabItem[];
}

interface SurfaceTextNode extends SurfaceNodeBase {
  kind: "text";
  text: string;
  variant?: "body" | "muted" | "heading" | "caption" | "code";
}

interface SurfaceKvItem {
  key?: string;
  label: string;
  value: string | number | boolean;
  tone?: SurfaceTone;
  mono?: boolean;
}

interface SurfaceKvNode extends SurfaceNodeBase {
  kind: "kv";
  columns?: 1 | 2;
  items: SurfaceKvItem[];
}

interface SurfaceStatItem {
  key?: string;
  label: string;
  value: string | number;
  delta?: string;
  tone?: SurfaceTone;
}

interface SurfaceStatsNode extends SurfaceNodeBase {
  kind: "stats";
  items: SurfaceStatItem[];
}

interface SurfaceBadgeNode extends SurfaceNodeBase {
  kind: "badge";
  label: string;
}

interface SurfaceProgressNode extends SurfaceNodeBase {
  kind: "progress";
  label?: string;
  value: number;
  max?: number;
  valueLabel?: string;
}

interface SurfaceTableColumn {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  priority?: number;
  cellKind?: "text" | "badge" | "meter" | "mono";
  sortable?: boolean;
}

interface SurfaceTableNode extends SurfaceNodeBase {
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

interface SurfaceCodeNode extends SurfaceNodeBase {
  kind: "code";
  code: string;
  language?: string;
  title?: string;
}

interface SurfaceAlertNode extends SurfaceNodeBase {
  kind: "alert";
  title: string;
  description?: string;
}

interface SurfaceEmptyNode extends SurfaceNodeBase {
  kind: "empty";
  title: string;
  description?: string;
  actionLabel?: string;
  actionId?: string;
}

interface SurfaceControlNode extends SurfaceNodeBase {
  kind: "control";
  scope: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  controlType?: "text" | "textarea" | "number" | "select" | "radio" | "checkbox" | "combobox";
}

type SurfaceButtonIntent =
  "primary" | "secondary" | "outline" | "ghost" | "danger" | "signal" | "submit" | "cancel";

interface SurfaceButtonNode extends SurfaceNodeBase {
  kind: "button";
  actionId: string;
  label: string;
  intent?: SurfaceButtonIntent;
  payload?: Record<string, unknown>;
  disabled?: boolean;
}

interface SurfaceActionsNode extends SurfaceNodeBase {
  kind: "actions";
  align?: "start" | "end" | "between";
  items: SurfaceButtonNode[];
}

interface SurfaceApprovalNode extends SurfaceNodeBase {
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

interface SurfaceDiffLine {
  id: string;
  lineNumber: number;
  type: "context" | "remove" | "add";
  content: string;
}

interface SurfaceDiffNode extends SurfaceNodeBase {
  kind: "diff";
  fileName?: string;
  summary?: string;
  language?: string;
  lines: SurfaceDiffLine[];
  applyActionId?: string;
  rejectActionId?: string;
}

interface SurfaceToolCallNode extends SurfaceNodeBase {
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

interface SurfaceArtifactNode extends SurfaceNodeBase {
  kind: "artifact";
  title: string;
  artifactType?: "code" | "markdown" | "html" | "json";
  language?: string;
  versionLabel?: string;
  summary?: string;
  content: string;
}

interface SurfaceCitationNode extends SurfaceNodeBase {
  kind: "citation";
  index?: number;
  title: string;
  url?: string;
  domain?: string;
  snippet?: string;
}

interface SurfaceTreeItem {
  id: string;
  label: string;
  badge?: string;
  children?: SurfaceTreeItem[];
}

interface SurfaceTreeNode extends SurfaceNodeBase {
  kind: "tree";
  title?: string;
  items: SurfaceTreeItem[];
  defaultExpandedIds?: string[];
  selectActionId?: string;
}

interface SurfaceExtensionNode extends SurfaceNodeBase {
  kind: `x-${string}`;
  props?: Record<string, unknown>;
  fallbackText?: string;
}

type SurfaceNode =
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
const SCOPE_PREFIX = "#/properties/";

const scopeToField = (scope: string): string =>
  scope.startsWith(SCOPE_PREFIX) ? scope.slice(SCOPE_PREFIX.length) : scope;

const resolvePropertySchema = (
  schema: SurfaceDataSchema | undefined,
  scope: string,
): SurfacePropertySchema | undefined => schema?.properties[scopeToField(scope)];

const deriveDefaultData = (
  schema: SurfaceDataSchema | undefined,
  initial?: Record<string, unknown>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  if (schema) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.default !== undefined) result[key] = prop.default;
    }
  }
  return initial ? { ...result, ...initial } : result;
};

const toControlNode = (
  field: string,
  prop: SurfacePropertySchema,
  requiredSet: Set<string>,
): SurfaceControlNode => ({
  kind: "control",
  key: field,
  scope: `${SCOPE_PREFIX}${field}`,
  label: prop.title ?? field,
  description: prop.description,
  required: requiredSet.has(field),
});

const deriveUiSchema = (schema: SurfaceDataSchema): SurfaceView => {
  const requiredSet = new Set(schema.required ?? []);
  const controls: SurfaceNode[] = Object.entries(schema.properties).map(([field, prop]) =>
    toControlNode(field, prop, requiredSet),
  );
  const actions: SurfaceNode = {
    kind: "actions",
    key: "form-actions",
    align: "end",
    items: [
      { kind: "button", key: "cancel", actionId: "cancel", label: "取消", intent: "cancel" },
      { kind: "button", key: "submit", actionId: "submit", label: "提交", intent: "submit" },
    ],
  };

  if (schema.title) {
    return {
      main: {
        kind: "card",
        key: "auto-form",
        head: { title: schema.title, description: schema.description },
        foot: actions,
        children: controls,
      },
    };
  }
  return { main: [...controls, actions] };
};

const isEmptyValue = (value: unknown): boolean =>
  value === undefined || value === null || value === "";

const validateNumericRules = (
  label: string,
  prop: SurfacePropertySchema,
  value: unknown,
): string | null => {
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return `${label}必须是有效数字`;
  if (prop.type === "integer" && !Number.isInteger(num)) return `${label}必须是整数`;
  if (prop.minimum !== undefined && num < prop.minimum) return `${label}不能小于 ${prop.minimum}`;
  if (prop.maximum !== undefined && num > prop.maximum) return `${label}不能大于 ${prop.maximum}`;
  return null;
};

const validateStringRules = (
  label: string,
  prop: SurfacePropertySchema,
  value: unknown,
): string | null => {
  const text = String(value);
  if (prop.minLength !== undefined && text.length < prop.minLength) {
    return `${label}至少需要 ${prop.minLength} 个字符`;
  }
  if (prop.maxLength !== undefined && text.length > prop.maxLength) {
    return `${label}最多不超过 ${prop.maxLength} 个字符`;
  }
  if (prop.pattern && !new RegExp(prop.pattern).test(text)) {
    return `${label}格式不符合要求`;
  }
  return null;
};

const validateEnumRules = (
  label: string,
  prop: SurfacePropertySchema,
  value: unknown,
): string | null => {
  const allowed = prop.enum ?? prop.oneOf?.map((item) => item.value);
  if (!allowed || allowed.includes(String(value))) return null;
  return `${label}不在允许的选项范围内`;
};

const validateFieldValue = (
  field: string,
  prop: SurfacePropertySchema,
  value: unknown,
  isRequired: boolean,
): string | null => {
  const label = prop.title ?? field;
  if (isEmptyValue(value)) return isRequired ? `请填写${label}` : null;
  const enumErr = validateEnumRules(label, prop, value);
  if (enumErr) return enumErr;
  if (prop.type === "number" || prop.type === "integer") {
    return validateNumericRules(label, prop, value);
  }
  if (prop.type === "string") return validateStringRules(label, prop, value);
  return null;
};

const validateSurfaceData = (
  schema: SurfaceDataSchema | undefined,
  data: Record<string, unknown>,
): Record<string, string> => {
  if (!schema) return {};
  const requiredSet = new Set(schema.required ?? []);
  const errors: Record<string, string> = {};
  for (const [field, prop] of Object.entries(schema.properties)) {
    const message = validateFieldValue(field, prop, data[field], requiredSet.has(field));
    if (message) errors[field] = message;
  }
  return errors;
};
const NOT_APPLICABLE = -1;

const rankWith =
  (priority: number, predicate: SurfacePredicate): SurfaceTester =>
  (node, ctx) =>
    predicate(node, ctx) ? priority : NOT_APPLICABLE;

const isKind =
  (kind: SurfaceNodeKind): SurfacePredicate =>
  (node) =>
    node.kind === kind;

const isControl: SurfacePredicate = (node) => node.kind === "control";

const schemaTypeIs =
  (expectedType: SurfaceFieldType): SurfacePredicate =>
  (_node, ctx) =>
    ctx.propertySchema?.type === expectedType;

const hasEnum: SurfacePredicate = (_node, ctx) =>
  Boolean(ctx.propertySchema?.enum?.length || ctx.propertySchema?.oneOf?.length);

const scopeEndsWith =
  (segment: string): SurfacePredicate =>
  (node) =>
    node.kind === "control" && (node.scope.endsWith(`/${segment}`) || node.scope === segment);

const optionIs =
  (key: string, expected: unknown): SurfacePredicate =>
  (node) =>
    node.options?.[key] === expected;

const and =
  (...predicates: SurfacePredicate[]): SurfacePredicate =>
  (node, ctx) =>
    predicates.every((fn) => fn(node, ctx));

const or =
  (...predicates: SurfacePredicate[]): SurfacePredicate =>
  (node, ctx) =>
    predicates.some((fn) => fn(node, ctx));

const selectSurfaceRenderer = (
  renderers: SurfaceRendererEntry[],
  node: SurfaceNode,
  ctx: SurfaceTesterContext,
): SurfaceRendererEntry | undefined => {
  let bestEntry: SurfaceRendererEntry | undefined;
  let bestScore = NOT_APPLICABLE;
  for (const entry of renderers) {
    const score = entry.tester(node, ctx);
    if (score > NOT_APPLICABLE && score >= bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }
  return bestEntry;
};

const matchesRuleCondition = (
  condition: SurfaceRuleCondition,
  data: Record<string, unknown>,
): boolean => {
  const actual = data[scopeToField(condition.scope)];
  if (condition.eq !== undefined && actual !== condition.eq) return false;
  if (condition.neq !== undefined && actual === condition.neq) return false;
  if (condition.truthy !== undefined && Boolean(actual) !== condition.truthy) return false;
  return true;
};

const RULE_EFFECT_RESOLVERS: Record<
  SurfaceRuleEffect,
  (matched: boolean) => { visible: boolean; disabled: boolean }
> = {
  SHOW: (matched) => ({ visible: matched, disabled: false }),
  HIDE: (matched) => ({ visible: !matched, disabled: false }),
  ENABLE: (matched) => ({ visible: true, disabled: !matched }),
  DISABLE: (matched) => ({ visible: true, disabled: matched }),
};

const evaluateSurfaceRule = (
  rule: SurfaceRule | undefined,
  data: Record<string, unknown>,
): { visible: boolean; disabled: boolean } => {
  if (!rule) return { visible: true, disabled: false };
  const matched = matchesRuleCondition(rule.condition, data);
  return RULE_EFFECT_RESOLVERS[rule.effect](matched);
};
const childPath = (prefix: string, key: string | undefined, index: number): string =>
  `${prefix}.${key ?? index}`;

const deriveSlotInput = (
  slot: SurfaceNode | SurfaceNode[] | undefined,
  slotPrefix: string,
): SurfaceNode | SurfaceNode[] | undefined => {
  if (!slot) return undefined;
  if (Array.isArray(slot)) {
    return slot.map((item, idx) => deriveNodeIds(item, childPath(slotPrefix, item.key, idx)));
  }
  return deriveNodeIds(slot, childPath(slotPrefix, slot.key, 0));
};

const deriveTabsList = (tabs: SurfaceTabItem[], prefix: string): SurfaceTabItem[] =>
  tabs.map((tab) => ({
    ...tab,
    children: deriveNodeArray(tab.children, `${prefix}.${tab.key}`),
  }));

const deriveActionsItems = (items: SurfaceButtonNode[], prefix: string): SurfaceButtonNode[] =>
  items.map((btn, idx) => ({
    ...btn,
    id: childPath(prefix, btn.key, idx),
  }));

const deriveContainerExtras = (node: SurfaceNode, id: string): SurfaceNode => {
  if (node.kind === "card") {
    return {
      ...node,
      id,
      end: deriveSlotInput(node.end, `${id}.end`),
      foot: deriveSlotInput(node.foot, `${id}.foot`),
      children: node.children ? deriveNodeArray(node.children, id) : undefined,
    };
  }
  if (node.kind === "group") {
    return {
      ...node,
      id,
      end: deriveSlotInput(node.end, `${id}.end`),
      foot: deriveSlotInput(node.foot, `${id}.foot`),
      children: deriveNodeArray(node.children, id),
    };
  }
  if (node.kind === "stack" || node.kind === "grid") {
    return { ...node, id, children: deriveNodeArray(node.children, id) };
  }
  if (node.kind === "tabs") {
    return { ...node, id, tabs: deriveTabsList(node.tabs, id) };
  }
  if (node.kind === "actions") {
    return { ...node, id, items: deriveActionsItems(node.items, id) };
  }
  return { ...node, id };
};

const deriveNodeIds = (node: SurfaceNode, pathId: string): SurfaceNode =>
  deriveContainerExtras(node, pathId);

const deriveNodeArray = (nodes: SurfaceNode[], prefix: string): SurfaceNode[] =>
  nodes.map((node, index) => deriveNodeIds(node, childPath(prefix, node.key, index)));

const deriveRegion = (
  region: SurfaceRegionInput | undefined,
  regionName: string,
): SurfaceRegionInput | undefined => {
  if (!region) return undefined;
  if (Array.isArray(region)) return deriveNodeArray(region, regionName);
  return deriveNodeIds(region, childPath(regionName, region.key, 0));
};

const deriveSurfaceIds = (view: SurfaceView): SurfaceView => ({
  ...view,
  main: deriveRegion(view.main, "main") as SurfaceRegionInput,
  dock: deriveRegion(view.dock, "dock"),
  layer: deriveRegion(view.layer, "layer"),
});

const appendToNode = (node: SurfaceNode, added: unknown[]): SurfaceNode => {
  if ("children" in node && Array.isArray(node.children)) {
    return { ...node, children: [...node.children, ...(added as SurfaceNode[])] };
  }
  if (node.kind === "table") {
    return { ...node, rows: [...node.rows, ...(added as Record<string, unknown>[])] };
  }
  if (node.kind === "diff") {
    return { ...node, lines: [...node.lines, ...(added as typeof node.lines)] };
  }
  if ("items" in node && Array.isArray(node.items)) {
    return { ...node, items: [...node.items, ...added] } as SurfaceNode;
  }
  return node;
};

const applyNodeHit = (node: SurfaceNode, patch: SurfacePatch): SurfaceNode => {
  if (patch.op === "replace") return { ...patch.node, id: node.id };
  if (patch.op === "mergeProps") return { ...node, ...patch.patch, id: node.id } as SurfaceNode;
  if (patch.op === "appendItems") return appendToNode(node, patch.items);
  return node;
};

const patchSlot = (
  slot: SurfaceNode | SurfaceNode[] | undefined,
  patch: SurfacePatch,
): SurfaceNode | SurfaceNode[] | undefined => {
  if (!slot) return undefined;
  if (Array.isArray(slot)) return patchArray(slot, patch);
  if (patch.op === "remove" && slot.id === patch.targetId) return undefined;
  return patchSingleNode(slot, patch);
};

const patchChildrenOf = (node: SurfaceNode, patch: SurfacePatch): SurfaceNode => {
  if (node.kind === "card") {
    return {
      ...node,
      end: patchSlot(node.end, patch),
      foot: patchSlot(node.foot, patch),
      children: node.children ? patchArray(node.children, patch) : undefined,
    };
  }
  if (node.kind === "group") {
    return {
      ...node,
      end: patchSlot(node.end, patch),
      foot: patchSlot(node.foot, patch),
      children: patchArray(node.children, patch),
    };
  }
  if (node.kind === "stack" || node.kind === "grid") {
    return { ...node, children: patchArray(node.children, patch) };
  }
  if (node.kind === "tabs") {
    return {
      ...node,
      tabs: node.tabs.map((t) => ({ ...t, children: patchArray(t.children, patch) })),
    };
  }
  return node;
};

const patchSingleNode = (node: SurfaceNode, patch: SurfacePatch): SurfaceNode => {
  const updated = node.id === patch.targetId ? applyNodeHit(node, patch) : node;
  return patchChildrenOf(updated, patch);
};

const patchArray = (nodes: SurfaceNode[], patch: SurfacePatch): SurfaceNode[] =>
  nodes
    .filter((item) => !(patch.op === "remove" && item.id === patch.targetId))
    .map((item) => patchSingleNode(item, patch));

const patchRegion = (
  region: SurfaceRegionInput | undefined,
  patch: SurfacePatch,
): SurfaceRegionInput | undefined => {
  if (!region) return undefined;
  if (Array.isArray(region)) return patchArray(region, patch);
  if (patch.op === "remove" && region.id === patch.targetId) return [];
  return patchSingleNode(region, patch);
};

const applyOnePatch = (view: SurfaceView, patch: SurfacePatch): SurfaceView => {
  const withIds = deriveSurfaceIds(view);
  return deriveSurfaceIds({
    ...withIds,
    main: patchRegion(withIds.main, patch) as SurfaceRegionInput,
    dock: patchRegion(withIds.dock, patch),
    layer: patchRegion(withIds.layer, patch),
  });
};

const applySurfacePatch = (
  view: SurfaceView,
  patches: SurfacePatch | SurfacePatch[],
): SurfaceView => {
  const list = Array.isArray(patches) ? patches : [patches];
  return list.reduce(applyOnePatch, deriveSurfaceIds(view));
};
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

const renderSurfaceText = (
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

const FALLBACK_RENDERER_ENTRY: SurfaceRendererEntry = {
  id: "surface-fallback",
  tester: () => 0,
  renderer: ({ node, nodeId }) => <FallbackNodeRenderer node={node} nodeId={nodeId} />,
};

const normalizeSurfaceNodes = (region: SurfaceRegionInput | undefined): SurfaceNode[] => {
  if (!region) return [];
  return Array.isArray(region) ? region : [region];
};

const resolveSurfaceRawView = (p: AiSurfaceProps) =>
  p.uischema ?? (p.schema ? deriveUiSchema(p.schema) : undefined);

const useLayerEscape = (hasLayer: boolean, onResolve: AiSurfaceProps["onResolve"]) => {
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

const useSurfaceController = (p: AiSurfaceProps) => {
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

interface SurfaceDispatchEnv {
  registry: SurfaceRendererEntry[];
  schema: AiSurfaceProps["schema"];
  streaming: boolean;
  disabled: boolean;
  activeData: Record<string, unknown>;
  activeErrors: Record<string, string>;
  onValueChange: SurfaceRendererProps["onValueChange"];
  onTriggerAction: SurfaceRendererProps["onTriggerAction"];
}

const createNodeDispatcher = (env: SurfaceDispatchEnv) => {
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

const SurfaceStackView = ({ node, nodeId, disabled, renderNode }: SurfaceRendererProps) => {
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

const SurfaceGridView = ({ node, nodeId, disabled, renderNode }: SurfaceRendererProps) => {
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

const SurfaceCardView = ({ node, nodeId, disabled, renderNode }: SurfaceRendererProps) => {
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

const SurfaceGroupView = ({ node, nodeId, disabled, renderNode }: SurfaceRendererProps) => {
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

const SurfaceTabsView = ({ node, nodeId, disabled, renderNode }: SurfaceRendererProps) => {
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
const TEXT_VARIANT_CLASS = {
  heading: "text-base font-semibold tracking-tight",
  body: "text-sm leading-relaxed",
  muted: "text-xs leading-relaxed text-muted-foreground",
  caption: "text-[11px] text-muted-foreground",
  code: "rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs",
} as const;

const SurfaceTextView = ({ node, nodeId }: SurfaceRendererProps) => {
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

const SurfaceKvView = ({ node, nodeId }: SurfaceRendererProps) => {
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

const SurfaceStatsView = ({ node, nodeId }: SurfaceRendererProps) => {
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

const SurfaceBadgeView = ({ node, nodeId }: SurfaceRendererProps) => {
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

const SurfaceProgressView = ({ node, nodeId }: SurfaceRendererProps) => {
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

const SurfaceCodeView = ({ node, nodeId }: SurfaceRendererProps) => {
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

const SurfaceAlertView = ({ node, nodeId }: SurfaceRendererProps) => {
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

const SurfaceEmptyView = ({ node, nodeId, disabled, onTriggerAction }: SurfaceRendererProps) => {
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
const COL_ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const TableCellValue = ({ col, raw }: { col: SurfaceTableColumn; raw: unknown }) => {
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

const SurfaceTableRows = ({
  node,
  nodeId,
  clickable,
  onTriggerAction,
}: {
  node: SurfaceTableNode;
  nodeId: string;
  clickable: boolean;
  onTriggerAction: SurfaceRendererProps["onTriggerAction"];
}) => {
  if (node.rows.length === 0) {
    return (
      <tr>
        <td colSpan={node.columns.length} className="px-3.5 py-6 text-center text-muted-foreground">
          {node.emptyMessage ?? "暂无数据"}
        </td>
      </tr>
    );
  }
  const rowKey = node.rowKey ?? "id";
  const actionId = node.rowActionId;
  return (
    <>
      {node.rows.map((row, idx) => (
        <tr
          key={String(row[rowKey] ?? idx)}
          onClick={
            clickable && actionId
              ? () => onTriggerAction(actionId, nodeId, undefined, row)
              : undefined
          }
          className={cn("transition-colors", clickable && "cursor-pointer hover:bg-accent/60")}
        >
          {node.columns.map((col) => (
            <td key={col.key} className={cn("px-3.5 py-2.5", COL_ALIGN_CLASS[col.align ?? "left"])}>
              <TableCellValue col={col} raw={row[col.key]} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

const SurfaceTableView = ({ node, nodeId, disabled, onTriggerAction }: SurfaceRendererProps) => {
  if (node.kind !== "table") return null;
  const clickable = Boolean(node.rowActionId) && !disabled;
  return (
    <div
      data-slot="surface-table"
      data-node-id={nodeId}
      className="overflow-hidden rounded-xl bg-muted/45 p-1"
    >
      {node.title && (
        <div className="px-3 pt-2 pb-1.5">
          <p className="m-0 text-xs font-semibold text-foreground">{node.title}</p>
          {node.description && (
            <p className="m-0 mt-0.5 text-[11px] text-muted-foreground">{node.description}</p>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="text-muted-foreground">
              {node.columns.map((col) => (
                <th
                  key={col.key}
                  className={cn("px-3 py-2 font-medium", COL_ALIGN_CLASS[col.align ?? "left"])}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SurfaceTableRows
              node={node}
              nodeId={nodeId}
              clickable={clickable}
              onTriggerAction={onTriggerAction}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};
const resolveEnumList = (prop?: SurfacePropertySchema): SurfaceEnumOption[] => {
  if (prop?.oneOf?.length) return prop.oneOf;
  if (prop?.enum?.length) return prop.enum.map((val) => ({ value: val, label: val }));
  return [];
};

const toTextValue = (raw: unknown): string =>
  raw === undefined || raw === null ? "" : String(raw);

const isFieldRequired = (node: SurfaceControlNode, field: string, p: SurfaceRendererProps) =>
  Boolean(node.required || p.schema?.required?.includes(field));

const extractControlMeta = (node: SurfaceControlNode, p: SurfaceRendererProps) => {
  const field = scopeToField(node.scope);
  const label = node.label ?? p.propertySchema?.title ?? field;
  const description = node.description ?? p.propertySchema?.description;
  const rawValue = p.data[field];
  return {
    field,
    label,
    description,
    error: p.errors[field],
    required: isFieldRequired(node, field, p),
    rawValue,
    textValue: toTextValue(rawValue),
    locked: p.disabled || Boolean(node.readOnly),
  };
};

const FieldWrapper = ({
  htmlFor,
  label,
  required,
  description,
  error,
  children,
}: {
  htmlFor?: string;
  label: string;
  required: boolean;
  description?: string;
  error?: string;
  children?: ReactNode;
}) => (
  <div data-slot="surface-control" className="flex flex-col gap-1.5">
    <label htmlFor={htmlFor} className="text-xs font-medium text-foreground">
      {label}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
    {children}
    {description && !error && (
      <p className="m-0 text-[11px] text-muted-foreground">{description}</p>
    )}
    {error && (
      <p role="alert" className="m-0 text-xs text-destructive">
        {error}
      </p>
    )}
  </div>
);

const SurfaceBooleanControl = (p: SurfaceRendererProps) => {
  if (p.node.kind !== "control") return null;
  const m = extractControlMeta(p.node, p);
  return (
    <div data-slot="surface-control-boolean">
      <DrawCheckbox
        label={m.label}
        description={m.description}
        checked={Boolean(m.rawValue)}
        disabled={m.locked}
        onCheckedChange={(checked) => p.onValueChange(m.field, checked)}
      />
    </div>
  );
};

const SurfaceRadioControl = (p: SurfaceRendererProps) => {
  if (p.node.kind !== "control") return null;
  const m = extractControlMeta(p.node, p);
  const options = resolveEnumList(p.propertySchema);
  return (
    <FieldWrapper label={m.label} required={m.required} description={m.description} error={m.error}>
      <FormRadioGroup
        aria-label={m.label}
        value={m.textValue}
        disabled={m.locked}
        onValueChange={(val) => p.onValueChange(m.field, val)}
      >
        {options.map((opt) => (
          <FormRadioItem
            key={opt.value}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            badge={opt.badge}
            variant="compact"
          />
        ))}
      </FormRadioGroup>
    </FieldWrapper>
  );
};

const SurfaceSelectControl = (p: SurfaceRendererProps) => {
  if (p.node.kind !== "control") return null;
  const m = extractControlMeta(p.node, p);
  return (
    <div data-slot="surface-control-select">
      <SpringSelect
        label={m.label}
        placeholder={p.node.placeholder ?? "请选择"}
        options={resolveEnumList(p.propertySchema)}
        value={m.textValue === "" ? null : m.textValue}
        hint={m.description}
        error={m.error}
        required={m.required}
        disabled={m.locked}
        onValueChange={(val) => p.onValueChange(m.field, val ?? "")}
      />
    </div>
  );
};

const SurfaceTextareaControl = (p: SurfaceRendererProps) => {
  const inputId = useId();
  if (p.node.kind !== "control") return null;
  const m = extractControlMeta(p.node, p);
  return (
    <FieldWrapper
      htmlFor={inputId}
      label={m.label}
      required={m.required}
      description={m.description}
      error={m.error}
    >
      <textarea
        id={inputId}
        rows={3}
        placeholder={p.node.placeholder}
        readOnly={p.node.readOnly}
        disabled={p.disabled}
        aria-invalid={Boolean(m.error) || undefined}
        value={m.textValue}
        onChange={(e) => p.onValueChange(m.field, e.target.value)}
        className={cn(CONTROL_INPUT_CLASS, "resize-y")}
      />
    </FieldWrapper>
  );
};

const SurfaceNumberControl = (p: SurfaceRendererProps) => {
  const inputId = useId();
  if (p.node.kind !== "control") return null;
  const m = extractControlMeta(p.node, p);
  const step = p.propertySchema?.type === "integer" ? 1 : "any";
  return (
    <FieldWrapper
      htmlFor={inputId}
      label={m.label}
      required={m.required}
      description={m.description}
      error={m.error}
    >
      <input
        id={inputId}
        type="number"
        min={p.propertySchema?.minimum}
        max={p.propertySchema?.maximum}
        step={step}
        placeholder={p.node.placeholder}
        readOnly={p.node.readOnly}
        disabled={p.disabled}
        aria-invalid={Boolean(m.error) || undefined}
        value={m.textValue}
        onChange={(e) =>
          p.onValueChange(m.field, e.target.value === "" ? "" : Number(e.target.value))
        }
        className={cn(CONTROL_INPUT_CLASS, "font-mono tabular-nums")}
      />
    </FieldWrapper>
  );
};

const resolveTextInputType = (format?: SurfacePropertySchema["format"]) =>
  format && format !== "textarea" ? format : "text";

const SurfaceTextControl = (p: SurfaceRendererProps) => {
  const inputId = useId();
  if (p.node.kind !== "control") return null;
  const m = extractControlMeta(p.node, p);
  return (
    <FieldWrapper
      htmlFor={inputId}
      label={m.label}
      required={m.required}
      description={m.description}
      error={m.error}
    >
      <input
        id={inputId}
        type={resolveTextInputType(p.propertySchema?.format)}
        placeholder={p.node.placeholder}
        readOnly={p.node.readOnly}
        disabled={p.disabled}
        aria-invalid={Boolean(m.error) || undefined}
        value={m.textValue}
        onChange={(e) => p.onValueChange(m.field, e.target.value)}
        className={CONTROL_INPUT_CLASS}
      />
    </FieldWrapper>
  );
};
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

const SurfaceButtonView = ({
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

const SurfaceActionsView = ({
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
const controlTypeIs =
  (expected: NonNullable<SurfaceControlNode["controlType"]>): SurfacePredicate =>
  (node) =>
    node.kind === "control" && node.controlType === expected;

const formatIs =
  (expected: string): SurfacePredicate =>
  (_node, ctx) =>
    ctx.propertySchema?.format === expected;

const defaultSurfaceRenderers: SurfaceRendererEntry[] = [
  { id: "default-stack", tester: rankWith(2, isKind("stack")), renderer: SurfaceStackView },
  { id: "default-grid", tester: rankWith(2, isKind("grid")), renderer: SurfaceGridView },
  { id: "default-card", tester: rankWith(2, isKind("card")), renderer: SurfaceCardView },
  { id: "default-group", tester: rankWith(2, isKind("group")), renderer: SurfaceGroupView },
  { id: "default-tabs", tester: rankWith(2, isKind("tabs")), renderer: SurfaceTabsView },
  { id: "default-text", tester: rankWith(2, isKind("text")), renderer: SurfaceTextView },
  { id: "default-kv", tester: rankWith(2, isKind("kv")), renderer: SurfaceKvView },
  { id: "default-stats", tester: rankWith(2, isKind("stats")), renderer: SurfaceStatsView },
  { id: "default-badge", tester: rankWith(2, isKind("badge")), renderer: SurfaceBadgeView },
  {
    id: "default-progress",
    tester: rankWith(2, isKind("progress")),
    renderer: SurfaceProgressView,
  },
  { id: "default-table", tester: rankWith(2, isKind("table")), renderer: SurfaceTableView },
  { id: "default-code", tester: rankWith(2, isKind("code")), renderer: SurfaceCodeView },
  { id: "default-alert", tester: rankWith(2, isKind("alert")), renderer: SurfaceAlertView },
  { id: "default-empty", tester: rankWith(2, isKind("empty")), renderer: SurfaceEmptyView },
  { id: "default-button", tester: rankWith(2, isKind("button")), renderer: SurfaceButtonView },
  { id: "default-actions", tester: rankWith(2, isKind("actions")), renderer: SurfaceActionsView },
  { id: "default-control-text", tester: rankWith(2, isControl), renderer: SurfaceTextControl },
  {
    id: "default-control-boolean",
    tester: rankWith(3, and(isControl, or(schemaTypeIs("boolean"), controlTypeIs("checkbox")))),
    renderer: SurfaceBooleanControl,
  },
  {
    id: "default-control-select",
    tester: rankWith(3, and(isControl, hasEnum)),
    renderer: SurfaceSelectControl,
  },
  {
    id: "default-control-radio",
    tester: rankWith(4, and(isControl, controlTypeIs("radio"), hasEnum)),
    renderer: SurfaceRadioControl,
  },
  {
    id: "default-control-textarea",
    tester: rankWith(3, and(isControl, or(controlTypeIs("textarea"), formatIs("textarea")))),
    renderer: SurfaceTextareaControl,
  },
  {
    id: "default-control-number",
    tester: rankWith(
      3,
      and(isControl, or(schemaTypeIs("number"), schemaTypeIs("integer"), controlTypeIs("number"))),
    ),
    renderer: SurfaceNumberControl,
  },
];
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
      className={cn("@container w-full min-w-0", props.className)}
    >
      <div className={surfaceRootVariants({ hasDock: dockNodes.length > 0 })}>
        <SurfaceRegions
          mainNodes={normalizeSurfaceNodes(derivedView.main)}
          dockNodes={dockNodes}
          layerNodes={normalizeSurfaceNodes(derivedView.layer)}
          renderNode={renderNode}
        />
      </div>
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
