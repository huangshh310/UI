"use client";

/**
 * DashboardShellBlock 的内部结构组件：侧边栏、顶栏、KPI 网格与状态筛选条。
 */
import { cn } from "@matt-ui/utils";
import { Activity, Layers, PanelLeftClose, PanelLeftOpen, Plus, Server } from "lucide-react";
import { Badge } from "../badge/index.js";
import { Breadcrumb } from "../breadcrumb/index.js";
import { Button } from "../button/index.js";
import { Card, CardContent } from "../card/index.js";
import { CommandMenu } from "../command-menu/index.js";
import type { DashboardKpiItem, DashboardShellVariant } from "./dashboard-shell-block.types.js";
import {
  DASHBOARD_STATUS_FILTERS,
  shellSidebarVariants,
} from "./dashboard-shell-block.variants.js";

export const DASHBOARD_NAV_ITEMS = [
  { id: "overview", label: "运行概览", count: "24", Icon: Activity },
  { id: "clusters", label: "边缘节点", count: "3", Icon: Server },
  { id: "registry", label: "组件清单", count: "89", Icon: Layers },
] as const;

export interface SidebarProps {
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

export const ShellSidebar = ({
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

export const KpiGrid = ({ items, compact }: { items: DashboardKpiItem[]; compact: boolean }) => (
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

export const StatusFilterBar = ({
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

export const ShellTopBar = ({
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
