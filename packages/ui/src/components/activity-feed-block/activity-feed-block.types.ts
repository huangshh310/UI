export type ActivityCategory = "deploy" | "security" | "team";

export type ActivityFeedVariant = "timeline" | "list";

export interface ActivityEntry {
  id: string;
  actor: string;
  initials: string;
  title: string;
  detail: string;
  time: string;
  category: ActivityCategory;
  unread?: boolean;
}

export interface ActivityFeedBlockProps {
  /** 初始动态条目 */
  initialItems?: ActivityEntry[];
  /** 区块标题 */
  title?: string;
  /** 区块副标题 */
  description?: string;
  /** 列表展示变体：时间线或平铺列表 */
  variant?: ActivityFeedVariant;
  /** 是否使用紧凑密度 */
  compact?: boolean;
  /** 标记单条已读回调 */
  onMarkRead?: (id: string) => void;
  /** 全部标记已读回调 */
  onMarkAllRead?: () => void;
  /** 自定义类名 */
  className?: string;
}
