import DashboardShellBlockBasicDemo from "@/demos/dashboard-shell-block/basic";
import DashboardShellBlockEdgeDemo from "@/demos/dashboard-shell-block/edge";
import DashboardShellBlockInsetDemo from "@/demos/dashboard-shell-block/inset";
import type { ComponentDoc } from "./registry.types";

export const DASHBOARD_SHELL_BLOCK_DOC: ComponentDoc = {
  slug: "dashboard-shell-block",
  name: "Dashboard Shell Block",
  description:
    "由侧边栏、CommandMenu、Breadcrumb、KPI Card 与 DataTable 组合的控制台骨架，支持标准发丝框架、内嵌画布与极简侧栏三种布局变体。",
  category: "blocks",
  registryName: "dashboard-shell-block",
  dependencies: ["class-variance-authority", "lucide-react"],
  usage: `import { DashboardShellBlock } from "@/components/ui/dashboard-shell-block";

<DashboardShellBlock workspaceName="matt-ui Cloud" variant="inset" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "可折叠控制台工作区",
      description:
        "单层 1px 发丝架构边界，内置侧边栏折叠、命令面板跳转、状态筛选胶囊、KPI 指标与实时排序表格。",
      file: "dashboard-shell-block/basic.tsx",
      Demo: DashboardShellBlockBasicDemo,
    },
    {
      slug: "edge",
      name: "极简边缘集群控制台",
      description: '传入 workspaceName、workspaceTier 与 variant="minimal" 定制紧凑边缘控制台。',
      file: "dashboard-shell-block/edge.tsx",
      Demo: DashboardShellBlockEdgeDemo,
      directory: false,
    },
    {
      slug: "inset",
      name: "内嵌画布与自定义 KPI 指标",
      description:
        '通过 variant="inset" 将主工作区浮起于柔和侧栏槽内，并支持自定义 kpis 与顶部主操作回调。',
      file: "dashboard-shell-block/inset.tsx",
      Demo: DashboardShellBlockInsetDemo,
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
    {
      name: "workspaceTier",
      type: "string",
      defaultValue: '"Production"',
      description: "工作区环境或套餐副标签",
    },
    {
      name: "variant",
      type: '"default" | "inset" | "minimal"',
      defaultValue: '"default"',
      description: "控制台外框与侧边栏视觉布局变体",
    },
    {
      name: "defaultCollapsed",
      type: "boolean",
      defaultValue: "false",
      description: "初始是否折叠侧边栏",
    },
    {
      name: "compact",
      type: "boolean",
      defaultValue: "false",
      description: "紧凑密度模式",
    },
    {
      name: "primaryActionLabel",
      type: "string",
      defaultValue: '"新建发布"',
      description: "顶栏右侧主按钮文案",
    },
    {
      name: "kpis",
      type: "DashboardKpiItem[]",
      defaultValue: "内置三项指标",
      description: "顶部 KPI 卡片配置列表",
    },
    {
      name: "onPrimaryAction",
      type: "() => void",
      defaultValue: "—",
      description: "点击主操作按钮回调",
    },
    {
      name: "onNavChange",
      type: "(navId: string) => void",
      defaultValue: "—",
      description: "切换侧边导航分组回调",
    },
  ],
  accessibility: [
    '折叠按钮具备动态无障碍名称（折叠侧边栏 / 展开侧边栏），当前激活导航项标注 aria-current="page"。',
    "状态筛选胶囊使用 aria-pressed 表达当前筛选态，内部表格与命令面板完整继承键盘操作语义。",
  ],
};
