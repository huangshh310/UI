export type ActivityCategory = "deploy" | "security" | "team";

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
  /** 自定义类名 */
  className?: string;
}
