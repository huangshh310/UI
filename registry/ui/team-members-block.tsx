// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * TeamMembersBlock：由 Card、AvatarStack、SpringSelect、SettleModal、Badge 与 EmptyState 组合的团队成员权限管理区块。
 */

import { AvatarStack } from "@/components/ui/avatar-stack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SettleModal } from "@/components/ui/settle-modal";
import { SpringSelect } from "@/components/ui/spring-select";
import { cn } from "@/lib/utils";
import { Search, Trash2, UserPlus } from "lucide-react";
import { type FormEvent, useId, useState } from "react";

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
const TextField = ({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (next: string) => void;
}) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-9.5 rounded-xl border border-solid border-border/80 bg-background px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-ring focus:ring-1 focus:ring-ring focus:ring-inset dark:border-white/12 dark:bg-card"
      />
    </div>
  );
};

const InviteActions = ({ onCancel }: { onCancel: () => void }) => (
  <div className="flex justify-end gap-2 pt-2">
    <Button type="button" variant="outline" size="sm" onClick={onCancel}>
      取消
    </Button>
    <Button type="submit" variant="signal" size="sm">
      发送邀请
    </Button>
  </div>
);

const InviteDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onSubmit: (payload: { name: string; email: string; role: TeamRole }) => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("开发");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSubmit({ name: name.trim(), email: email.trim(), role });
    setName("");
    setEmail("");
    setRole("开发");
    onOpenChange(false);
  };

  return (
    <SettleModal
      open={open}
      onOpenChange={onOpenChange}
      title="邀请新成员"
      description="邀请后将通过邮件发送工作区加入链接。"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <TextField label="成员姓名" value={name} placeholder="例如：沈清" onChange={setName} />
        <TextField
          label="成员邮箱"
          type="email"
          value={email}
          placeholder="member@company.com"
          onChange={setEmail}
        />
        <SpringSelect
          label="默认角色"
          options={TEAM_ROLE_OPTIONS}
          value={role}
          onValueChange={(n) => n && setRole(n as TeamRole)}
        />
        <InviteActions onCancel={() => onOpenChange(false)} />
      </form>
    </SettleModal>
  );
};

const MemberIdentity = ({
  member,
  status,
  compact,
}: {
  member: TeamMember;
  status: TeamMemberStatus;
  compact: boolean;
}) => (
  <div className="flex min-w-0 items-center gap-3">
    <span className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-solid border-border/80 bg-secondary font-sans text-xs font-semibold text-foreground dark:border-white/12">
      {member.initials}
      <span
        aria-hidden="true"
        title={TEAM_STATUS_LABEL[status]}
        className={cn(
          "absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-card",
          TEAM_STATUS_DOT_CLASS[status],
        )}
      />
    </span>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <p className="m-0 truncate text-sm font-medium text-foreground">{member.name}</p>
        <Badge variant={TEAM_ROLE_BADGE_VARIANT[member.role]} size="sm">
          {member.role}
        </Badge>
        {!compact && (
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            {TEAM_STATUS_LABEL[status]}
          </span>
        )}
      </div>
      <p className="m-0 truncate font-mono text-xs text-muted-foreground">{member.email}</p>
    </div>
  </div>
);

const MemberRow = ({
  member,
  compact,
  onRoleChange,
  onRemove,
}: {
  member: TeamMember;
  compact: boolean;
  onRoleChange: (role: TeamRole) => void;
  onRemove: () => void;
}) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-between gap-3 border-b border-solid border-border/75 transition-colors last:border-b-0 hover:bg-secondary/35 dark:border-white/10 dark:hover:bg-secondary/25",
      compact ? "px-3.5 py-2.5" : "px-4 py-3.5",
    )}
  >
    <MemberIdentity member={member} status={member.status ?? "offline"} compact={compact} />
    <div className="flex items-center gap-2">
      <div className="w-30">
        <SpringSelect
          aria-label={`切换 ${member.name} 的角色`}
          options={TEAM_ROLE_OPTIONS}
          value={member.role}
          onValueChange={(n) => n && onRoleChange(n as TeamRole)}
        />
      </div>
      <Button size="icon" variant="ghost" aria-label={`移除 ${member.name}`} onClick={onRemove}>
        <Trash2 className="size-4 text-muted-foreground" />
      </Button>
    </div>
  </div>
);

const RoleFilterRail = ({
  roleFilter,
  roleCounts,
  onRoleFilterChange,
}: {
  roleFilter: "全部" | TeamRole;
  roleCounts: Record<"全部" | TeamRole, number>;
  onRoleFilterChange: (next: "全部" | TeamRole) => void;
}) => (
  <div className="flex flex-wrap items-center gap-1 rounded-xl border border-solid border-border/80 bg-secondary/55 p-1 dark:border-white/10 dark:bg-secondary/35">
    {TEAM_FILTER_ROLES.map((role) => (
      <button
        key={role}
        type="button"
        aria-pressed={roleFilter === role}
        onClick={() => onRoleFilterChange(role)}
        className={cn(
          "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg border-0 px-2.5 font-sans text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
          roleFilter === role
            ? "bg-card text-foreground shadow-xs ring-1 ring-border/70 dark:ring-white/12"
            : "bg-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        <span>{role}</span>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {roleCounts[role]}
        </span>
      </button>
    ))}
  </div>
);

const Toolbar = ({
  query,
  roleFilter,
  roleCounts,
  onQueryChange,
  onRoleFilterChange,
}: {
  query: string;
  roleFilter: "全部" | TeamRole;
  roleCounts: Record<"全部" | TeamRole, number>;
  onQueryChange: (next: string) => void;
  onRoleFilterChange: (next: "全部" | TeamRole) => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <label className="flex h-9.5 w-full items-center gap-2 rounded-xl border border-solid border-border/80 bg-background px-3 text-sm transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset sm:w-64 dark:border-white/10 dark:bg-card">
      <Search aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
      <input
        type="search"
        aria-label="搜索团队成员"
        placeholder="按姓名或邮箱筛选…"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        className="w-full border-0 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
      />
    </label>
    <RoleFilterRail
      roleFilter={roleFilter}
      roleCounts={roleCounts}
      onRoleFilterChange={onRoleFilterChange}
    />
  </div>
);

const MemberListSection = ({
  members,
  compact,
  onReset,
  onRoleChange,
  onRemove,
}: {
  members: TeamMember[];
  compact: boolean;
  onReset: () => void;
  onRoleChange: (id: string, role: TeamRole) => void;
  onRemove: (id: string) => void;
}) => {
  if (members.length === 0) {
    return (
      <EmptyState
        title="没有匹配的团队成员"
        description="尝试清空搜索条件，或直接邀请新成员加入工作区。"
        action={
          <Button size="sm" variant="outline" onClick={onReset}>
            重置筛选
          </Button>
        }
      />
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-solid border-border/80 bg-card/60 dark:border-white/10">
      {members.map((member) => (
        <MemberRow
          key={member.id}
          member={member}
          compact={compact}
          onRoleChange={(role) => onRoleChange(member.id, role)}
          onRemove={() => onRemove(member.id)}
        />
      ))}
    </div>
  );
};
const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "m1",
    name: "林知远",
    email: "lin@matt.dev",
    role: "管理员",
    initials: "林",
    status: "online",
  },
  {
    id: "m2",
    name: "周宁",
    email: "zhou@matt.dev",
    role: "开发",
    initials: "周",
    status: "online",
  },
  { id: "m3", name: "陈屿", email: "chen@matt.dev", role: "设计", initials: "陈", status: "busy" },
  { id: "m4", name: "许澄", email: "xu@matt.dev", role: "开发", initials: "许", status: "offline" },
];

const filterMembers = (members: TeamMember[], query: string, roleFilter: "全部" | TeamRole) => {
  const keyword = query.trim().toLowerCase();
  return members.filter(
    (m) =>
      (roleFilter === "全部" || m.role === roleFilter) &&
      (!keyword ||
        m.name.toLowerCase().includes(keyword) ||
        m.email.toLowerCase().includes(keyword)),
  );
};

const countRoles = (members: TeamMember[]): Record<"全部" | TeamRole, number> => ({
  全部: members.length,
  管理员: members.filter((m) => m.role === "管理员").length,
  开发: members.filter((m) => m.role === "开发").length,
  设计: members.filter((m) => m.role === "设计").length,
});

const TeamHeader = ({
  title,
  description,
  members,
  maxSeats,
  onInviteClick,
}: {
  title: string;
  description: string;
  members: TeamMember[];
  maxSeats?: number;
  onInviteClick: () => void;
}) => (
  <CardHeader className="flex flex-col gap-4 border-b border-solid border-border/75 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <CardTitle>{title}</CardTitle>
        <Badge variant="secondary" size="sm" className="font-mono tabular-nums">
          {maxSeats ? `${members.length} / ${maxSeats} 席` : `${members.length} 人`}
        </Badge>
      </div>
      <CardDescription className="mt-1">{description}</CardDescription>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <AvatarStack items={members} max={4} size="sm" />
      <Button size="sm" variant="primary" radius="pill" onClick={onInviteClick}>
        <UserPlus className="size-3.5" />
        <span>邀请成员</span>
      </Button>
    </div>
  </CardHeader>
);

const useTeamState = (props: TeamMembersBlockProps) => {
  const [members, setMembers] = useState(props.initialMembers ?? DEFAULT_MEMBERS);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"全部" | TeamRole>("全部");
  const [inviteOpen, setInviteOpen] = useState(false);

  const handleInvite = (payload: { name: string; email: string; role: TeamRole }) => {
    const next: TeamMember = {
      id: `m-${Date.now()}`,
      ...payload,
      initials: payload.name.slice(0, 1),
      status: "online",
    };
    setMembers((prev) => [next, ...prev]);
    props.onInvite?.(payload);
  };
  const handleRoleChange = (id: string, role: TeamRole) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    props.onRoleChange?.(id, role);
  };
  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    props.onRemove?.(id);
  };
  return {
    members,
    visible: filterMembers(members, query, roleFilter),
    query,
    setQuery,
    roleFilter,
    setRoleFilter,
    inviteOpen,
    setInviteOpen,
    handleInvite,
    handleRoleChange,
    handleRemove,
  };
};

export const TeamMembersBlock = (props: TeamMembersBlockProps) => {
  const state = useTeamState(props);
  return (
    <Card
      variant={props.variant ?? "default"}
      data-slot="team-members-block"
      className={cn("w-full border-border/80 dark:border-white/10", props.className)}
    >
      <TeamHeader
        title={props.title ?? "团队成员与权限"}
        description={props.description ?? "管理工作区协作成员、角色策略与发布权限。"}
        members={state.members}
        maxSeats={props.maxSeats}
        onInviteClick={() => state.setInviteOpen(true)}
      />
      <CardContent className="flex flex-col gap-4 pt-5 pb-6">
        <Toolbar
          query={state.query}
          roleFilter={state.roleFilter}
          roleCounts={countRoles(state.members)}
          onQueryChange={state.setQuery}
          onRoleFilterChange={state.setRoleFilter}
        />
        <MemberListSection
          members={state.visible}
          compact={props.compact ?? false}
          onReset={() => (state.setQuery(""), state.setRoleFilter("全部"))}
          onRoleChange={state.handleRoleChange}
          onRemove={state.handleRemove}
        />
      </CardContent>
      <InviteDialog
        open={state.inviteOpen}
        onOpenChange={state.setInviteOpen}
        onSubmit={state.handleInvite}
      />
    </Card>
  );
};
