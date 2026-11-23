// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * DashboardShellBlock：由侧边栏、CommandMenu、Breadcrumb、KPI Card 与 DataTable 组合的控制台骨架。
 */

import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CommandMenu } from "@/components/ui/command-menu";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Activity, Layers, PanelLeftClose, PanelLeftOpen, Plus, Server } from "lucide-react";
import { useId, useState } from "react";

export interface DeployRow {
  id: string;
  service: string;
  region: string;
  status: string;
  latency: string;
  group: string;
}

export const DASHBOARD_DEFAULT_ROWS: DeployRow[] = [
  {
    id: "1",
    service: "edge-gateway",
    region: "东京",
    status: "健康",
    latency: "14ms",
    group: "overview",
  },
  {
    id: "2",
    service: "registry-cdn",
    region: "新加坡",
    status: "健康",
    latency: "19ms",
    group: "registry",
  },
  {
    id: "3",
    service: "docs-worker",
    region: "法兰克福",
    status: "同步中",
    latency: "28ms",
    group: "clusters",
  },
];

export const DASHBOARD_DEFAULT_KPIS: DashboardKpiItem[] = [
  { label: "活跃部署", value: "24", delta: "+12%", tone: "success" },
  { label: "平均延迟", value: "16ms", delta: "-4ms", tone: "success" },
  { label: "可用率", value: "99.98%", delta: "SLA", tone: "secondary" },
];

export const DASHBOARD_STATUS_FILTERS = ["全部", "健康", "同步中"] as const;

export const shellFrameVariants = cva(
  "flex w-full flex-col overflow-hidden rounded-[24px] border border-solid @2xl:flex-row",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-card shadow-xs dark:border-white/10",
        inset:
          "border-border/80 bg-secondary/45 p-2 shadow-sm dark:border-white/10 dark:bg-background",
        minimal: "border-border/75 bg-background shadow-none dark:border-white/10 dark:bg-card",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const shellSidebarVariants = cva(
  "flex shrink-0 flex-col gap-3 p-3.5 transition-[width] duration-(--ui-duration-fast)",
  {
    variants: {
      variant: {
        default:
          "border-b border-solid border-border/80 bg-secondary/45 dark:border-white/10 dark:bg-white/[0.025] @2xl:border-r @2xl:border-b-0",
        inset: "bg-transparent",
        minimal:
          "border-b border-solid border-border/75 bg-transparent dark:border-white/10 @2xl:border-r @2xl:border-b-0",
      },
      collapsed: {
        true: "@2xl:w-16",
        false: "@2xl:w-56",
      },
    },
    defaultVariants: {
      variant: "default",
      collapsed: false,
    },
  },
);

export const shellCanvasVariants = cva("flex min-w-0 flex-1 flex-col", {
  variants: {
    variant: {
      default: "",
      inset:
        "overflow-hidden rounded-[18px] border border-solid border-border/80 bg-card shadow-xs dark:border-white/10",
      minimal: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
export type DashboardShellVariant = "default" | "inset" | "minimal";

export interface DashboardKpiItem {
  label: string;
  value: string;
  delta: string;
  tone?: "success" | "secondary";
}

export interface DashboardShellBlockProps {
  /** 工作区名称 */
  workspaceName?: string;
  /** 工作区环境标识，显示在侧边栏标题下方 */
  workspaceTier?: string;
  /** 视觉布局变体：标准发丝框架、内嵌画布或极简无底色侧栏 */
  variant?: DashboardShellVariant;
  /** 初始是否折叠侧边栏 */
  defaultCollapsed?: boolean;
  /** 紧凑内边距密度 */
  compact?: boolean;
  /** 右上角主操作按钮文案，默认「新建发布」 */
  primaryActionLabel?: string;
  /** 自定义顶部 KPI 指标卡片 */
  kpis?: DashboardKpiItem[];
  /** 点击右上角主操作按钮的回调 */
  onPrimaryAction?: () => void;
  /** 切换侧边导航分组时的回调 */
  onNavChange?: (navId: string) => void;
  /** 自定义容器类名 */
  className?: string;
}
const DASHBOARD_NAV_ITEMS = [
  { id: "overview", label: "运行概览", count: "24", Icon: Activity },
  { id: "clusters", label: "边缘节点", count: "3", Icon: Server },
  { id: "registry", label: "组件清单", count: "89", Icon: Layers },
] as const;

interface SidebarProps {
  workspaceName: string;
  workspaceTier: string;
  variant: DashboardShellVariant;
  collapsed: boolean;
  activeNav: string;
  onSelectNav: (id: string) => void;
}

const SidebarNavList = ({
  collapsed,
  activeNav,
  onSelectNav,
}: {
  collapsed: boolean;
  activeNav: string;
  onSelectNav: (id: string) => void;
}) => (
  <div className="flex flex-row flex-wrap gap-1 @2xl:flex-col">
    {DASHBOARD_NAV_ITEMS.map(({ id, label, count, Icon }) => {
      const active = activeNav === id;
      return (
        <button
          key={id}
          type="button"
          aria-current={active ? "page" : undefined}
          onClick={() => onSelectNav(id)}
          className={cn(
            "flex h-8.5 cursor-pointer items-center gap-2 rounded-xl border border-solid px-2.5 font-sans text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active
              ? "border-border/80 bg-card text-foreground shadow-xs dark:border-white/10 dark:bg-white/[0.07]"
              : "border-transparent bg-transparent text-muted-foreground hover:bg-accent/70 hover:text-foreground",
          )}
        >
          <Icon aria-hidden="true" className="size-3.5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-left">{label}</span>
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                {count}
              </span>
            </>
          )}
        </button>
      );
    })}
  </div>
);

const ShellSidebar = ({
  workspaceName,
  workspaceTier,
  variant,
  collapsed,
  activeNav,
  onSelectNav,
}: SidebarProps) => (
  <div data-slot="dashboard-sidebar" className={shellSidebarVariants({ variant, collapsed })}>
    <div className="flex items-center gap-2.5 px-1.5 py-1">
      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-solid border-border/80 bg-card shadow-xs dark:border-white/10 dark:bg-white/[0.06]">
        <span aria-hidden="true" className="size-2 rounded-full bg-emerald-500" />
      </span>
      {!collapsed && (
        <div className="min-w-0">
          <p className="m-0 truncate text-xs font-semibold tracking-[-0.01em] text-foreground">
            {workspaceName}
          </p>
          <p className="m-0 truncate font-mono text-[10px] text-muted-foreground">
            {workspaceTier}
          </p>
        </div>
      )}
    </div>
    {!collapsed && (
      <CommandMenu
        triggerLabel="快速跳转…"
        groups={[
          {
            heading: "控制台",
            items: DASHBOARD_NAV_ITEMS.map(({ id, label }) => ({
              id,
              label,
              onSelect: () => onSelectNav(id),
            })),
          },
        ]}
      />
    )}
    <SidebarNavList collapsed={collapsed} activeNav={activeNav} onSelectNav={onSelectNav} />
  </div>
);

const KpiGrid = ({ items, compact }: { items: DashboardKpiItem[]; compact: boolean }) => (
  <div className={cn("grid grid-cols-1 @md:grid-cols-3", compact ? "gap-2.5" : "gap-3")}>
    {items.map((kpi) => (
      <Card
        key={kpi.label}
        className="rounded-2xl border-border/80 bg-card shadow-xs dark:border-white/10"
      >
        <CardContent
          className={cn(
            "flex items-end justify-between gap-2",
            compact ? "px-4 py-3" : "px-4 py-4",
          )}
        >
          <div className="min-w-0">
            <p className="m-0 truncate text-xs text-muted-foreground">{kpi.label}</p>
            <p className="m-0 mt-1 font-mono text-xl font-semibold tracking-tight text-foreground tabular-nums">
              {kpi.value}
            </p>
          </div>
          <Badge variant={kpi.tone ?? "secondary"} size="sm">
            {kpi.delta}
          </Badge>
        </CardContent>
      </Card>
    ))}
  </div>
);

const StatusFilterBar = ({
  sectionTitle,
  rowCount,
  statusFilter,
  onFilterChange,
}: {
  sectionTitle: string;
  rowCount: number;
  statusFilter: string;
  onFilterChange: (next: string) => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-2">
    <div className="flex items-center gap-2">
      <p className="m-0 text-xs font-semibold tracking-[-0.01em] text-foreground">{sectionTitle}</p>
      <span className="rounded-full border border-solid border-border/80 bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground tabular-nums dark:border-white/10">
        {rowCount} 项
      </span>
    </div>
    <fieldset
      aria-label="服务状态筛选"
      className="m-0 inline-flex items-center gap-1 rounded-full border border-solid border-border/80 bg-secondary/45 p-0.5 dark:border-white/10 dark:bg-white/[0.03]"
    >
      {DASHBOARD_STATUS_FILTERS.map((status) => {
        const active = statusFilter === status;
        return (
          <button
            key={status}
            type="button"
            aria-pressed={active}
            onClick={() => onFilterChange(status)}
            className={cn(
              "cursor-pointer rounded-full border-0 px-2.5 py-1 font-sans text-[11px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-card text-foreground shadow-xs dark:bg-white/12"
                : "bg-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {status}
          </button>
        );
      })}
    </fieldset>
  </div>
);

const ShellTopBar = ({
  uid,
  workspaceName,
  currentLabel,
  collapsed,
  primaryActionLabel,
  onToggleCollapse,
  onPrimaryAction,
}: {
  uid: string;
  workspaceName: string;
  currentLabel: string;
  collapsed: boolean;
  primaryActionLabel: string;
  onToggleCollapse: () => void;
  onPrimaryAction?: () => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-solid border-border/80 px-4 py-3 dark:border-white/10">
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="ghost"
        className="size-8 rounded-lg"
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
    <Button size="sm" variant="primary" radius="pill" onClick={onPrimaryAction}>
      <Plus aria-hidden="true" className="size-3.5" />
      <span>{primaryActionLabel}</span>
    </Button>
  </div>
);
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
