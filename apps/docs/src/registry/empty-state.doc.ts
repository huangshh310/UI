import EmptyStateBasicDemo from "@/demos/empty-state/basic";
import EmptyStateProjectDemo from "@/demos/empty-state/project";
import EmptyStateVariantsDemo from "@/demos/empty-state/variants";
import type { ComponentDoc } from "./registry.types";

export const EMPTY_STATE_DOC: ComponentDoc = {
  slug: "empty-state",
  name: "Empty State",
  description:
    "统一的空列表与无结果占位组件，支持 default / card / dashed / compact 四种形态、层叠图标徽章与自定义插画槽。",
  category: "display",
  registryName: "empty-state",
  dependencies: ["class-variance-authority", "lucide-react"],
  usage: `import { EmptyState } from "@/components/ui/empty-state";

<EmptyState variant="card" title="暂无数据" description="请新建一条记录。" />`,
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
    {
      slug: "variants",
      name: "四种视觉形态对比",
      description: "展示 default、card、dashed 与 compact 形态，适配页面级与表格内嵌空态场景。",
      file: "empty-state/variants.tsx",
      Demo: EmptyStateVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"default" | "card" | "dashed" | "compact"',
      defaultValue: '"default"',
      description: "空态容器视觉形态",
    },
    { name: "title", type: "string", defaultValue: "必填", description: "空态主文案" },
    { name: "description", type: "string", defaultValue: "—", description: "补充说明" },
    { name: "icon", type: "ReactNode", defaultValue: "—", description: "顶部图标槽" },
    {
      name: "illustration",
      type: "ReactNode",
      defaultValue: "—",
      description: "自定义插画槽（传入时替代默认图标徽章）",
    },
    { name: "action", type: "ReactNode", defaultValue: "—", description: "主操作按钮" },
    { name: "secondaryAction", type: "ReactNode", defaultValue: "—", description: "次操作按钮" },
    { name: "compact", type: "boolean", defaultValue: "false", description: "紧凑内边距模式" },
  ],
  accessibility: ["装饰图标与插画容器均带有 aria-hidden，保持清晰简洁的键盘 Tab 焦点路径。"],
};
