"use client";

import { AiVoiceStage } from "@matt-ui/motion";

export default function AiVoiceStageSpeakingDemo() {
  return (
    <AiVoiceStage
      defaultState="speaking"
      assistantName="Design Copilot Live"
      caption="“已把首页首屏与卡片舞台升级为陶瓷浮雕层次，是否需要顺手检查深色模式？”"
    />
  );
}
