"use client";

/**
 * AiSurface 默认轻量表格渲染器：支持徽章/进度单元格与行点击动作回传。
 */
import { cn } from "@matt-ui/utils";
import { Badge } from "../badge/index.js";
import { Progress } from "../progress/index.js";
import type { SurfaceTableColumn, SurfaceTableNode } from "./ai-surface-0-nodes.js";
import type { SurfaceRendererProps } from "./ai-surface.types.js";

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

export const SurfaceTableView = ({
  node,
  nodeId,
  disabled,
  onTriggerAction,
}: SurfaceRendererProps) => {
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
