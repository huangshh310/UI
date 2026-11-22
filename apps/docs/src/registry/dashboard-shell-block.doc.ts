import DashboardShellBlockBasicDemo from "@/demos/dashboard-shell-block/basic";
import DashboardShellBlockEdgeDemo from "@/demos/dashboard-shell-block/edge";
import type { ComponentDoc } from "./registry.types";

export const DASHBOARD_SHELL_BLOCK_DOC: ComponentDoc = {
  slug: "dashboard-shell-block",
  name: "Dashboard Shell Block",
  description: "由侧边栏、CommandMenu、Breadcrumb、KPI Card 与 DataTable 组合的控制台骨架。",
  category: "blocks",
  registryName: "dashboard-shell-block",
  dependencies: ["lucide-react"],
  usage: `import { DashboardShellBlock } from "@/components/ui/dashboard-shell-block";

<DashboardShellBlock workspaceName="matt-ui Cloud" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "可折叠控制台工作区",
      description: "单层 1px 发丝架构边界，内置侧边栏折叠、命令面板跳转、KPI 指标与实时排序表格。",
      file: "dashboard-shell-block/basic.tsx",
      Demo: DashboardShellBlockBasicDemo,
    },
    {
      slug: "edge",
      name: "自定义工作区名称边缘控制台",
      description: "传入 workspaceName 定制侧边栏品牌与面包屑根路径。",
      file: "dashboard-shell-block/edge.tsx",
      Demo: DashboardShellBlockEdgeDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "workspaceName",
      type: "string",
      defaultValue: '"matt-ui Cloud"',
      description: "工作区显示名称",
    },
  ],
  accessibility: [
    "折叠按钮具备动态无障碍名称（折叠侧边栏 / 展开侧边栏），内部复用各组件完整键盘能力。",
  ],
};
