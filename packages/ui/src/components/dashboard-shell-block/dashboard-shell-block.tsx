"use client";

import { cn } from "@matt-ui/utils";
import { Activity, Layers, PanelLeftClose, PanelLeftOpen, Server } from "lucide-react";
import { useId, useState } from "react";
import { Badge } from "../badge/index.js";
import { Breadcrumb } from "../breadcrumb/index.js";
import { Button } from "../button/index.js";
import { Card, CardContent } from "../card/index.js";
import { CommandMenu } from "../command-menu/index.js";
import { DataTable, type DataTableColumn } from "../data-table/index.js";
import type { DashboardShellBlockProps } from "./dashboard-shell-block.types.js";

interface DeployRow {
  id: string;
  service: string;
  region: string;
  status: string;
  latency: string;
}

const ROWS: DeployRow[] = [
  { id: "1", service: "edge-gateway", region: "东京", status: "健康", latency: "14ms" },
  { id: "2", service: "registry-cdn", region: "新加坡", status: "健康", latency: "19ms" },
  { id: "3", service: "docs-worker", region: "法兰克福", status: "同步中", latency: "28ms" },
];

const COLUMNS: DataTableColumn<DeployRow>[] = [
  { id: "service", header: "服务", accessor: (row) => row.service, sortable: true },
  { id: "region", header: "节点", accessor: (row) => row.region },
  {
    id: "status",
    header: "状态",
    accessor: (row) => row.status,
    cell: (row) => (
      <Badge variant={row.status === "健康" ? "success" : "signal"} dot>
        {row.status}
      </Badge>
    ),
  },
  { id: "latency", header: "P95", accessor: (row) => row.latency, align: "right" },
];

const NAV_ITEMS = [
  { id: "overview", label: "运行概览", Icon: Activity },
  { id: "clusters", label: "边缘节点", Icon: Server },
  { id: "registry", label: "组件清单", Icon: Layers },
];

const KPIS = [
  { label: "活跃部署", value: "24", delta: "+12%" },
  { label: "平均延迟", value: "16ms", delta: "-4ms" },
  { label: "可用率", value: "99.98%", delta: "SLA" },
];

interface SidebarProps {
  workspaceName: string;
  collapsed: boolean;
  activeNav: string;
  onSelectNav: (id: string) => void;
}

const ShellSidebar = ({ workspaceName, collapsed, activeNav, onSelectNav }: SidebarProps) => (
  <div
    className={cn(
      "flex shrink-0 flex-col gap-3 border-b border-solid border-border bg-secondary/35 p-3 transition-[width] duration-(--ui-duration-fast) md:border-r md:border-b-0",
      collapsed ? "md:w-15" : "md:w-52",
    )}
  >
    <div className="flex items-center gap-2 px-1.5 py-1">
      <span className="size-2.5 shrink-0 rounded-full bg-signal" />
      {!collapsed && (
        <span className="truncate text-sm font-semibold text-foreground">{workspaceName}</span>
      )}
    </div>
    {!collapsed && (
      <CommandMenu
        triggerLabel="快速跳转…"
        groups={[
          {
            heading: "控制台",
            items: NAV_ITEMS.map(({ id, label }) => ({
              id,
              label,
              onSelect: () => onSelectNav(id),
            })),
          },
        ]}
      />
    )}
    <div className="flex flex-row gap-1 md:flex-col">
      {NAV_ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelectNav(id)}
          className={cn(
            "flex h-8 cursor-pointer items-center gap-2 rounded-lg border-0 px-2.5 font-sans text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
            activeNav === id
              ? "bg-background text-foreground shadow-sm dark:bg-card"
              : "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <Icon aria-hidden="true" className="size-3.5 shrink-0" />
          {!collapsed && <span className="truncate">{label}</span>}
        </button>
      ))}
    </div>
  </div>
);

const KpiGrid = () => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
    {KPIS.map((kpi) => (
      <Card key={kpi.label}>
        <CardContent className="flex items-end justify-between py-4">
          <div>
            <p className="m-0 text-xs text-muted-foreground">{kpi.label}</p>
            <p className="m-0 mt-1 font-mono text-xl font-semibold text-foreground tabular-nums">
              {kpi.value}
            </p>
          </div>
          <Badge variant="secondary">{kpi.delta}</Badge>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ShellTopBar = ({
  uid,
  workspaceName,
  currentLabel,
  collapsed,
  onToggleCollapse,
}: {
  uid: string;
  workspaceName: string;
  currentLabel: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-solid border-border px-4 py-3">
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="ghost"
        aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
        onClick={onToggleCollapse}
      >
        {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
      </Button>
      <Breadcrumb
        ariaLabel={`控制台路径 ${uid}`}
        items={[{ label: workspaceName }, { label: currentLabel }]}
      />
    </div>
    <Button size="sm" variant="signal">
      新建发布
    </Button>
  </div>
);

export const DashboardShellBlock = ({
  workspaceName = "matt-ui Cloud",
  className,
}: DashboardShellBlockProps) => {
  const uid = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const currentLabel = NAV_ITEMS.find((item) => item.id === activeNav)?.label ?? "运行概览";

  return (
    <div
      data-slot="dashboard-shell-block"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border border-solid border-border bg-background shadow-sm md:flex-row",
        className,
      )}
    >
      <ShellSidebar
        workspaceName={workspaceName}
        collapsed={collapsed}
        activeNav={activeNav}
        onSelectNav={setActiveNav}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <ShellTopBar
          uid={uid}
          workspaceName={workspaceName}
          currentLabel={currentLabel}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
        <div className="flex flex-col gap-4 p-4">
          <KpiGrid />
          <DataTable
            columns={COLUMNS}
            data={ROWS}
            getRowId={(r) => r.id}
            searchable={false}
            pageSize={5}
          />
        </div>
      </div>
    </div>
  );
};
