"use client";

import { Button, Sheet, type SheetSide } from "@matt-ui/ui";
import { useState } from "react";

const SIDES: { side: SheetSide; label: string }[] = [
  { side: "right", label: "右侧悬浮" },
  { side: "left", label: "左侧导航" },
  { side: "top", label: "顶部通知" },
  { side: "bottom", label: "底部面板" },
];

export default function SheetSidesDemo() {
  const [active, setActive] = useState<SheetSide | null>(null);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {SIDES.map(({ side, label }) => (
        <Button key={side} variant="outline" size="sm" onClick={() => setActive(side)}>
          {label}
        </Button>
      ))}
      <Sheet
        open={active !== null}
        onOpenChange={(open) => !open && setActive(null)}
        side={active ?? "right"}
        size="sm"
        title={`从 ${active ?? "right"} 方向滑入`}
        description="默认启用四周圆角与视口留白间距，与背景形成轻盈悬浮层次。"
        footer={
          <Button size="sm" variant="signal" onClick={() => setActive(null)}>
            知道了
          </Button>
        }
      >
        <p className="m-0 text-xs leading-relaxed text-muted-foreground">
          无论从哪一侧弹出，面板均保持统一 16px 四周圆角与四周留白，不紧贴浏览器边缘。
        </p>
      </Sheet>
    </div>
  );
}
