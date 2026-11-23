"use client";

import { AudioWaves } from "@matt-ui/motion";

export default function AudioWavesCompactDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <AudioWaves
        defaultActive
        tone="obsidian"
        variant="bars"
        bars={18}
        label="暗色演播室转写"
        durationLabel="01:04"
      />
      <AudioWaves
        defaultActive
        compact
        tone="emerald"
        variant="dots"
        bars={10}
        label="输入框内联口述"
        durationLabel="00:09"
      />
    </div>
  );
}
