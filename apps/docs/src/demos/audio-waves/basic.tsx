"use client";

import { AudioWaves } from "@matt-ui/motion";

export default function AudioWavesBasicDemo() {
  return (
    <AudioWaves
      defaultActive
      tone="signal"
      locale="中 / EN"
      durationLabel="00:18"
      transcript="把审批卡片与代码差异审阅统一到同一套发丝边框设计语言…"
    />
  );
}
