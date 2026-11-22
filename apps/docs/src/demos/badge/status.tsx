"use client";

import { Badge } from "@matt-ui/ui";

export default function BadgeStatusDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Badge variant="success" dot>
        生产运行中
      </Badge>
      <Badge variant="signal" dot>
        构建同步中
      </Badge>
      <Badge variant="warning" dot>
        配额接近上限
      </Badge>
      <Badge variant="destructive" dot>
        健康检查失败
      </Badge>
      <Badge variant="outline" dot>
        待发布审核
      </Badge>
    </div>
  );
}
