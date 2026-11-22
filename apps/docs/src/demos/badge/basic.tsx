"use client";

import { Badge } from "@matt-ui/ui";

export default function BadgeBasicDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge variant="default">默认</Badge>
      <Badge variant="secondary">中性</Badge>
      <Badge variant="outline">轮廓</Badge>
      <Badge variant="signal" dot>
        信号色
      </Badge>
      <Badge variant="success" dot>
        已通过
      </Badge>
      <Badge variant="warning" dot>
        待审核
      </Badge>
      <Badge variant="destructive" shape="tag">
        已阻断
      </Badge>
    </div>
  );
}
