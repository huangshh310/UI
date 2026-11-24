"use client";

import { AiVoiceStage } from "@matt-ui/motion";

export default function AiVoiceStageSpeakingDemo() {
  return (
    <AiVoiceStage
      variant="obsidian"
      defaultState="speaking"
      assistantName="Design Studio Live"
      modelLabel="Voice · Studio"
      durationLabel="02:18"
      caption="“已将审批卡与 Diff 审阅视图统一为 1px 发丝边框，需要我顺手核对深色主题对比度吗？”"
    />
  );
}
