"use client";

import { LiquidRippleButton } from "@matt-ui/ui";
import { useState } from "react";

export default function LiquidRippleButtonVariantsDemo() {
  const [clicks, setClicks] = useState(0);
  const bump = () => setClicks((c) => c + 1);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <LiquidRippleButton onClick={bump}>主要操作</LiquidRippleButton>
        <LiquidRippleButton variant="signal" onClick={bump}>
          信号波纹
        </LiquidRippleButton>
        <LiquidRippleButton variant="outline" onClick={bump}>
          发丝描边
        </LiquidRippleButton>
        <LiquidRippleButton variant="secondary" radius="default" size="sm" onClick={bump}>
          紧凑圆角
        </LiquidRippleButton>
        <LiquidRippleButton variant="destructive" size="sm" onClick={bump}>
          销毁环境
        </LiquidRippleButton>
      </div>
      <span className="font-mono text-xs text-muted-foreground">已触发 {clicks} 次波纹</span>
    </div>
  );
}
