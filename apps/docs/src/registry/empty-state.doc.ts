import EmptyStateBasicDemo from "@/demos/empty-state/basic";
import EmptyStateProjectDemo from "@/demos/empty-state/project";
import type { ComponentDoc } from "./registry.types";

export const EMPTY_STATE_DOC: ComponentDoc = {
  slug: "empty-state",
  name: "Empty State",
  description: "统一的空列表与无搜索结果占位卡片，提供图标徽章、说明与主次操作槽。",
  category: "display",
  registryName: "empty-state",
  dependencies: ["lucide-react"],
  usage: `import { EmptyState } from "@/components/ui/empty-state";

<EmptyState title="暂无数据" description="请新建一条记录。" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "空态引导卡片",
      description: "虚线轻边框搭配居中图标徽章与主次 CTA 按钮。",
      file: "empty-state/basic.tsx",
      Demo: EmptyStateBasicDemo,
    },
    {
      slug: "project",
      name: "首次初始化引导空态",
      description: "提供自定义图标框与主/次双操作按钮，引导用户完成首个项目创建。",
      file: "empty-state/project.tsx",
      Demo: EmptyStateProjectDemo,
      directory: false,
    },
  ],
  api: [
    { name: "title", type: "string", defaultValue: "必填", description: "空态主文案" },
    { name: "description", type: "string", defaultValue: "—", description: "补充说明" },
    { name: "action", type: "ReactNode", defaultValue: "—", description: "主操作按钮" },
    { name: "compact", type: "boolean", defaultValue: "false", description: "紧凑内边距模式" },
  ],
  accessibility: ["装饰图标容器带有 aria-hidden，保持清晰简洁的键盘 Tab 焦点路径。"],
};
