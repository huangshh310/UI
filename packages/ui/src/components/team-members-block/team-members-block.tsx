"use client";

/**
 * TeamMembersBlock：由 Card、AvatarStack、SpringSelect、SettleModal、Badge 与 EmptyState 组合的团队成员权限管理区块。
 */
import { cn } from "@matt-ui/utils";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { AvatarStack } from "../avatar-stack/index.js";
import { Badge } from "../badge/index.js";
import { Button } from "../button/index.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card/index.js";
import { InviteDialog, MemberListSection, Toolbar } from "./team-members-parts.js";
import type { TeamMember, TeamMembersBlockProps, TeamRole } from "./team-members-block.types.js";

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
