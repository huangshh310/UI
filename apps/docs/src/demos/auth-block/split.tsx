"use client";

import { AuthBlock } from "@matt-ui/ui";
import { useState } from "react";

export default function AuthBlockSplitDemo() {
  const [notice, setNotice] = useState("");

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <AuthBlock
        layout="split"
        variant="elevated"
        brandName="matt-ui Studio"
        defaultMode="signup"
        onSsoClick={() => setNotice("正在跳转企业身份提供商…")}
        onSubmit={({ mode, email }) =>
          setNotice(`${mode === "login" ? "登录" : "注册"}请求已提交：${email}`)
        }
      />
      {notice && <span className="font-mono text-xs text-muted-foreground">{notice}</span>}
    </div>
  );
}
