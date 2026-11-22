"use client";

import { MorphingDialog } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { useState } from "react";

export default function MorphingDialogBasicDemo() {
  const [open, setOpen] = useState(false);

  return (
    <MorphingDialog
      open={open}
      onOpenChange={setOpen}
      title="边缘发布管线"
      subtitle="东京 · ap-northeast-1"
      tag="运行中"
      footer={
        <Button size="sm" variant="signal" onClick={() => setOpen(false)}>
          知道了
        </Button>
      }
    >
      过去 24 小时共完成 18 次增量构建，平均冷启动 42ms，全链路通过可访问性与对比度校验。
    </MorphingDialog>
  );
}
