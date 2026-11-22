import OriginDropdownBasicDemo from "@/demos/origin-dropdown/basic";
import OriginDropdownAccountDemo from "@/demos/origin-dropdown/account";
import type { ComponentDoc } from "./registry.types";

export const ORIGIN_DROPDOWN_DOC: ComponentDoc = {
  slug: "origin-dropdown",
  name: "Origin Dropdown",
  description: "从触发器锚点缩放展开的下拉菜单，支持副标题、快捷键、勾选项与危险操作。",
  category: "overlays",
  registryName: "origin-dropdown",
  dependencies: ["@base-ui/react", "lucide-react"],
  usage: `import { OriginDropdown } from "@/components/ui/origin-dropdown";

<OriginDropdown label="菜单" items={[{ kind: "action", id: "edit", label: "编辑" }]} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "分组与勾选项",
      description: "锚点 transform-origin 展开，内置快捷键标签、checkbox 项与危险操作色调。",
      file: "origin-dropdown/basic.tsx",
      Demo: OriginDropdownBasicDemo,
    },
    {
      slug: "account",
      name: "账户菜单与复选开关",
      description: "组合分组标题、快捷键提示、勾选状态项与危险退出项的完整菜单。",
      file: "origin-dropdown/account.tsx",
      Demo: OriginDropdownAccountDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "items",
      type: "OriginDropdownEntry[]",
      defaultValue: "必填",
      description: "声明式菜单条目数组",
    },
    { name: "label", type: "string", defaultValue: '"操作菜单"', description: "默认触发按钮文案" },
    {
      name: "side",
      type: '"top" | "bottom" | "left" | "right"',
      defaultValue: '"bottom"',
      description: "菜单展开方向",
    },
    {
      name: "align",
      type: '"start" | "center" | "end"',
      defaultValue: '"start"',
      description: "对齐方式",
    },
  ],
  accessibility: ["基于 Base UI Menu，支持方向键移动、Enter/Space 激活与 Escape 退出并恢复焦点。"],
};
