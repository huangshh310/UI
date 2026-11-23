"use client";

import { AvatarStack } from "@matt-ui/ui";

const TEAM = [
  { id: "1", name: "林知远", role: "架构", initials: "林", status: "online" as const },
  { id: "2", name: "周宁", role: "前端", initials: "周", status: "online" as const },
  { id: "3", name: "陈屿", role: "设计", initials: "陈", status: "away" as const },
  { id: "4", name: "许澄", role: "测试", initials: "许", status: "busy" as const },
  { id: "5", name: "陆川", role: "运维", initials: "陆", status: "offline" as const },
];

export default function AvatarStackSizesDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-4">
        <span className="w-8 font-mono text-xs text-muted-foreground">xs</span>
        <AvatarStack items={TEAM} max={3} size="xs" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 font-mono text-xs text-muted-foreground">sm</span>
        <AvatarStack items={TEAM} max={3} size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 font-mono text-xs text-muted-foreground">md</span>
        <AvatarStack items={TEAM} max={4} size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 font-mono text-xs text-muted-foreground">lg</span>
        <AvatarStack items={TEAM} max={4} size="lg" />
      </div>
    </div>
  );
}
