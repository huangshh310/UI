"use client";

import { AiAgentCockpitBlock } from "@matt-ui/motion";

export default function AiAgentCockpitBlockVoiceModeDemo() {
  return (
    <AiAgentCockpitBlock
      defaultMode="voice"
      variant="studio"
      title="实时语音协同驾驶舱"
      subtitle="启动即进入低延迟语音听写与频谱联动状态。"
    />
  );
}
