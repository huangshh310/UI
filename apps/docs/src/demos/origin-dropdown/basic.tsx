"use client";

import { OriginDropdown, type OriginDropdownEntry } from "@matt-ui/ui";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

const buildItems = (
  showGrid: boolean,
  onToggleGrid: (next: boolean) => void,
  onPick: (label: string) => void,
): OriginDropdownEntry[] => [
  {
    kind: "group",
    label: "快捷编辑",
    items: [
      {
        kind: "action",
        id: "rename",
        label: "重命名项目",
        description: "修改显示名称与路径",
        icon: <Pencil className="size-3.5" />,
        shortcut: "⌘R",
        onSelect: () => onPick("重命名项目"),
      },
      {
        kind: "action",
        id: "duplicate",
        label: "创建副本",
        icon: <Copy className="size-3.5" />,
        shortcut: "⌘D",
        onSelect: () => onPick("创建副本"),
      },
      {
        kind: "checkbox",
        id: "grid",
        label: "显示标尺网格",
        checked: showGrid,
        onCheckedChange: onToggleGrid,
      },
    ],
  },
  { kind: "separator" },
  {
    kind: "action",
    id: "archive",
    label: "归档并移除",
    icon: <Trash2 className="size-3.5" />,
    tone: "destructive",
    onSelect: () => onPick("归档并移除"),
  },
];

export default function OriginDropdownBasicDemo() {
  const [showGrid, setShowGrid] = useState(true);
  const [lastAction, setLastAction] = useState("未触发");

  return (
    <div className="flex flex-col items-center gap-2.5">
      <OriginDropdown label="工作区菜单" items={buildItems(showGrid, setShowGrid, setLastAction)} />
      <span className="font-mono text-xs text-muted-foreground">最近操作：{lastAction}</span>
    </div>
  );
}
