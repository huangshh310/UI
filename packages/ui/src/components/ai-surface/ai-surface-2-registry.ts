/**
 * AiSurface 优先级渲染器注册表（tester + rankWith）与纯数据联动规则求值。
 */
import type { SurfaceNode } from "./ai-surface-0-nodes.js";
import { scopeToField } from "./ai-surface-1-schema.js";
import type {
  SurfaceFieldType,
  SurfaceNodeKind,
  SurfacePredicate,
  SurfaceRendererEntry,
  SurfaceRule,
  SurfaceRuleCondition,
  SurfaceRuleEffect,
  SurfaceTester,
  SurfaceTesterContext,
} from "./ai-surface.types.js";

export const NOT_APPLICABLE = -1;

export const rankWith =
  (priority: number, predicate: SurfacePredicate): SurfaceTester =>
  (node, ctx) =>
    predicate(node, ctx) ? priority : NOT_APPLICABLE;

export const isKind =
  (kind: SurfaceNodeKind): SurfacePredicate =>
  (node) =>
    node.kind === kind;

export const isControl: SurfacePredicate = (node) => node.kind === "control";

export const schemaTypeIs =
  (expectedType: SurfaceFieldType): SurfacePredicate =>
  (_node, ctx) =>
    ctx.propertySchema?.type === expectedType;

export const hasEnum: SurfacePredicate = (_node, ctx) =>
  Boolean(ctx.propertySchema?.enum?.length || ctx.propertySchema?.oneOf?.length);

export const scopeEndsWith =
  (segment: string): SurfacePredicate =>
  (node) =>
    node.kind === "control" && (node.scope.endsWith(`/${segment}`) || node.scope === segment);

export const optionIs =
  (key: string, expected: unknown): SurfacePredicate =>
  (node) =>
    node.options?.[key] === expected;

export const and =
  (...predicates: SurfacePredicate[]): SurfacePredicate =>
  (node, ctx) =>
    predicates.every((fn) => fn(node, ctx));

export const or =
  (...predicates: SurfacePredicate[]): SurfacePredicate =>
  (node, ctx) =>
    predicates.some((fn) => fn(node, ctx));

export const selectSurfaceRenderer = (
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

export const evaluateSurfaceRule = (
  rule: SurfaceRule | undefined,
  data: Record<string, unknown>,
): { visible: boolean; disabled: boolean } => {
  if (!rule) return { visible: true, disabled: false };
  const matched = matchesRuleCondition(rule.condition, data);
  return RULE_EFFECT_RESOLVERS[rule.effect](matched);
};
