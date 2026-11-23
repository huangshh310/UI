"use client";

/**
 * TeamMembersBlock：由 Card、AvatarStack、SpringSelect、SettleModal、Badge 与 EmptyState 组合的团队成员权限管理区块。
 */
import { cn } from "@matt-ui/utils";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { AvatarStack } from "../avatar-stack/index.js";
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

const TeamHeader = ({
  members,
  onInviteClick,
}: {
  members: TeamMember[];
  onInviteClick: () => void;
}) => (
  <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <CardTitle>团队成员与权限</CardTitle>
      <CardDescription>管理工作区协作成员、角色策略与发布权限。</CardDescription>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <AvatarStack items={members} max={4} size="sm" />
      <Button size="sm" variant="primary" className="rounded-full" onClick={onInviteClick}>
        <UserPlus className="size-3.5" />
        <span>邀请成员</span>
      </Button>
    </div>
  </CardHeader>
);

export const TeamMembersBlock = ({
  initialMembers = DEFAULT_MEMBERS,
  onInvite,
  className,
}: TeamMembersBlockProps) => {
  const [members, setMembers] = useState(initialMembers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"全部" | TeamRole>("全部");
  const [inviteOpen, setInviteOpen] = useState(false);

  const visible = filterMembers(members, query, roleFilter);
  const handleInvite = (payload: { name: string; email: string; role: TeamRole }) => {
    const next: TeamMember = {
      id: `m-${Date.now()}`,
      ...payload,
      initials: payload.name.slice(0, 1),
      status: "online",
    };
    setMembers((prev) => [next, ...prev]);
    onInvite?.(payload);
  };

  return (
    <Card data-slot="team-members-block" className={cn("w-full", className)}>
      <TeamHeader members={members} onInviteClick={() => setInviteOpen(true)} />
      <CardContent className="flex flex-col gap-4">
        <Toolbar
          query={query}
          roleFilter={roleFilter}
          onQueryChange={setQuery}
          onRoleFilterChange={setRoleFilter}
        />
        <MemberListSection
          members={visible}
          onReset={() => (setQuery(""), setRoleFilter("全部"))}
          onRoleChange={(id, role) =>
            setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)))
          }
          onRemove={(id) => setMembers((prev) => prev.filter((m) => m.id !== id))}
        />
      </CardContent>
      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} onSubmit={handleInvite} />
    </Card>
  );
};
