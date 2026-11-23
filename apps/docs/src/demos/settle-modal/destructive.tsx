"use client";

import { Button, SettleModal } from "@matt-ui/ui";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function SettleModalDestructiveDemo() {
  const [open, setOpen] = useState(false);

  return (
    <SettleModal
      open={open}
      onOpenChange={setOpen}
      size="sm"
      tone="destructive"
      icon={<AlertTriangle className="size-4" />}
      trigger={<Button variant="destructive">删除私有 Registry</Button>}
      title="确认删除私有 Registry？"
      description="删除后将永久清除 71 个组件的快照版本与历史访问密钥，该操作不可撤销。"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            保留现状
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setOpen(false)}>
            确认永久删除
          </Button>
        </>
      }
    >
      <div className="rounded-xl border border-solid border-destructive/25 bg-destructive/8 px-3 py-2.5 font-mono text-xs text-foreground dark:bg-destructive/12">
        目标资源：huangshh310/UI（production）
      </div>
    </SettleModal>
  );
}
