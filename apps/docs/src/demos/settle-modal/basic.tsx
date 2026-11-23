"use client";

import { Button, SettleModal } from "@matt-ui/ui";
import { useState } from "react";

export default function SettleModalBasicDemo() {
  const [open, setOpen] = useState(false);

  return (
    <SettleModal
      open={open}
      onOpenChange={setOpen}
      trigger={<Button variant="outline">打开模态框</Button>}
      title="发布生产版本"
      description="确认以下变更无误后，将自动同步到边缘节点与 Registry。"
      footer={
        <>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button variant="signal" onClick={() => setOpen(false)}>
            确认发布
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="release-tag" className="text-xs font-medium text-muted-foreground">
          版本号标签
        </label>
        <input
          id="release-tag"
          type="text"
          defaultValue="v0.4.0"
          className="h-9 rounded-lg border border-solid border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring focus:ring-inset dark:bg-card"
        />
      </div>
    </SettleModal>
  );
}
