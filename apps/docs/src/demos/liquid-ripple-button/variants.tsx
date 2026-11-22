"use client";

import { LiquidRippleButton } from "@matt-ui/ui";
import { useState } from "react";

export default function LiquidRippleButtonVariantsDemo() {
  const [clicks, setClicks] = useState(0);

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <LiquidRippleButton onClick={() => setClicks((c) => c + 1)}>
          点击扩散波纹
        </LiquidRippleButton>
        <LiquidRippleButton
          className="bg-signal text-signal-foreground"
          onClick={() => setClicks((c) => c + 1)}
        >
          信号色波纹
        </LiquidRippleButton>
      </div>
      <span className="font-mono text-xs text-muted-foreground">已触发 {clicks} 次点击</span>
    </div>
  );
}
