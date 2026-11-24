"use client";

import { AiOrb } from "@matt-ui/motion";

export default function AiOrbPillsDemo() {
  return (
    <div className="flex w-full max-w-xl flex-wrap items-center justify-center gap-3 rounded-2xl border border-solid border-border/80 bg-muted/35 px-5 py-4 dark:border-white/10 dark:bg-white/[0.025]">
      <AiOrb state="thinking" variant="aurora" pill label="正在推演方案…" badge="Pro" />
      <AiOrb state="listening" variant="lattice" pill label="实时语音聆听" badge="LIVE" />
      <AiOrb state="speaking" variant="ring" pill label="语音播报回答" tone="emerald" />
    </div>
  );
}
