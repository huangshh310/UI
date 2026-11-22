"use client";

import { OtpInput } from "@matt-ui/motion";
import { useState } from "react";

export default function OtpInputPinDemo() {
  const [pin, setPin] = useState("");
  return (
    <div className="flex flex-col items-center gap-2.5">
      <OtpInput
        length={4}
        mask
        label="4 位安全 PIN 码（掩码模式）"
        value={pin}
        onValueChange={setPin}
      />
      <span className="font-mono text-xs text-muted-foreground">已输入：{pin.length} / 4 位</span>
    </div>
  );
}
