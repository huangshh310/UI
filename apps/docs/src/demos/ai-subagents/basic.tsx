"use client";

import { useState } from "react";
import { AiSubagents } from "@matt-ui/ui";

export default function AiSubagentsBasicDemo() {
  const [runKey, setRunKey] = useState(0);

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex justify-end">
        <div className="max-w-[82%] rounded-2xl bg-muted/85 px-4 py-2.5 text-[13px] text-foreground">
          用户经常随机掉线退出登录，能帮忙排查一下原因吗？
        </div>
      </div>

      <p className="text-[13px] leading-relaxed text-foreground/90">
        我把排查拆成三个并行方向：一个子代理追踪会话创建链路，一个映射令牌刷新流程，另一个检查近期鉴权目录变更。
      </p>

      <AiSubagents key={runKey} variant="seamless" />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setRunKey((k) => k + 1)}
          className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          重置演示状态
        </button>
      </div>
    </div>
  );
}
