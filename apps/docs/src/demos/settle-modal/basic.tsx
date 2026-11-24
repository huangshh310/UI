"use client";

import { Button, SettleModal } from "@matt-ui/ui";
import { Rocket } from "lucide-react";
import { useState } from "react";

export default function SettleModalBasicDemo() {
  const [open, setOpen] = useState(false);

  return (
    <SettleModal
      open={open}
      onOpenChange={setOpen}
      tone="signal"
      icon={<Rocket className="size-4" />}
      trigger={<Button variant="outline">打开模态框</Button>}
      title="发布生产版本"
      description="确认以下变更无误后，将自动同步到边缘节点与 Registry。"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button variant="signal" size="sm" onClick={() => setOpen(false)}>
            确认发布
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="release-tag" className="text-xs font-medium text-foreground">
            版本号标签
          </label>
          <input
            id="release-tag"
            type="text"
            defaultValue="v0.4.0"
            className="h-9 rounded-lg border border-solid border-input bg-card px-3 font-mono text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring focus:ring-inset"
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-solid border-border/75 bg-secondary/40 px-3 py-2 text-xs dark:border-white/8 dark:bg-white/[0.03]">
          <span className="text-muted-foreground">目标区域</span>
          <span className="font-mono font-medium text-foreground">ap-northeast-1 · 全球同步</span>
        </div>
      </div>
    </SettleModal>
  );
}
