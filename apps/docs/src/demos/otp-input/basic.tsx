"use client";

/**
 * 示例：OtpInput 的 6 位验证码输入、分组分隔与完成回调。
 */
import { OtpInput } from "@matt-ui/motion";
import { useState } from "react";

export const OtpInputBasic = () => {
  const [code, setCode] = useState("");
  const [completed, setCompleted] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <OtpInput
        label="二次验证安全码"
        length={6}
        separatorAt={3}
        value={code}
        onValueChange={setCode}
        onComplete={(value) => setCompleted(value)}
      />
      <p data-testid="otp-status" className="m-0 font-mono text-xs text-muted-foreground">
        {completed ? `已验证：${completed}` : "支持键盘逐位输入或直接粘贴 6 位数字"}
      </p>
    </div>
  );
};
