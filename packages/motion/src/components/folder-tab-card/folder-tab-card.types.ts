import type { ReactNode } from "react";

/** 文件夹卡片外框与材质变体 */
export type FolderTabCardVariant = "default" | "elevated" | "tinted";

export interface FolderTabItem {
  /** 标签唯一标识 */
  id: string;
  /** 标签标题 */
  label: string;
  /** 底部突出展示的等宽统计指标 */
  metric?: string;
  /** 统计指标辅助说明 */
  caption?: string;
  /** 可选标签前置图标 */
  icon?: ReactNode;
  /** 可选标签右侧徽标文本（如 NEW、46） */
  badge?: string;
  /** 标签对应的主体内容 */
  content: ReactNode;
}

export interface FolderTabCardProps {
  /** 文件夹标签页数组 */
  tabs: FolderTabItem[];
  /** 非受控初始激活项 id */
  defaultTabId?: string;
  /** 受控当前激活项 id */
  activeTabId?: string;
  /** 标签切换回调 */
  onTabChange?: (tabId: string) => void;
  /** 材质与层级风格：默认 / 抬升 / 钴蓝微染 */
  variant?: FolderTabCardVariant;
  /** 自定义类名 */
  className?: string;
}
