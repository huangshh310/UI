"use client";

/**
 * AiSurface 默认表单控件渲染器：双向数据绑定、枚举下拉/单选与无障碍错误关联。
 */
import { cn } from "@matt-ui/utils";
import { useId, type ReactNode } from "react";
import { DrawCheckbox } from "../draw-checkbox/index.js";
import { FormRadioGroup, FormRadioItem } from "../form/index.js";
import { SpringSelect } from "../spring-select/index.js";
import type { SurfaceControlNode } from "./ai-surface-0-nodes.js";
import { scopeToField } from "./ai-surface-1-schema.js";
import type {
  SurfaceEnumOption,
  SurfacePropertySchema,
  SurfaceRendererProps,
} from "./ai-surface.types.js";
import { CONTROL_INPUT_CLASS } from "./ai-surface.variants.js";

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

export const SurfaceBooleanControl = (p: SurfaceRendererProps) => {
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

export const SurfaceRadioControl = (p: SurfaceRendererProps) => {
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

export const SurfaceSelectControl = (p: SurfaceRendererProps) => {
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

export const SurfaceTextareaControl = (p: SurfaceRendererProps) => {
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

export const SurfaceNumberControl = (p: SurfaceRendererProps) => {
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

export const SurfaceTextControl = (p: SurfaceRendererProps) => {
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
