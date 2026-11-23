import type { ReactNode } from "react";

export type SpotlightSearchSize = "md" | "lg";

export interface SpotlightSearchItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  shortcut?: string;
  /** 可选条目前置图标 */
  icon?: ReactNode;
  /** 预览分栏底部的补充元信息 */
  meta?: string;
  /** 右侧预览分栏展示的摘要 */
  preview?: string;
}

export interface SpotlightSearchProps {
  /** 受控打开状态 */
  open?: boolean;
  /** 初始打开状态 */
  defaultOpen?: boolean;
  /** 状态回调 */
  onOpenChange?: (open: boolean) => void;
  /** 触发按钮文案；传 null 时隐藏触发按钮 */
  triggerLabel?: string | null;
  /** 触发按钮右侧展示的快捷键键帽提示 */
  shortcutHint?: string;
  /** 是否注册全局快捷键打开（默认 false，避免多实例冲突） */
  enableGlobalShortcut?: boolean;
  /** 全局快捷键字母，默认 k */
  shortcutKey?: string;
  /** 搜索占位提示 */
  placeholder?: string;
  /** 弹窗宽度预设 */
  size?: SpotlightSearchSize;
  /** 是否显示底部键盘导航与结果计数栏 */
  showFooter?: boolean;
  /** 候选结果列表 */
  items: SpotlightSearchItem[];
  /** 最近搜索关键词胶囊 */
  recentQueries?: string[];
  /** 选中回调 */
  onSelect?: (item: SpotlightSearchItem) => void;
  /** 面板自定义类名 */
  className?: string;
}
