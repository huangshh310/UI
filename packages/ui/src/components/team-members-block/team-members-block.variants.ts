import type { TeamMemberStatus, TeamRole } from "./team-members-block.types.js";

export const TEAM_ROLE_OPTIONS: { value: TeamRole; label: string }[] = [
  { value: "管理员", label: "管理员" },
  { value: "开发", label: "开发" },
  { value: "设计", label: "设计" },
];

export const TEAM_FILTER_ROLES: ("全部" | TeamRole)[] = ["全部", "管理员", "开发", "设计"];

export const TEAM_ROLE_BADGE_VARIANT: Record<TeamRole, "soft" | "secondary" | "outline"> = {
  管理员: "soft",
  开发: "secondary",
  设计: "outline",
};

export const TEAM_STATUS_DOT_CLASS: Record<TeamMemberStatus, string> = {
  online: "bg-emerald-500",
  busy: "bg-amber-500",
  offline: "bg-muted-foreground/45",
};

export const TEAM_STATUS_LABEL: Record<TeamMemberStatus, string> = {
  online: "在线",
  busy: "专注中",
  offline: "离线",
};
