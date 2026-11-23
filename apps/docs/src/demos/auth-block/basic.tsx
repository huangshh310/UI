"use client";

import { AuthBlock } from "@matt-ui/ui";
import { useState } from "react";

export default function AuthBlockBasicDemo() {
  const [notice, setNotice] = useState("");

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <AuthBlock
        showForgotPassword
        onSsoClick={() => setNotice("已发起企业 SSO 跳转")}
        onForgotPassword={() => setNotice("已发送重置密码邮件到你的工作邮箱")}
        onSubmit={({ mode, email }) =>
          setNotice(`已提交 ${mode === "login" ? "登录" : "注册"}：${email}`)
        }
      />
      {notice && <span className="font-mono text-xs text-muted-foreground">{notice}</span>}
    </div>
  );
}
