"use client";

import { AudioWaves } from "@matt-ui/motion";

export default function AudioWavesCompactDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <AudioWaves defaultActive bars={20} label="高采样率实时转写中…" durationLabel="01:04" />
      <AudioWaves
        defaultActive={false}
        bars={10}
        label="点击麦克风继续口述"
        durationLabel="00:00"
      />
    </div>
  );
}
