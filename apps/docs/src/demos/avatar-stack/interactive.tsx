"use client";

import { AvatarStack } from "@matt-ui/ui";
import { useState } from "react";

const MEMBERS = [
  { id: "1", name: "林知远", role: "设计系统", initials: "林", status: "online" as const },
  { id: "2", name: "周宁", role: "前端架构", initials: "周", status: "online" as const },
  { id: "3", name: "陈屿", role: "动效工程", initials: "陈", status: "away" as const },
  { id: "4", name: "许澄", role: "无障碍审计", initials: "许", status: "busy" as const },
  { id: "5", name: "陆川", role: "质量工程", initials: "陆", status: "offline" as const },
  { id: "6", name: "沈星", role: "文档维护", initials: "沈", status: "online" as const },
];

export default function AvatarStackInteractiveDemo() {
  const [selected, setSelected] = useState("点击头像或 +N 查看成员详情");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <AvatarStack
        items={MEMBERS}
        max={expanded ? MEMBERS.length : 3}
        size="md"
        spacing={expanded ? "loose" : "normal"}
        onItemClick={(item) => setSelected(`已选中：${item.name}（${item.role ?? "成员"}）`)}
        onOverflowClick={() => {
          setExpanded(true);
          setSelected(`已展开全部 ${MEMBERS.length} 位成员`);
        }}
      />
      <span className="font-mono text-xs text-muted-foreground">{selected}</span>
    </div>
  );
}
