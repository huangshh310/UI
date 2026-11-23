"use client";

import { Button, LockInput, Sheet, SpringSelect } from "@matt-ui/ui";
import { KeyRound } from "lucide-react";
import { useId, useState } from "react";

const ROLES = [
  { value: "owner", label: "工作区管理员" },
  { value: "editor", label: "组件维护者" },
  { value: "viewer", label: "只读成员" },
];

const MemberNameField = () => {
  const nameId = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={nameId} className="text-xs font-medium text-foreground">
        成员名称
      </label>
      <input
        id={nameId}
        defaultValue="林知远"
        className="h-9 rounded-lg border border-solid border-input/50 bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring focus:ring-inset dark:border-white/12 dark:bg-card"
      />
    </div>
  );
};

export default function SheetFormDemo() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("editor");
  const [token, setToken] = useState("mui_live_8291fa0c");

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      side="right"
      size="md"
      icon={<KeyRound className="size-4" />}
      badge="RBAC"
      trigger={<Button variant="signal">编辑成员凭证</Button>}
      title="成员权限与访问令牌"
      description="修改角色与私有 Registry 访问密钥，保存后立即同步。"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button variant="signal" size="sm" onClick={() => setOpen(false)}>
            保存配置
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <MemberNameField />
        <SpringSelect
          label="成员角色"
          options={ROLES}
          value={role}
          onValueChange={(v) => v && setRole(v)}
        />
        <LockInput
          label="Registry Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>
    </Sheet>
  );
}
