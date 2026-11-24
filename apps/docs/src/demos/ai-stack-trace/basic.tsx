"use client";

import { useState } from "react";
import { AiStackTrace } from "@matt-ui/ui";

export default function AiStackTraceBasicDemo() {
  const [fixNote, setFixNote] = useState<string | null>(null);

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-muted/85 px-4 py-2.5 text-[13px] text-foreground">
          /api/users 今天早上开始返回 500，能帮忙看下吗？
        </div>
      </div>

      <p className="text-[13px] leading-relaxed text-foreground/90">
        我先读取接口路由并直接请求本地开发服务复现问题。
      </p>

      <AiStackTrace
        variant="seamless"
        onAskFix={({ name, message }) =>
          setFixNote(
            `已提交修复请求：${name} (${message}) — 建议检查 ACCOUNTS_URL 8787 端口监听状态`,
          )
        }
      />

      {fixNote ? (
        <p className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-foreground">
          {fixNote}
        </p>
      ) : null}
    </div>
  );
}
