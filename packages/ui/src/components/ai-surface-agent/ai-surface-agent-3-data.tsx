"use client";

/**
 * AiSurfaceAgent 高阶数据与表单控件升级：交互式检索数据表与可搜索组合框。
 */
import { cn } from "@matt-ui/utils";
import {
  scopeToField,
  type SurfaceControlNode,
  type SurfacePredicate,
  type SurfacePropertySchema,
  type SurfaceRendererProps,
  type SurfaceTableColumn,
  type SurfaceTableNode,
} from "../ai-surface/index.js";
import { Badge } from "../badge/index.js";
import { Combobox, type ComboboxOption } from "../combobox/index.js";
import { DataTable, type DataTableColumn } from "../data-table/index.js";
import { Progress } from "../progress/index.js";

const hasSortableColumns = (cols: SurfaceTableColumn[]) =>
  cols.some((col) => Boolean(col.sortable));

export const isInteractiveTable: SurfacePredicate = (node) => {
  if (node.kind !== "table") return false;
  return Boolean(node.searchable) || Boolean(node.selectable) || hasSortableColumns(node.columns);
};

const renderDataCell = (col: SurfaceTableColumn, raw: unknown) => {
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

const toDataTableColumns = (
  columns: SurfaceTableColumn[],
): DataTableColumn<Record<string, unknown>>[] =>
  columns.map((col) => ({
    id: col.key,
    header: col.header,
    align: col.align,
    sortable: col.sortable,
    accessor: (row) => {
      const val = row[col.key];
      return val === undefined || val === null ? "" : String(val);
    },
    cell: (row) => renderDataCell(col, row[col.key]),
  }));

const resolveTableRowId = (node: SurfaceTableNode, row: Record<string, unknown>, idx: number) =>
  String(row[node.rowKey ?? "id"] ?? idx);

export const AgentDataTableView = ({
  node,
  nodeId,
  disabled,
  onTriggerAction,
}: SurfaceRendererProps) => {
  if (node.kind !== "table") return null;
  const actionId = node.rowActionId;
  return (
    <div data-slot="agent-surface-data-table" data-node-id={nodeId}>
      <DataTable
        title={node.title}
        description={node.description}
        data={node.rows}
        columns={toDataTableColumns(node.columns)}
        getRowId={(row, idx) => resolveTableRowId(node, row, idx)}
        searchable={node.searchable}
        selectable={node.selectable}
        emptyMessage={node.emptyMessage}
        onRowClick={
          !disabled && actionId
            ? (row) => onTriggerAction(actionId, nodeId, undefined, row)
            : undefined
        }
      />
    </div>
  );
};

const countEnumItems = (prop?: SurfacePropertySchema): number =>
  prop?.oneOf?.length ?? prop?.enum?.length ?? 0;

export const isComboboxControl: SurfacePredicate = (node, ctx) => {
  if (node.kind !== "control") return false;
  if (node.controlType === "combobox" || node.options?.searchable === true) return true;
  return countEnumItems(ctx.propertySchema) > 6;
};

const toComboboxOptions = (prop?: SurfacePropertySchema): ComboboxOption[] => {
  if (prop?.oneOf?.length) return prop.oneOf;
  if (prop?.enum?.length) return prop.enum.map((val) => ({ value: val, label: val }));
  return [];
};

const resolveComboboxValue = (raw: unknown): string | null =>
  raw === undefined || raw === null || raw === "" ? null : String(raw);

const resolveComboboxMeta = (node: SurfaceControlNode, p: SurfaceRendererProps) => {
  const field = scopeToField(node.scope);
  return {
    field,
    label: node.label ?? p.propertySchema?.title ?? field,
    hint: node.description ?? p.propertySchema?.description,
    error: p.errors[field],
    required: Boolean(node.required || p.schema?.required?.includes(field)),
    locked: p.disabled || Boolean(node.readOnly),
    value: resolveComboboxValue(p.data[field]),
  };
};

export const AgentComboboxControl = (p: SurfaceRendererProps) => {
  if (p.node.kind !== "control") return null;
  const m = resolveComboboxMeta(p.node, p);
  return (
    <div data-slot="agent-surface-combobox" data-node-id={p.nodeId}>
      <Combobox
        label={m.label}
        placeholder={p.node.placeholder ?? "搜索并选择"}
        options={toComboboxOptions(p.propertySchema)}
        value={m.value}
        hint={m.hint}
        error={m.error}
        required={m.required}
        disabled={m.locked}
        showSearchIcon
        onValueChange={(val) => p.onValueChange(m.field, val ?? "")}
      />
    </div>
  );
};
