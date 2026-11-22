import type { ReactNode } from "react";

export interface TreeNode {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  disabled?: boolean;
  children?: TreeNode[];
}

export interface TreeProps {
  /** 树形层级数据 */
  nodes: TreeNode[];
  /** 受控选中节点 id */
  value?: string | null;
  /** 初始选中节点 id */
  defaultValue?: string | null;
  /** 选中节点变化回调 */
  onValueChange?: (value: string | null) => void;
  /** 默认展开的分支 id 列表 */
  defaultExpanded?: string[];
  /** 树控件无障碍名称 */
  ariaLabel?: string;
  /** 自定义容器类名 */
  className?: string;
}
