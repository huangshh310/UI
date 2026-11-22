"use client";

import { Button, Sheet } from "@matt-ui/ui";
import { useState } from "react";

export default function SheetBasicDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      side="right"
      size="sm"
      trigger={<Button variant="outline">打开右侧抽屉</Button>}
      title="节点运行配置"
      description="调整区域路由策略与日志采样率。"
      footer={
        <>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            关闭
          </Button>
          <Button variant="signal" onClick={() => setOpen(false)}>
            保存更改
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3 text-xs leading-relaxed text-muted-foreground">
        <div className="rounded-xl border border-solid border-border bg-secondary/40 p-3">
          <p className="m-0 font-medium text-foreground">当前区域：ap-northeast-1</p>
          <p className="m-0 mt-1">P95 延迟 16ms · 零丢包</p>
        </div>
        <p className="m-0">抽屉页头与底部操作区保持固定，主体超出高度后自动独立滚动。</p>
      </div>
    </Sheet>
  );
}
