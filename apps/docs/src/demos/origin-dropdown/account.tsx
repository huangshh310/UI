"use client";

import { Button, OriginDropdown, type OriginDropdownEntry } from "@matt-ui/ui";
import { LogOut, Settings, Shield, User } from "lucide-react";
import { useState } from "react";

const accountGroup = (onAction: (label: string) => void): OriginDropdownEntry => ({
  kind: "group",
  label: "lin@matt.dev",
  items: [
    {
      kind: "action",
      id: "profile",
      label: "个人资料",
      icon: <User className="size-3.5" />,
      shortcut: "⌘P",
      onSelect: () => onAction("打开个人资料"),
    },
    {
      kind: "action",
      id: "prefs",
      label: "工作区偏好",
      icon: <Settings className="size-3.5" />,
      shortcut: "⌘,",
      onSelect: () => onAction("打开工作区偏好"),
    },
  ],
});

const buildAccountEntries = (
  auditNotify: boolean,
  onAuditChange: (next: boolean) => void,
  onAction: (label: string) => void,
): OriginDropdownEntry[] => [
  accountGroup(onAction),
  { kind: "separator" },
  {
    kind: "checkbox",
    id: "audit",
    label: "接收安全巡检推送",
    checked: auditNotify,
    onCheckedChange: onAuditChange,
  },
  {
    kind: "action",
    id: "sso",
    label: "SSO 凭证管理",
    icon: <Shield className="size-3.5" />,
    onSelect: () => onAction("打开 SSO 管理"),
  },
  { kind: "separator" },
  {
    kind: "action",
    id: "logout",
    label: "退出登录",
    icon: <LogOut className="size-3.5" />,
    tone: "destructive",
    onSelect: () => onAction("已退出登录"),
  },
];

export default function OriginDropdownAccountDemo() {
  const [lastAction, setLastAction] = useState("尚未操作");
  const [auditNotify, setAuditNotify] = useState(true);

  return (
    <div className="flex flex-col items-center gap-2.5">
      <OriginDropdown
        trigger={<Button variant="outline">账户与安全</Button>}
        items={buildAccountEntries(auditNotify, setAuditNotify, setLastAction)}
      />
      <span className="font-mono text-xs text-muted-foreground">{lastAction}</span>
    </div>
  );
}
