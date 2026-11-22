"use client";

import { Button, Sheet } from "@matt-ui/ui";
import { useState } from "react";

export default function SheetFlushDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      side="right"
      size="sm"
      inset={false}
      trigger={<Button variant="outline">贴边模式（inset=false）</Button>}
      title="传统贴边抽屉"
      description="传入 inset={false} 时可切换为紧贴视口边缘的全高抽屉。"
      footer={
        <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
          关闭
        </Button>
      }
    >
      <p className="m-0 text-xs leading-relaxed text-muted-foreground">
        默认推荐使用 inset=true 悬浮留白圆角风格；在密集后台侧栏场景也可通过 inset=false 切换贴边。
      </p>
    </Sheet>
  );
}
