"use client";

/**
 * 示例：4 位掩码 PIN 安全输入，结合柔灰填充风格与提示文案。
 */
import { OtpInput } from "@matt-ui/motion";
import { useState } from "react";

export default function OtpInputPinDemo() {
  const [pin, setPin] = useState("");

  return (
    <OtpInput
      label="支付安全 PIN"
      variant="filled"
      size="lg"
      length={4}
      mask
      status={pin.length === 4 ? "success" : "default"}
      hint={pin.length === 4 ? "4 位安全密码已就绪" : "输入 4 位数字，字符将自动掩码隐藏"}
      value={pin}
      onValueChange={setPin}
    />
  );
}
