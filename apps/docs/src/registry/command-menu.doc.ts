import CommandMenuBasicDemo from "@/demos/command-menu/basic";
import CommandMenuActionsDemo from "@/demos/command-menu/actions";
import type { ComponentDoc } from "./registry.types";

export const COMMAND_MENU_DOC: ComponentDoc = {
  slug: "command-menu",
  name: "Command Menu",
  description: "基于 UI SDK 的全局命令面板，支持模糊匹配高亮、分组命令与多级子页面栈。",
  category: "overlays",
  registryName: "command-menu",
  dependencies: ["@ui-sdk/react@0.1.0-beta.13", "lucide-react"],
  usage: `import { CommandMenu } from "@/components/ui/command-menu";

<CommandMenu groups={groups} onSelect={(id) => console.log(id)} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "分组检索与子页面栈",
      description: "支持关键词高亮匹配、快捷键提示，以及点击「切换主题配色」钻入二级菜单。",
      file: "command-menu/basic.tsx",
      Demo: CommandMenuBasicDemo,
    },
    {
      slug: "actions",
      name: "工程指令与快捷分组",
      description: "按构建分发与质量门禁分组展示带快捷键提示的可检索命令。",
      file: "command-menu/actions.tsx",
      Demo: CommandMenuActionsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "groups",
      type: "CommandMenuGroup[]",
      defaultValue: "必填",
      description: "分组命令列表，项可带 subPage",
    },
    {
      name: "enableGlobalShortcut",
      type: "boolean",
      defaultValue: "false",
      description: "是否监听全局 ⌘K / Ctrl+K",
    },
    {
      name: "onSelect",
      type: "(id: string) => void",
      defaultValue: "—",
      description: "选中命令项回调",
    },
    {
      name: "emptyText",
      type: "string",
      defaultValue: '"没有匹配的命令"',
      description: "无匹配结果文案",
    },
  ],
  accessibility: [
    "遵循 ADR-001，由精确锁版本的 @ui-sdk/react 单底座驱动，提供原生顶层对话框与标准 listbox 键盘导航。",
  ],
};
