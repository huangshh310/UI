"use client";

/**
 * 示例：Context 紧凑环形微表盘与毛玻璃分段 Token 压缩浮层。
 */
import { Context } from "@matt-ui/ui";
import { useState } from "react";

export default function ContextBasicDemo() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-start gap-2.5">
      <Context
        modelName="matt-pro"
        onCompact={(saved) =>
          setNotice(`已压缩历史与工具输出，释放 ${(saved / 1000).toFixed(1)}K Token`)
        }
      />
      <p className="m-0 text-xs text-muted-foreground">
        {notice ?? "点击环形百分比胶囊查看各分段 Token 占用并一键压缩上下文。"}
      </p>
    </div>
  );
}
