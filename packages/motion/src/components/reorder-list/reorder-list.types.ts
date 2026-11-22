export interface ReorderListItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export interface ReorderListProps {
  /** 待排序条目（顺序按 value 决定，未传 value 时使用本数组顺序） */
  items: ReorderListItem[];
  /** 受控条目 id 顺序 */
  value?: string[];
  /** 顺序提交回调 */
  onValueChange?: (nextIds: string[]) => void;
  /** 列表无障碍名称 */
  ariaLabel?: string;
  /** 自定义类名 */
  className?: string;
}
