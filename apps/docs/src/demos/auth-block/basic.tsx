"use client";

import { AuthBlock } from "@matt-ui/ui";
import { useState } from "react";

export default function AuthBlockBasicDemo() {
  const [notice, setNotice] = useState("");

  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      <AuthBlock
        onSsoClick={() => setNotice("已发起企业 SSO 跳转")}
        onSubmit={({ mode, email }) =>
          setNotice(`已提交 ${mode === "login" ? "登录" : "注册"}：${email}`)
        }
      />
      {notice && <span className="font-mono text-xs text-muted-foreground">{notice}</span>}
    </div>
  );
}
