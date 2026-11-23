"use client";

/**
 * DashboardShellBlock：由侧边栏、CommandMenu、Breadcrumb、KPI Card 与 DataTable 组合的控制台骨架。
 */
import { cn } from "@matt-ui/utils";
import { useId, useState } from "react";
import { Badge } from "../badge/index.js";
import { DataTable, type DataTableColumn } from "../data-table/index.js";
import {
  DASHBOARD_NAV_ITEMS,
  KpiGrid,
  ShellSidebar,
  ShellTopBar,
  StatusFilterBar,
} from "./dashboard-shell-parts.js";
import type { DashboardShellBlockProps } from "./dashboard-shell-block.types.js";
import {
  DASHBOARD_DEFAULT_KPIS,
  DASHBOARD_DEFAULT_ROWS,
  shellCanvasVariants,
  shellFrameVariants,
  type DeployRow,
} from "./dashboard-shell-block.variants.js";

const COLUMNS: DataTableColumn<DeployRow>[] = [
  { id: "service", header: "服务", accessor: (row) => row.service, sortable: true },
  { id: "region", header: "节点", accessor: (row) => row.region },
  {
    id: "status",
    header: "状态",
    accessor: (row) => row.status,
    cell: (row) => (
      <Badge variant={row.status === "健康" ? "success" : "secondary"} dot>
        {row.status}
      </Badge>
    ),
  },
  { id: "latency", header: "P95", accessor: (row) => row.latency, align: "right" },
];

const resolveShellConfig = (props: DashboardShellBlockProps) => ({
  workspaceName: props.workspaceName ?? "matt-ui Cloud",
  workspaceTier: props.workspaceTier ?? "Production",
  variant: props.variant ?? "default",
  defaultCollapsed: props.defaultCollapsed ?? false,
  compact: props.compact ?? false,
  primaryActionLabel: props.primaryActionLabel ?? "新建发布",
  kpis: props.kpis ?? DASHBOARD_DEFAULT_KPIS,
});

const filterRowsByStatus = (status: string) =>
  status === "全部"
    ? DASHBOARD_DEFAULT_ROWS
    : DASHBOARD_DEFAULT_ROWS.filter((row) => row.status === status);

const ShellWorkspaceBody = ({
  kpis,
  compact,
  currentLabel,
  visibleRows,
  statusFilter,
  onFilterChange,
}: {
  kpis: DashboardShellBlockProps["kpis"];
  compact: boolean;
  currentLabel: string;
  visibleRows: DeployRow[];
  statusFilter: string;
  onFilterChange: (next: string) => void;
}) => (
  <div className={cn("flex flex-col", compact ? "gap-3 p-3.5" : "gap-4 p-4 sm:p-5")}>
    <KpiGrid items={kpis ?? DASHBOARD_DEFAULT_KPIS} compact={compact} />
    <StatusFilterBar
      sectionTitle={`${currentLabel} · 服务实例`}
      rowCount={visibleRows.length}
      statusFilter={statusFilter}
      onFilterChange={onFilterChange}
    />
    <DataTable
      columns={COLUMNS}
      data={visibleRows}
      getRowId={(r) => r.id}
      searchable={false}
      pageSize={5}
    />
  </div>
);

export const DashboardShellBlock = (props: DashboardShellBlockProps) => {
  const cfg = resolveShellConfig(props);
  const uid = useId();
  const [collapsed, setCollapsed] = useState(cfg.defaultCollapsed);
  const [activeNav, setActiveNav] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("全部");

  const currentLabel =
    DASHBOARD_NAV_ITEMS.find((item) => item.id === activeNav)?.label ?? "运行概览";

  return (
    <div
      data-slot="dashboard-shell-block"
      data-variant={cfg.variant}
      className={cn("@container w-full", props.className)}
    >
      <div className={shellFrameVariants({ variant: cfg.variant })}>
        <ShellSidebar
          workspaceName={cfg.workspaceName}
          workspaceTier={cfg.workspaceTier}
          variant={cfg.variant}
          collapsed={collapsed}
          activeNav={activeNav}
          onSelectNav={(id) => {
            setActiveNav(id);
            props.onNavChange?.(id);
          }}
        />
        <div className={shellCanvasVariants({ variant: cfg.variant })}>
          <ShellTopBar
            uid={uid}
            workspaceName={cfg.workspaceName}
            currentLabel={currentLabel}
            collapsed={collapsed}
            primaryActionLabel={cfg.primaryActionLabel}
            onToggleCollapse={() => setCollapsed((c) => !c)}
            onPrimaryAction={props.onPrimaryAction}
          />
          <ShellWorkspaceBody
            kpis={cfg.kpis}
            compact={cfg.compact}
            currentLabel={currentLabel}
            visibleRows={filterRowsByStatus(statusFilter)}
            statusFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </div>
      </div>
    </div>
  );
};
