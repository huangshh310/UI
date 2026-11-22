export type TeamRole = "管理员" | "开发" | "设计";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  initials: string;
  status?: "online" | "busy" | "offline";
}

export interface TeamMembersBlockProps {
  /** 初始成员列表 */
  initialMembers?: TeamMember[];
  /** 邀请新成员提交回调 */
  onInvite?: (payload: { name: string; email: string; role: TeamRole }) => void;
  /** 自定义容器类名 */
  className?: string;
}
