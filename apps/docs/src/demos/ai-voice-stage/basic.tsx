"use client";

import { AiVoiceStage } from "@matt-ui/motion";

export default function AiVoiceStageBasicDemo() {
  return (
    <AiVoiceStage
      assistantName="实时语音助手"
      modelLabel="Realtime · 24kHz"
      durationLabel="00:42"
    />
  );
}
