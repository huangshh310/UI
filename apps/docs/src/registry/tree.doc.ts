import TreeBasicDemo from "@/demos/tree/basic";
import TreePermissionsDemo from "@/demos/tree/permissions";
import type { ComponentDoc } from "./registry.types";

export const TREE_DOC: ComponentDoc = {
  slug: "tree",
  name: "Tree",
  description: "基于精确锁版本 UI SDK 的层级树形视图，带缩进参考线与 WAI-ARIA 键盘导航。",
  category: "navigation",
  registryName: "tree",
  dependencies: ["@ui-sdk/react@0.1.0-beta.13", "lucide-react"],
  usage: `import { Tree } from "@/components/ui/tree";

<Tree nodes={nodes} defaultExpanded={["packages"]} />`,
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
      slug: "permissions",
      name: "默认展开的权限策略树",
      description: "通过 defaultExpandedIds 预设展开分支，配合权限徽章展示层级策略。",
      file: "tree/permissions.tsx",
      Demo: TreePermissionsDemo,
      directory: false,
    },
  ],
  api: [
    { name: "nodes", type: "TreeNode[]", defaultValue: "必填", description: "递归树节点数组" },
    { name: "value", type: "string | null", defaultValue: "—", description: "受控选中节点 id" },
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
