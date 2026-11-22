"use client";

import { AvatarStack } from "@matt-ui/ui";

const MEMBERS = [
  { id: "1", name: "林知远", role: "设计系统", initials: "林", status: "online" as const },
  { id: "2", name: "周宁", role: "前端架构", initials: "周", status: "online" as const },
  { id: "3", name: "陈屿", role: "动效工程", initials: "陈", status: "busy" as const },
  { id: "4", name: "许澄", role: "无障碍审计", initials: "许", status: "offline" as const },
  { id: "5", name: "陆川", role: "质量工程", initials: "陆" },
  { id: "6", name: "沈星", role: "文档维护", initials: "沈" },
];

export default function AvatarStackBasicDemo() {
  return <AvatarStack items={MEMBERS} max={4} size="md" />;
}
