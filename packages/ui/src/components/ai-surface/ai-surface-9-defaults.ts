/**
 * AiSurface 默认轻量渲染器注册表（优先级 2～3，可被高阶或自定义渲染器按得分覆盖）。
 */
import type { SurfaceControlNode } from "./ai-surface-0-nodes.js";
import {
  and,
  hasEnum,
  isControl,
  isKind,
  or,
  rankWith,
  schemaTypeIs,
} from "./ai-surface-2-registry.js";
import {
  SurfaceCardView,
  SurfaceGridView,
  SurfaceGroupView,
  SurfaceStackView,
  SurfaceTabsView,
} from "./ai-surface-6-layout.js";
import {
  SurfaceAlertView,
  SurfaceBadgeView,
  SurfaceCodeView,
  SurfaceEmptyView,
  SurfaceKvView,
  SurfaceProgressView,
  SurfaceStatsView,
  SurfaceTextView,
} from "./ai-surface-7a-display.js";
import { SurfaceTableView } from "./ai-surface-7b-table.js";
import {
  SurfaceBooleanControl,
  SurfaceNumberControl,
  SurfaceRadioControl,
  SurfaceSelectControl,
  SurfaceTextControl,
  SurfaceTextareaControl,
} from "./ai-surface-8a-controls.js";
import { SurfaceActionsView, SurfaceButtonView } from "./ai-surface-8b-actions.js";
import type { SurfacePredicate, SurfaceRendererEntry } from "./ai-surface.types.js";

const controlTypeIs =
  (expected: NonNullable<SurfaceControlNode["controlType"]>): SurfacePredicate =>
  (node) =>
    node.kind === "control" && node.controlType === expected;

const formatIs =
  (expected: string): SurfacePredicate =>
  (_node, ctx) =>
    ctx.propertySchema?.format === expected;

export const defaultSurfaceRenderers: SurfaceRendererEntry[] = [
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
