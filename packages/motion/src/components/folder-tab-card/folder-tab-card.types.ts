import type { ReactNode } from "react";

export interface FolderTabItem {
  id: string;
  label: string;
  metric: string;
  caption?: string;
  content: ReactNode;
}

export interface FolderTabCardProps {
  /** 文件夹标签页数组 */
  tabs: FolderTabItem[];
  /** 初始激活项 id */
  defaultTabId?: string;
  /** 自定义类名 */
  className?: string;
}
