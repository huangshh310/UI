"use client";

import { TeamMembersBlock } from "@matt-ui/ui";

const DESIGN_TEAM = [
  {
    id: "d1",
    name: "顾川",
    email: "gu@studio.dev",
    role: "管理员" as const,
    initials: "顾",
    status: "online" as const,
  },
  {
    id: "d2",
    name: "苏叶",
    email: "su@studio.dev",
    role: "设计" as const,
    initials: "苏",
    status: "busy" as const,
  },
];

export default function TeamMembersBlockCompactDemo() {
  return (
    <TeamMembersBlock
      initialMembers={DESIGN_TEAM}
      title="设计系统核心小组"
      description="紧凑行高模式，适合内嵌在项目侧栏或子空间权限页。"
      variant="subtle"
      compact
      maxSeats={6}
    />
  );
}
