"use client";

import { OriginDropdown, type OriginDropdownEntry } from "@matt-ui/ui";
import { Download, Share2, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

const buildCompactItems = (
  liveSync: boolean,
  onSyncChange: (next: boolean) => void,
  onAction: (label: string) => void,
): OriginDropdownEntry[] => [
  {
    kind: "action",
    id: "ai-polish",
    label: "AI 智能润色",
    icon: <Sparkles className="size-3.5" />,
    badge: "NEW",
    tone: "signal",
    onSelect: () => onAction("已启动 AI 智能润色"),
  },
  { kind: "separator" },
  {
    kind: "action",
    id: "share",
    label: "分享只读链接",
    icon: <Share2 className="size-3.5" />,
    shortcut: "⌘⇧S",
    onSelect: () => onAction("已复制只读链接"),
  },
  {
    kind: "action",
    id: "export",
    label: "导出 JSON 配置",
    icon: <Download className="size-3.5" />,
    onSelect: () => onAction("已导出 JSON 配置"),
  },
  {
    kind: "checkbox",
    id: "sync",
    label: "开启云端实时同步",
    checked: liveSync,
    onCheckedChange: onSyncChange,
  },
  { kind: "separator" },
  {
    kind: "action",
    id: "delete",
    label: "移至回收站",
    icon: <Trash2 className="size-3.5" />,
    tone: "destructive",
    onSelect: () => onAction("已移至回收站"),
  },
];

export default function OriginDropdownCompactDemo() {
  const [status, setStatus] = useState("点击紧凑菜单体验信号色调与徽章");
  const [liveSync, setLiveSync] = useState(true);

  return (
    <div className="flex flex-col items-center gap-2.5">
      <OriginDropdown
        size="sm"
        triggerVariant="subtle"
        label="紧凑视图菜单"
        align="center"
        items={buildCompactItems(liveSync, setLiveSync, setStatus)}
      />
      <span className="font-mono text-xs text-muted-foreground">{status}</span>
    </div>
  );
}
