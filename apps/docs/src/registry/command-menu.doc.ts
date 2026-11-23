import CommandMenuActionsDemo from "@/demos/command-menu/actions";
import CommandMenuBasicDemo from "@/demos/command-menu/basic";
import CommandMenuWorkspaceDemo from "@/demos/command-menu/workspace";
import type { ComponentDoc } from "./registry.types";

export const COMMAND_MENU_DOC: ComponentDoc = {
  slug: "command-menu",
  name: "Command Menu",
  description:
    "基于 UI SDK 的磨砂全局命令面板，支持模糊匹配高亮、分组命令、多键帽快捷键、底部键盘提示与多级子页面栈。",
  category: "overlays",
  registryName: "command-menu",
  dependencies: ["@ui-sdk/react@0.1.0-beta.13", "class-variance-authority", "lucide-react"],
  usage: `import { CommandMenu } from "@/components/ui/command-menu";

<CommandMenu groups={groups} size="md" onSelect={(id) => console.log(id)} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "分组检索与子页面栈",
      description: "支持关键词高亮匹配、多键帽快捷键，以及点击「切换主题配色」钻入二级菜单。",
      file: "command-menu/basic.tsx",
      Demo: CommandMenuBasicDemo,
    },
    {
      slug: "actions",
      name: "工程指令与快捷分组",
      description: "按构建分发与质量门禁分组展示带图标、说明与快捷键键帽的可检索命令。",
      file: "command-menu/actions.tsx",
      Demo: CommandMenuActionsDemo,
      directory: false,
    },
    {
      slug: "workspace",
      name: "宽幅工作区命令面板",
      description: '采用 size="lg" 规格展示带副标题、徽章与成员指派子页面的 Linear 风格命令流。',
      file: "command-menu/workspace.tsx",
      Demo: CommandMenuWorkspaceDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "groups",
      type: "CommandMenuGroup[]",
      defaultValue: "必填",
      description: "分组命令列表，条目支持 description、badge、shortcut（自动拆分键帽）与 subPage",
    },
    {
      name: "size / showFooter",
      type: '"sm" | "md" | "lg" / boolean',
      defaultValue: '"md" / true',
      description: "面板最大宽度预设与底部键盘导航提示栏开关",
    },
    {
      name: "enableGlobalShortcut / shortcutKey",
      type: "boolean / string",
      defaultValue: 'false / "k"',
      description: "是否监听全局 ⌘K / Ctrl+K 快捷键与自定义触发键",
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
