/**
 * AiSurface 协议顶层视图、JSON Schema 数据契约、优先级渲染器与协同事件类型定义。
 */
import type { ComponentType, ReactNode } from "react";
import type { SurfaceButtonIntent, SurfaceNode } from "./ai-surface-0-nodes.js";

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
