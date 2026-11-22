"use client";

import { TeamMembersBlock } from "@matt-ui/ui";
import { useState } from "react";

export default function TeamMembersBlockBasicDemo() {
  const [notice, setNotice] = useState("");
  return (
    <div className="flex w-full flex-col gap-2">
      <TeamMembersBlock
        onInvite={({ name, role }) => setNotice(`已向 ${name}（${role}）发送邀请`)}
      />
      {notice && <p className="m-0 px-1 font-mono text-xs text-muted-foreground">{notice}</p>}
    </div>
  );
}
