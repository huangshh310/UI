export type TeamRole = "管理员" | "开发" | "设计";

export type TeamMemberStatus = "online" | "busy" | "offline";

export type TeamMembersVariant = "default" | "elevated" | "subtle";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  initials: string;
  status?: TeamMemberStatus;
}

export interface TeamMembersBlockProps {
  /** 初始成员列表 */
  initialMembers?: TeamMember[];
  /** 区块标题 */
  title?: string;
  /** 区块副标题 */
  description?: string;
  /** 卡片视觉变体 */
  variant?: TeamMembersVariant;
  /** 是否使用紧凑行高 */
  compact?: boolean;
  /** 可选最大席位数，传入后在头部展示席位占比 */
  maxSeats?: number;
  /** 邀请新成员提交回调 */
  onInvite?: (payload: { name: string; email: string; role: TeamRole }) => void;
  /** 成员角色变更回调 */
  onRoleChange?: (id: string, role: TeamRole) => void;
  /** 移除成员回调 */
  onRemove?: (id: string) => void;
  /** 自定义容器类名 */
  className?: string;
}
