"use client";

import { CommandMenu, type CommandMenuGroup } from "@matt-ui/ui";
import { FilePlus2, FolderKanban, GitBranch, Users } from "lucide-react";
import { useState } from "react";

const WORKSPACE_GROUPS: CommandMenuGroup[] = [
  {
    heading: "新建",
    items: [
      {
        id: "new-issue",
        label: "新建需求单",
        description: "在当前迭代中快速创建任务",
        icon: <FilePlus2 className="size-3.5" />,
        shortcut: "C",
      },
      {
        id: "new-project",
        label: "创建项目路线图",
        icon: <FolderKanban className="size-3.5" />,
        badge: "PRO",
        shortcut: "G P",
      },
    ],
  },
  {
    heading: "协作与环境",
    items: [
      {
        id: "assign",
        label: "指派协作成员",
        icon: <Users className="size-3.5" />,
        subPage: {
          heading: "选择成员",
          items: [
            { id: "assign-lin", label: "林知远", description: "设计系统负责人" },
            { id: "assign-zhou", label: "周宁", description: "前端架构师" },
          ],
        },
      },
      {
        id: "switch-branch",
        label: "切换预览分支",
        icon: <GitBranch className="size-3.5" />,
        shortcut: "⌘ B",
      },
    ],
  },
];

export default function CommandMenuWorkspaceDemo() {
  const [picked, setPicked] = useState("支持多级工作区命令与徽章标注");

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-2.5">
      <CommandMenu
        size="lg"
        triggerLabel="工作区快速动作…"
        placeholder="输入 Issue、成员或分支操作…"
        onSelect={(id) => setPicked(`已触发动作：${id}`)}
        groups={WORKSPACE_GROUPS}
      />
      <span className="font-mono text-xs text-muted-foreground">{picked}</span>
    </div>
  );
}
