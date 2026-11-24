import TreeBasicDemo from "@/demos/tree/basic";
import TreeCompactDemo from "@/demos/tree/compact";
import TreePermissionsDemo from "@/demos/tree/permissions";
import type { ComponentDoc } from "./registry.types";

export const TREE_DOC: ComponentDoc = {
  slug: "tree",
  name: "Tree",
  description:
    "层级树形视图，支持 card / ghost 容器、compact / comfortable 密度、可切换缩进参考线与完整 WAI-ARIA 键盘导航。",
  category: "navigation",
  registryName: "tree",
  dependencies: ["@ui-sdk/react@0.1.0-beta.13", "class-variance-authority", "lucide-react"],
  usage: `import { Tree } from "@/components/ui/tree";

<Tree variant="ghost" density="compact" nodes={nodes} defaultExpanded={["packages"]} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "工作区文件树",
      description: "遵循 ADR-001，支持左右箭头展开折叠、上下箭头移动与单 Tab 停靠点。",
      file: "tree/basic.tsx",
      Demo: TreeBasicDemo,
    },
    {
      slug: "compact",
      name: "侧栏无框紧凑文件树",
      description: '使用 variant="ghost" 与 density="compact" 嵌入侧栏表面，搭配自定义节点图标。',
      file: "tree/compact.tsx",
      Demo: TreeCompactDemo,
      directory: false,
    },
    {
      slug: "permissions",
      name: "默认展开的权限策略树",
      description: "通过 defaultExpanded 预设展开分支，配合权限徽章展示层级策略。",
      file: "tree/permissions.tsx",
      Demo: TreePermissionsDemo,
      directory: false,
    },
  ],
  api: [
    { name: "nodes", type: "TreeNode[]", defaultValue: "必填", description: "递归树节点数组" },
    { name: "value", type: "string | null", defaultValue: "—", description: "受控选中节点 id" },
    {
      name: "variant / density",
      type: '"card" | "ghost" / "compact" | "comfortable"',
      defaultValue: '"card" / "comfortable"',
      description: "容器外观与行高密度",
    },
    {
      name: "showGuides",
      type: "boolean",
      defaultValue: "true",
      description: "是否显示层级缩进参考线",
    },
    {
      name: "defaultExpanded",
      type: "string[]",
      defaultValue: "—",
      description: "默认展开的分支 id",
    },
  ],
  accessibility: [
    '完整遵循 WAI-ARIA Tree View 规范：role="tree"/"treeitem"、单一 roving tabIndex 与全键盘导航。',
  ],
};
