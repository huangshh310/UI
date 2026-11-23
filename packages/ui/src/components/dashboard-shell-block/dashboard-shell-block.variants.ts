/**
 * DashboardShellBlock 的样式变体与共享控制台数据配置。
 */
import { cva } from "class-variance-authority";
import type { DashboardKpiItem } from "./dashboard-shell-block.types.js";

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
