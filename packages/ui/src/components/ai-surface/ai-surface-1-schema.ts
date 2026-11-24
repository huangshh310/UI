/**
 * JSON Schema 数据契约解析、默认值提取、缺省 uischema 自动推导与同步字段校验。
 */
import type { SurfaceControlNode, SurfaceNode } from "./ai-surface-0-nodes.js";
import type { SurfaceDataSchema, SurfacePropertySchema, SurfaceView } from "./ai-surface.types.js";

const SCOPE_PREFIX = "#/properties/";

export const scopeToField = (scope: string): string =>
  scope.startsWith(SCOPE_PREFIX) ? scope.slice(SCOPE_PREFIX.length) : scope;

export const resolvePropertySchema = (
  schema: SurfaceDataSchema | undefined,
  scope: string,
): SurfacePropertySchema | undefined => schema?.properties[scopeToField(scope)];

export const deriveDefaultData = (
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

export const deriveUiSchema = (schema: SurfaceDataSchema): SurfaceView => {
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

export const validateSurfaceData = (
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
