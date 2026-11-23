"use client";

/**
 * 示例：成员指派可搜索下拉，带在线状态圆点与角色标注。
 */
import { Combobox } from "@matt-ui/ui";
import { UserCheck } from "lucide-react";
import { useState } from "react";

const MEMBERS = [
  {
    value: "lin",
    label: "林致远",
    description: "设计系统负责人",
    badge: "在线",
    dot: "success" as const,
  },
  {
    value: "zhou",
    label: "周安琪",
    description: "交互与动效工程",
    badge: "在线",
    dot: "success" as const,
  },
  {
    value: "chen",
    label: "陈明轩",
    description: "AI 体验研发",
    badge: "忙碌",
    dot: "warning" as const,
  },
  {
    value: "xu",
    label: "许嘉言",
    description: "无障碍与质量保障",
    badge: "离线",
    dot: "muted" as const,
  },
];

export default function ComboboxAssigneeDemo() {
  const [assignee, setAssignee] = useState<string | null>("lin");

  return (
    <div className="w-full max-w-80">
      <Combobox
        label="指派负责人"
        placeholder="输入姓名搜索成员…"
        emptyText="未找到对应成员"
        prefix={<UserCheck className="size-3.5" />}
        variant="elevated"
        options={MEMBERS}
        value={assignee}
        onValueChange={setAssignee}
        className="max-w-none"
      />
    </div>
  );
}
