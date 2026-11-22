"use client";

import { AudioWaves } from "@matt-ui/motion";

export default function AudioWavesBasicDemo() {
  return (
    <AudioWaves
      defaultActive
      locale="中 / EN"
      durationLabel="00:18"
      transcript="把顶部高光和流体极光球同步到智能体驾驶舱…"
    />
  );
}
