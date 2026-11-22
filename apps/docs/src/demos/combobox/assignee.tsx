"use client";

import { Combobox } from "@matt-ui/ui";
import { useState } from "react";

const MEMBERS = [
  { value: "lin", label: "林知远（架构师）" },
  { value: "zhou", label: "周宁（前端工程）" },
  { value: "chen", label: "陈屿（交互设计）" },
  { value: "xu", label: "许澄（测试工程）" },
];

export default function ComboboxAssigneeDemo() {
  const [assignee, setAssignee] = useState<string | null>("lin");

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Combobox
        label="指派审阅负责人"
        placeholder="输入姓名检索…"
        options={MEMBERS}
        value={assignee}
        onValueChange={setAssignee}
      />
      <span className="font-mono text-xs text-muted-foreground">
        当前指派：{assignee ?? "未指派"}
      </span>
    </div>
  );
}
