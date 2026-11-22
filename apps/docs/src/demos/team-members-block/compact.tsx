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
    status: "online" as const,
  },
];

export default function TeamMembersBlockCompactDemo() {
  return <TeamMembersBlock initialMembers={DESIGN_TEAM} />;
}
