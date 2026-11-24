import OriginDropdownAccountDemo from "@/demos/origin-dropdown/account";
import OriginDropdownBasicDemo from "@/demos/origin-dropdown/basic";
import OriginDropdownCompactDemo from "@/demos/origin-dropdown/compact";
import type { ComponentDoc } from "./registry.types";

export const ORIGIN_DROPDOWN_DOC: ComponentDoc = {
  slug: "origin-dropdown",
  name: "Origin Dropdown",
  description:
    "从触发器锚点缩放展开的磨砂下拉菜单，支持丝滑胶囊悬停态、副标题、快捷键键帽、勾选项与信号/危险色调。",
  category: "overlays",
  registryName: "origin-dropdown",
  dependencies: ["@base-ui/react", "class-variance-authority", "lucide-react"],
  usage: `import { OriginDropdown } from "@/components/ui/origin-dropdown";

<OriginDropdown label="菜单" size="md" items={[{ kind: "action", id: "edit", label: "编辑", shortcut: "⌘E" }]} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "分组与勾选项",
      description: "锚点 transform-origin 展开，内置快捷键键帽、checkbox 项与危险操作色调。",
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
    {
      slug: "compact",
      name: "紧凑密度与信号色调",
      description: '展示 size="sm" 紧凑密度、subtle 触发风格、信号蓝强调项与条目徽章。',
      file: "origin-dropdown/compact.tsx",
      Demo: OriginDropdownCompactDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "items",
      type: "OriginDropdownEntry[]",
      defaultValue: "必填",
      description:
        "声明式菜单条目数组（支持 action / checkbox / separator / group，动作项支持 badge 与 tone）",
    },
    {
      name: "label / triggerVariant",
      type: 'string / "default" | "subtle" | "ghost"',
      defaultValue: '"操作菜单" / "default"',
      description: "默认触发按钮文案与视觉风格",
    },
    {
      name: "size",
      type: '"sm" | "md"',
      defaultValue: '"md"',
      description: "菜单项与触发按钮密度尺寸",
    },
    {
      name: "open / defaultOpen / onOpenChange",
      type: "boolean / (open: boolean) => void",
      defaultValue: "—",
      description: "受控或非受控开关状态",
    },
    {
      name: "side / align / sideOffset",
      type: '"top" | "bottom" | "left" | "right" / "start" | "center" | "end" / number',
      defaultValue: '"bottom" / "start" / 6',
      description: "展开方向、对齐方式与触发器间距",
    },
  ],
  accessibility: ["完整支持上下方向键移动、Enter/Space 激活与 Escape 退出并恢复触发器焦点。"],
};
