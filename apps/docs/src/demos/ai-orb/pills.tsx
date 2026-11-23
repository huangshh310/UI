"use client";

import { AiOrb } from "@matt-ui/motion";

export default function AiOrbPillsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <AiOrb state="thinking" variant="aurora" pill label="正在推演方案…" badge="Claude" />
      <AiOrb state="listening" variant="lattice" pill label="实时语音聆听" badge="LIVE" />
      <AiOrb state="speaking" variant="ring" pill label="语音播报回答" tone="emerald" />
    </div>
  );
}
