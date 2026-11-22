export type AvatarStackSize = "sm" | "md" | "lg";

export interface AvatarStackItem {
  id: string;
  name: string;
  role?: string;
  src?: string;
  initials?: string;
  status?: "online" | "busy" | "offline";
}

export interface AvatarStackProps {
  /** 成员头像列表 */
  items: AvatarStackItem[];
  /** 最多展示几个头像，超出部分折叠为 +N */
  max?: number;
  /** 尺寸预设 */
  size?: AvatarStackSize;
  /** 提示浮层触发延迟（毫秒） */
  tooltipDelay?: number;
  /** 自定义容器类名 */
  className?: string;
}
