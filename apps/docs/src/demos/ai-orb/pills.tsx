"use client";

import { AiOrb } from "@matt-ui/motion";

export default function AiOrbPillsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <AiOrb state="thinking" variant="aurora" pill label="正在生成 UI 方案…" />
      <AiOrb state="listening" variant="lattice" pill label="点阵语音聆听中" />
      <AiOrb state="speaking" variant="aurora" pill label="流式播报回答" />
    </div>
  );
}
