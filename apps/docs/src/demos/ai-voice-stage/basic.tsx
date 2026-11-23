"use client";

import { AiVoiceStage } from "@matt-ui/motion";

export default function AiVoiceStageBasicDemo() {
  return (
    <AiVoiceStage
      assistantName="实时语音助手"
      modelLabel="Realtime · 24kHz"
      durationLabel="00:42"
      caption="“明天东京多云转晴，21°C，很适合上午去代官山散步，要我帮你记进日程吗？”"
    />
  );
}
