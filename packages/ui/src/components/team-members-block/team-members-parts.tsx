"use client";

import { cn } from "@matt-ui/utils";
import { Search, Trash2 } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Badge } from "../badge/index.js";
import { Button } from "../button/index.js";
import { EmptyState } from "../empty-state/index.js";
import { SettleModal } from "../settle-modal/index.js";
import { SpringSelect } from "../spring-select/index.js";
import type { TeamMember, TeamRole } from "./team-members-block.types.js";

export const ROLE_OPTIONS = [
  { value: "管理员", label: "管理员" },
  { value: "开发", label: "开发" },
  { value: "设计", label: "设计" },
];

const FILTER_ROLES: ("全部" | TeamRole)[] = ["全部", "管理员", "开发", "设计"];

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
        className="h-9 rounded-lg border border-solid border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20 dark:bg-card"
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

export const InviteDialog = ({
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
          options={ROLE_OPTIONS}
          value={role}
          onValueChange={(n) => n && setRole(n as TeamRole)}
        />
        <InviteActions onCancel={() => onOpenChange(false)} />
      </form>
    </SettleModal>
  );
};

const MemberRow = ({
  member,
  onRoleChange,
  onRemove,
}: {
  member: TeamMember;
  onRoleChange: (role: TeamRole) => void;
  onRemove: () => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-solid border-border/75 px-4 py-3 last:border-b-0">
    <div className="flex min-w-0 items-center gap-3">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-solid border-border bg-secondary font-sans text-xs font-semibold text-foreground">
        {member.initials}
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="m-0 truncate text-sm font-medium text-foreground">{member.name}</p>
          <Badge variant={member.role === "管理员" ? "signal" : "secondary"}>{member.role}</Badge>
        </div>
        <p className="m-0 truncate font-mono text-xs text-muted-foreground">{member.email}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-32">
        <SpringSelect
          aria-label={`切换 ${member.name} 的角色`}
          options={ROLE_OPTIONS}
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

export const Toolbar = ({
  query,
  roleFilter,
  onQueryChange,
  onRoleFilterChange,
}: {
  query: string;
  roleFilter: "全部" | TeamRole;
  onQueryChange: (next: string) => void;
  onRoleFilterChange: (next: "全部" | TeamRole) => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-solid border-border bg-background px-3 text-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20 sm:w-64 dark:bg-card">
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
    <div className="flex flex-wrap items-center gap-1 rounded-lg border border-solid border-border bg-secondary/50 p-1">
      {FILTER_ROLES.map((role) => (
        <button
          key={role}
          type="button"
          onClick={() => onRoleFilterChange(role)}
          className={cn(
            "h-7 cursor-pointer rounded-md border-0 px-2.5 font-sans text-xs font-medium transition-colors",
            roleFilter === role
              ? "bg-background text-foreground shadow-xs dark:bg-card"
              : "bg-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {role}
        </button>
      ))}
    </div>
  </div>
);

export const MemberListSection = ({
  members,
  onReset,
  onRoleChange,
  onRemove,
}: {
  members: TeamMember[];
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
    <div className="overflow-hidden rounded-xl border border-solid border-border">
      {members.map((member) => (
        <MemberRow
          key={member.id}
          member={member}
          onRoleChange={(role) => onRoleChange(member.id, role)}
          onRemove={() => onRemove(member.id)}
        />
      ))}
    </div>
  );
};
