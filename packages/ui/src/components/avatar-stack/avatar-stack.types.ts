export type AvatarStackSize = "xs" | "sm" | "md" | "lg";
export type AvatarStackRing = "card" | "background" | "none";
export type AvatarStackSpacing = "tight" | "normal" | "loose";
export type AvatarStackStatus = "online" | "busy" | "away" | "offline";

export interface AvatarStackItem {
  id: string;
  name: string;
  role?: string;
  src?: string;
  initials?: string;
  status?: AvatarStackStatus;
}

export interface AvatarStackProps {
  /** 成员头像列表 */
  items: AvatarStackItem[];
  /** 最多展示几个头像，超出部分折叠为 +N */
  max?: number;
  /** 尺寸预设 */
  size?: AvatarStackSize;
  /** 描边圆环底色（匹配所在容器背景） */
  ring?: AvatarStackRing;
  /** 头像叠放紧密度 */
  spacing?: AvatarStackSpacing;
  /** 是否启用悬停浮起交互 */
  interactive?: boolean;
  /** 点击单个头像时的回调 */
  onItemClick?: (item: AvatarStackItem) => void;
  /** 点击 +N 溢出计数徽章时的回调 */
  onOverflowClick?: () => void;
  /** 提示浮层触发延迟（毫秒） */
  tooltipDelay?: number;
  /** 自定义容器类名 */
  className?: string;
}
