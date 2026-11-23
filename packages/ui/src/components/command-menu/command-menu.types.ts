import type { ReactNode } from "react";

export type CommandMenuSize = "sm" | "md" | "lg";

export interface CommandMenuSubPage {
  heading: string;
  items: Omit<CommandMenuItem, "subPage">[];
}

export interface CommandMenuItem {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  badge?: string;
  shortcut?: string;
  icon?: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
  /** 点击后进入二级子命令页面栈 */
  subPage?: CommandMenuSubPage;
}

export interface CommandMenuGroup {
  heading: string;
  items: CommandMenuItem[];
}

export interface CommandMenuProps {
  /** 受控打开状态 */
  open?: boolean;
  /** 非受控初始打开状态 */
  defaultOpen?: boolean;
  /** 开关状态回调 */
  onOpenChange?: (open: boolean) => void;
  /** 默认触发按钮文案；传 null 时不渲染触发按钮 */
  triggerLabel?: string | null;
  /** 是否注册全局 ⌘K / Ctrl+K 快捷键（默认 false，避免多实例冲突） */
  enableGlobalShortcut?: boolean;
  /** 全局快捷键字母，默认 k */
  shortcutKey?: string;
  /** 搜索输入框占位符 */
  placeholder?: string;
  /** 弹窗无障碍标题 */
  title?: string;
  /** 分组命令列表 */
  groups: CommandMenuGroup[];
  /** 无匹配结果时的提示 */
  emptyText?: string;
  /** 弹窗最大宽度预设 */
  size?: CommandMenuSize;
  /** 是否在面板底部显示键盘操作提示栏 */
  showFooter?: boolean;
  /** 选中叶子命令后的回调 */
  onSelect?: (id: string) => void;
  /** 面板自定义类名 */
  className?: string;
}
